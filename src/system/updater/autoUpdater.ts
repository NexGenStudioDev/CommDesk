import type { DownloadEvent } from "@tauri-apps/plugin-updater";
import { check } from "@tauri-apps/plugin-updater";
import { relaunch } from "@tauri-apps/plugin-process";
import { getVersion } from "@tauri-apps/api/app";

const DEFAULT_CHECK_INTERVAL_MS = 6 * 60 * 60 * 1000;
const DEFAULT_TIMEOUT_MS = 30_000;

// After this many consecutive failed update attempts, stop auto-installing
// until the app is restarted. Prevents a bad release from triggering an
// endless check -> download -> install -> crash -> retry loop.
const MAX_CONSECUTIVE_FAILURES = 3;

const STATE_STORAGE_KEY = "commdesk-updater-state";

let isUpdaterStarted = false;

export type UpdaterStatus =
  | { type: "checking" }
  | { type: "up-to-date" }
  | { type: "downloading"; version: string }
  | { type: "installed"; version: string }
  | { type: "update-confirmed"; version: string }
  | { type: "check-failed"; error: unknown }
  | { type: "install-failed"; error: unknown }
  | { type: "update-did-not-apply"; expectedVersion: string; actualVersion: string }
  | { type: "auto-update-paused"; consecutiveFailures: number };

type AutoUpdaterOptions = {
  checkIntervalMs?: number;
  silent?: boolean;
  onStatusChange?: (status: UpdaterStatus) => void;
};

interface UpdaterState {
  // "pending-install" is written right before install() and only cleared
  // (or escalated to a failure) once the *next* launch confirms whether the
  // new version actually came up. This is what lets us tell a successful
  // update apart from one that silently failed to take effect.
  status: "idle" | "pending-install";
  fromVersion?: string;
  toVersion?: string;
  attemptedAt?: number;
  consecutiveFailures: number;
}

const DEFAULT_STATE: UpdaterState = {
  status: "idle",
  consecutiveFailures: 0,
};

function isTauriRuntime(): boolean {
  return typeof window !== "undefined" && "__TAURI_INTERNALS__" in window;
}

function readState(): UpdaterState {
  try {
    const raw = window.localStorage.getItem(STATE_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw) as Partial<UpdaterState>;
    return {
      status: parsed.status === "pending-install" ? "pending-install" : "idle",
      fromVersion: parsed.fromVersion,
      toVersion: parsed.toVersion,
      attemptedAt: parsed.attemptedAt,
      consecutiveFailures:
        typeof parsed.consecutiveFailures === "number" ? parsed.consecutiveFailures : 0,
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function writeState(state: UpdaterState): void {
  try {
    window.localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage unavailable (e.g. private mode). Not fatal — worst case we
    // lose failure-loop protection across a single relaunch.
  }
}

/**
 * Resolves any update attempt left pending from a previous session by
 * comparing the version we expected to boot into against the version that
 * is actually running now.
 */
async function reconcilePendingUpdate(
  onStatusChange?: (status: UpdaterStatus) => void
): Promise<UpdaterState> {
  const state = readState();
  if (state.status !== "pending-install") {
    return state;
  }

  const currentVersion = await getVersion();

  if (currentVersion === state.toVersion) {
    const resolved: UpdaterState = { status: "idle", consecutiveFailures: 0 };
    writeState(resolved);
    onStatusChange?.({ type: "update-confirmed", version: currentVersion });
    return resolved;
  }

  // We relaunched expecting toVersion but are still running something else.
  // The update did not apply — treat it as a failure without touching
  // anything further, and let the retry/backoff logic below decide whether
  // to try again this session.
  const failedState: UpdaterState = {
    status: "idle",
    consecutiveFailures: state.consecutiveFailures + 1,
  };
  writeState(failedState);
  onStatusChange?.({
    type: "update-did-not-apply",
    expectedVersion: state.toVersion ?? "unknown",
    actualVersion: currentVersion,
  });
  return failedState;
}

function onDownloadEvent(
  event: DownloadEvent,
  version: string,
  onStatusChange?: (status: UpdaterStatus) => void
): void {
  switch (event.event) {
    case "Started":
      console.info(`[updater] started downloading ${event.data.contentLength ?? "?"} bytes`);
      onStatusChange?.({ type: "downloading", version });
      break;
    case "Progress":
      console.info(`[updater] downloaded chunk ${event.data.chunkLength} bytes`);
      break;
    case "Finished":
      console.info("[updater] download finished");
      break;
  }
}

async function checkAndInstallUpdate(
  silent: boolean,
  state: UpdaterState,
  onStatusChange?: (status: UpdaterStatus) => void
): Promise<void> {
  onStatusChange?.({ type: "checking" });

  const update = await check({ timeout: DEFAULT_TIMEOUT_MS }).catch((error: unknown) => {
    console.error("[updater] check failed", error);
    onStatusChange?.({ type: "check-failed", error });
    return null;
  });

  if (!update) {
    console.info("[updater] no update available");
    onStatusChange?.({ type: "up-to-date" });
    return;
  }

  console.info(`[updater] update found: ${update.version}`);

  try {
    // download() and install() are kept as two distinct steps (rather than
    // the combined downloadAndInstall()) specifically so that a corrupted
    // or interrupted download never reaches the install step at all — the
    // app is only ever at risk once install() is actually called. A pure
    // download failure (network blip, server hiccup) is not counted toward
    // consecutiveFailures: it is transient and self-heals on the next
    // interval without ever touching the running app.
    try {
      await update.download((event) => onDownloadEvent(event, update.version, onStatusChange), {
        timeout: DEFAULT_TIMEOUT_MS,
      });
    } catch (downloadError) {
      console.error("[updater] download failed", downloadError);
      onStatusChange?.({ type: "check-failed", error: downloadError });
      return;
    }

    const nextState: UpdaterState = {
      status: "pending-install",
      fromVersion: update.currentVersion,
      toVersion: update.version,
      attemptedAt: Date.now(),
      consecutiveFailures: state.consecutiveFailures,
    };
    writeState(nextState);

    await update.install();
    console.info("[updater] update installed");
    onStatusChange?.({ type: "installed", version: update.version });

    if (!silent) {
      await relaunch();
    }
  } catch (error) {
    // install() (or relaunch()) failed after a successful download — this
    // is the case that can plausibly leave the app in a broken state, so it
    // is the one that counts toward the auto-update pause threshold.
    console.error("[updater] install failed", error);
    writeState({ status: "idle", consecutiveFailures: state.consecutiveFailures + 1 });
    onStatusChange?.({ type: "install-failed", error });
  } finally {
    await update.close();
  }
}

export async function startAutoUpdater(options: AutoUpdaterOptions = {}): Promise<void> {
  if (isUpdaterStarted || import.meta.env.DEV || !isTauriRuntime()) {
    return;
  }

  isUpdaterStarted = true;

  const silent = options.silent ?? false;
  const checkIntervalMs =
    options.checkIntervalMs === undefined ? DEFAULT_CHECK_INTERVAL_MS : options.checkIntervalMs;

  let state = await reconcilePendingUpdate(options.onStatusChange);

  const runCheck = async () => {
    if (state.consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
      console.warn(
        `[updater] paused after ${state.consecutiveFailures} consecutive failures; skipping auto-install until restart`
      );
      options.onStatusChange?.({
        type: "auto-update-paused",
        consecutiveFailures: state.consecutiveFailures,
      });
      return;
    }
    await checkAndInstallUpdate(silent, state, options.onStatusChange);
    state = readState();
  };

  await runCheck();

  if (checkIntervalMs > 0) {
    window.setInterval(() => {
      void runCheck();
    }, checkIntervalMs);
  }
}

// Exposed for tests only.
export const __testing = {
  STATE_STORAGE_KEY,
  MAX_CONSECUTIVE_FAILURES,
  resetForTests(): void {
    isUpdaterStarted = false;
    try {
      window.localStorage.removeItem(STATE_STORAGE_KEY);
    } catch {
      // ignore
    }
  },
};
