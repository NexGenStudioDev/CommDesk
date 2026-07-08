import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const checkMock = vi.fn();
const relaunchMock = vi.fn();
const getVersionMock = vi.fn();

// The test environment's window.localStorage is missing methods like
// clear() in this setup, so we swap in a small in-memory implementation
// rather than depend on it.
function installMemoryLocalStorage(): Storage {
  const store = new Map<string, string>();
  const storage: Storage = {
    getItem: (key: string) => (store.has(key) ? (store.get(key) as string) : null),
    setItem: (key: string, value: string) => {
      store.set(key, String(value));
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size;
    },
  };
  Object.defineProperty(window, "localStorage", {
    value: storage,
    configurable: true,
    writable: true,
  });
  return storage;
}

vi.mock("@tauri-apps/plugin-updater", () => ({
  check: (...args: unknown[]) => checkMock(...args),
}));

vi.mock("@tauri-apps/plugin-process", () => ({
  relaunch: (...args: unknown[]) => relaunchMock(...args),
}));

vi.mock("@tauri-apps/api/app", () => ({
  getVersion: (...args: unknown[]) => getVersionMock(...args),
}));

function makeUpdate(overrides: Partial<{
  version: string;
  currentVersion: string;
  download: () => Promise<void>;
  install: () => Promise<void>;
  close: () => Promise<void>;
}> = {}) {
  return {
    version: overrides.version ?? "2.0.0",
    currentVersion: overrides.currentVersion ?? "1.0.0",
    download: overrides.download ?? vi.fn().mockResolvedValue(undefined),
    install: overrides.install ?? vi.fn().mockResolvedValue(undefined),
    close: overrides.close ?? vi.fn().mockResolvedValue(undefined),
  };
}

describe("autoUpdater", () => {
  beforeEach(() => {
    vi.resetModules();
    checkMock.mockReset();
    relaunchMock.mockReset();
    getVersionMock.mockReset();
    installMemoryLocalStorage();
    vi.stubEnv("DEV", false);
    Object.defineProperty(window, "__TAURI_INTERNALS__", {
      value: {},
      configurable: true,
      writable: true,
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.useRealTimers();
    // @ts-expect-error test-only cleanup of a global we defined above
    delete window.__TAURI_INTERNALS__;
  });

  it("does nothing outside a Tauri runtime", async () => {
    // @ts-expect-error test-only cleanup of a global we defined above
    delete window.__TAURI_INTERNALS__;
    const { startAutoUpdater } = await import("./autoUpdater");

    await startAutoUpdater();

    expect(checkMock).not.toHaveBeenCalled();
  });

  it("does nothing in dev mode", async () => {
    vi.stubEnv("DEV", true);
    const { startAutoUpdater } = await import("./autoUpdater");

    await startAutoUpdater();

    expect(checkMock).not.toHaveBeenCalled();
  });

  it("reports up-to-date and does not download when no update is available", async () => {
    checkMock.mockResolvedValue(null);
    const { startAutoUpdater } = await import("./autoUpdater");
    const onStatusChange = vi.fn();

    await startAutoUpdater({ checkIntervalMs: 0, onStatusChange });

    expect(onStatusChange).toHaveBeenCalledWith({ type: "up-to-date" });
  });

  it("downloads, marks pending-install, installs, and relaunches on a found update", async () => {
    const update = makeUpdate();
    checkMock.mockResolvedValue(update);
    const { startAutoUpdater, __testing } = await import("./autoUpdater");
    const onStatusChange = vi.fn();

    await startAutoUpdater({ checkIntervalMs: 0, onStatusChange });

    expect(update.download).toHaveBeenCalledTimes(1);
    expect(update.install).toHaveBeenCalledTimes(1);
    expect(relaunchMock).toHaveBeenCalledTimes(1);
    expect(update.close).toHaveBeenCalledTimes(1);
    expect(onStatusChange).toHaveBeenCalledWith({ type: "installed", version: "2.0.0" });

    const raw = window.localStorage.getItem(__testing.STATE_STORAGE_KEY);
    expect(raw).not.toBeNull();
    const state = JSON.parse(raw as string);
    expect(state.status).toBe("pending-install");
    expect(state.toVersion).toBe("2.0.0");
  });

  it("does not relaunch when silent is true", async () => {
    const update = makeUpdate();
    checkMock.mockResolvedValue(update);
    const { startAutoUpdater } = await import("./autoUpdater");

    await startAutoUpdater({ checkIntervalMs: 0, silent: true });

    expect(update.install).toHaveBeenCalledTimes(1);
    expect(relaunchMock).not.toHaveBeenCalled();
  });

  it("never calls install when download fails, and does not count it as a failure", async () => {
    const update = makeUpdate({ download: vi.fn().mockRejectedValue(new Error("network down")) });
    checkMock.mockResolvedValue(update);
    const { startAutoUpdater, __testing } = await import("./autoUpdater");
    const onStatusChange = vi.fn();

    await startAutoUpdater({ checkIntervalMs: 0, onStatusChange });

    expect(update.install).not.toHaveBeenCalled();
    expect(onStatusChange).toHaveBeenCalledWith({
      type: "check-failed",
      error: expect.any(Error),
    });

    const raw = window.localStorage.getItem(__testing.STATE_STORAGE_KEY);
    expect(raw).toBeNull();
  });

  it("marks pending-install as failed and increments consecutiveFailures when install() throws", async () => {
    const update = makeUpdate({ install: vi.fn().mockRejectedValue(new Error("install failed")) });
    checkMock.mockResolvedValue(update);
    const { startAutoUpdater, __testing } = await import("./autoUpdater");
    const onStatusChange = vi.fn();

    await startAutoUpdater({ checkIntervalMs: 0, onStatusChange });

    expect(relaunchMock).not.toHaveBeenCalled();
    expect(onStatusChange).toHaveBeenCalledWith({
      type: "install-failed",
      error: expect.any(Error),
    });

    const raw = window.localStorage.getItem(__testing.STATE_STORAGE_KEY);
    const state = JSON.parse(raw as string);
    expect(state.status).toBe("idle");
    expect(state.consecutiveFailures).toBe(1);
  });

  it("confirms a pending update when the app boots into the expected version", async () => {
    const { __testing } = await import("./autoUpdater");
    window.localStorage.setItem(
      __testing.STATE_STORAGE_KEY,
      JSON.stringify({
        status: "pending-install",
        fromVersion: "1.0.0",
        toVersion: "2.0.0",
        attemptedAt: Date.now(),
        consecutiveFailures: 0,
      })
    );
    getVersionMock.mockResolvedValue("2.0.0");
    checkMock.mockResolvedValue(null);
    const { startAutoUpdater } = await import("./autoUpdater");
    const onStatusChange = vi.fn();

    await startAutoUpdater({ checkIntervalMs: 0, onStatusChange });

    expect(onStatusChange).toHaveBeenCalledWith({ type: "update-confirmed", version: "2.0.0" });
    const raw = window.localStorage.getItem(__testing.STATE_STORAGE_KEY);
    const state = JSON.parse(raw as string);
    expect(state.status).toBe("idle");
    expect(state.consecutiveFailures).toBe(0);
  });

  it("detects an update that did not apply and increments consecutiveFailures", async () => {
    const { __testing } = await import("./autoUpdater");
    window.localStorage.setItem(
      __testing.STATE_STORAGE_KEY,
      JSON.stringify({
        status: "pending-install",
        fromVersion: "1.0.0",
        toVersion: "2.0.0",
        attemptedAt: Date.now(),
        consecutiveFailures: 0,
      })
    );
    // The app is still on the old version — the update silently failed to apply.
    getVersionMock.mockResolvedValue("1.0.0");
    checkMock.mockResolvedValue(null);
    const { startAutoUpdater } = await import("./autoUpdater");
    const onStatusChange = vi.fn();

    await startAutoUpdater({ checkIntervalMs: 0, onStatusChange });

    expect(onStatusChange).toHaveBeenCalledWith({
      type: "update-did-not-apply",
      expectedVersion: "2.0.0",
      actualVersion: "1.0.0",
    });
    const raw = window.localStorage.getItem(__testing.STATE_STORAGE_KEY);
    const state = JSON.parse(raw as string);
    expect(state.consecutiveFailures).toBe(1);
  });

  it("pauses auto-install after reaching the consecutive failure threshold", async () => {
    const { __testing } = await import("./autoUpdater");
    window.localStorage.setItem(
      __testing.STATE_STORAGE_KEY,
      JSON.stringify({
        status: "idle",
        consecutiveFailures: __testing.MAX_CONSECUTIVE_FAILURES,
      })
    );
    const update = makeUpdate();
    checkMock.mockResolvedValue(update);
    const { startAutoUpdater } = await import("./autoUpdater");
    const onStatusChange = vi.fn();

    await startAutoUpdater({ checkIntervalMs: 0, onStatusChange });

    expect(checkMock).not.toHaveBeenCalled();
    expect(onStatusChange).toHaveBeenCalledWith({
      type: "auto-update-paused",
      consecutiveFailures: __testing.MAX_CONSECUTIVE_FAILURES,
    });
  });
});
