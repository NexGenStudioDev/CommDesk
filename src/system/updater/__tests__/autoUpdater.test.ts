import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Hoisted mocks — must be declared before any imports that use them
const mockCheck = vi.hoisted(() => vi.fn());
const mockRelaunch = vi.hoisted(() => vi.fn());
const mockDownloadAndInstall = vi.hoisted(() => vi.fn());

vi.mock("@tauri-apps/plugin-updater", () => ({ check: mockCheck }));
vi.mock("@tauri-apps/plugin-process", () => ({ relaunch: mockRelaunch }));

// Import AFTER mocks are registered
import { startAutoUpdater } from "@/system/updater/autoUpdater";

function setTauriRuntime(present: boolean) {
  if (present) {
    Object.defineProperty(window, "__TAURI_INTERNALS__", {
      writable: true,
      configurable: true,
      value: {},
    });
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).__TAURI_INTERNALS__;
  }
}

// Reset the module-level `isUpdaterStarted` flag between tests
async function freshImport() {
  vi.resetModules();
  const mod = await import("@/system/updater/autoUpdater");
  return mod.startAutoUpdater;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("DEV", false);
  setTauriRuntime(true);
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  setTauriRuntime(false);
});

describe("startAutoUpdater", () => {
  it("does nothing outside Tauri runtime", async () => {
    setTauriRuntime(false);
    const fn = await freshImport();
    await fn();
    expect(mockCheck).not.toHaveBeenCalled();
  });

  it("does nothing in DEV environment", async () => {
    vi.stubEnv("DEV", true);
    // Re-import so import.meta.env.DEV is re-evaluated
    const fn = await freshImport();
    setTauriRuntime(true);
    await fn();
    expect(mockCheck).not.toHaveBeenCalled();
  });

  it("calls check() when in Tauri runtime and not DEV", async () => {
    mockCheck.mockResolvedValue(null);
    const fn = await freshImport();
    await fn();
    expect(mockCheck).toHaveBeenCalledOnce();
  });

  it("does not relaunch when no update is available", async () => {
    mockCheck.mockResolvedValue(null);
    const fn = await freshImport();
    await fn();
    expect(mockRelaunch).not.toHaveBeenCalled();
  });

  it("downloads and installs when update is available", async () => {
    mockCheck.mockResolvedValue({
      version: "1.0.1",
      downloadAndInstall: mockDownloadAndInstall.mockResolvedValue(undefined),
    });
    const fn = await freshImport();
    await fn();
    expect(mockDownloadAndInstall).toHaveBeenCalledOnce();
  });

  it("relaunches after install when silent is false", async () => {
    mockCheck.mockResolvedValue({
      version: "1.0.1",
      downloadAndInstall: mockDownloadAndInstall.mockResolvedValue(undefined),
    });
    const fn = await freshImport();
    await fn({ silent: false });
    expect(mockRelaunch).toHaveBeenCalledOnce();
  });

  it("does not relaunch when silent is true", async () => {
    mockCheck.mockResolvedValue({
      version: "1.0.1",
      downloadAndInstall: mockDownloadAndInstall.mockResolvedValue(undefined),
    });
    const fn = await freshImport();
    await fn({ silent: true });
    expect(mockRelaunch).not.toHaveBeenCalled();
  });

  it("does not start twice (isUpdaterStarted guard)", async () => {
    mockCheck.mockResolvedValue(null);
    const fn = await freshImport();
    await fn();
    await fn();
    expect(mockCheck).toHaveBeenCalledOnce();
  });

  it("sets up interval when checkIntervalMs > 0", async () => {
    mockCheck.mockResolvedValue(null);
    const setIntervalSpy = vi.spyOn(window, "setInterval");
    const fn = await freshImport();
    await fn({ checkIntervalMs: 5000 });
    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 5000);
  });

  it("does not set up interval when checkIntervalMs is 0", async () => {
    mockCheck.mockResolvedValue(null);
    const setIntervalSpy = vi.spyOn(window, "setInterval");
    const fn = await freshImport();
    await fn({ checkIntervalMs: 0 });
    expect(setIntervalSpy).not.toHaveBeenCalled();
  });

  it("handles check() throwing without crashing", async () => {
    mockCheck.mockRejectedValue(new Error("network error"));
    const fn = await freshImport();
    await expect(fn()).resolves.toBeUndefined();
  });

  it("handles downloadAndInstall throwing without crashing", async () => {
    mockCheck.mockResolvedValue({
      version: "1.0.1",
      downloadAndInstall: vi.fn().mockRejectedValue(new Error("install failed")),
    });
    const fn = await freshImport();
    await expect(fn()).resolves.toBeUndefined();
  });

  it("interval triggers subsequent check calls", async () => {
    mockCheck.mockResolvedValue(null);
    const fn = await freshImport();
    await fn({ checkIntervalMs: 1000 });
    // First call already happened; advance timer to trigger interval
    await vi.advanceTimersByTimeAsync(1000);
    expect(mockCheck).toHaveBeenCalledTimes(2);
  });
});
