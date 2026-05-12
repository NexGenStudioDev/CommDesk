import { vi } from "vitest";

// Simulate Tauri runtime presence
export function mockTauriRuntime() {
  Object.defineProperty(window, "__TAURI_INTERNALS__", {
    writable: true,
    configurable: true,
    value: {},
  });
}

export function clearTauriRuntime() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (window as any).__TAURI_INTERNALS__;
}

export const mockCheck = vi.fn();
export const mockRelaunch = vi.fn();
export const mockDownloadAndInstall = vi.fn();

vi.mock("@tauri-apps/plugin-updater", () => ({
  check: mockCheck,
}));

vi.mock("@tauri-apps/plugin-process", () => ({
  relaunch: mockRelaunch,
}));
