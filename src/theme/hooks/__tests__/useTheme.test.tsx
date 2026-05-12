import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTheme } from "@/theme/hooks/useTheme";
import { ThemeProvider } from "@/theme";
import React from "react";

function wrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
  document.documentElement.classList.remove("dark");
  document.documentElement.removeAttribute("data-theme");
});

describe("useTheme", () => {
  it("throws when used outside ThemeProvider", () => {
    expect(() => renderHook(() => useTheme())).toThrow(
      "useTheme must be used inside <ThemeProvider>",
    );
  });

  it("returns mode, theme, toggle, and setMode", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.mode).toBeDefined();
    expect(result.current.theme).toBeDefined();
    expect(typeof result.current.toggle).toBe("function");
    expect(typeof result.current.setMode).toBe("function");
  });

  it("defaults to light mode when no stored preference and matchMedia returns false", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.mode).toBe("light");
  });

  it("defaults to dark mode when system prefers dark", () => {
    window.matchMedia = (query: string) => ({
      matches: query === "(prefers-color-scheme: dark)",
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });

    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.mode).toBe("dark");

    // restore
    window.matchMedia = (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });
  });

  it("restores persisted theme from localStorage", () => {
    localStorage.setItem("commdesk-theme", "dark");
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.mode).toBe("dark");
  });

  it("toggle switches from light to dark", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    act(() => result.current.toggle());
    expect(result.current.mode).toBe("dark");
  });

  it("toggle switches from dark back to light", () => {
    localStorage.setItem("commdesk-theme", "dark");
    const { result } = renderHook(() => useTheme(), { wrapper });
    act(() => result.current.toggle());
    expect(result.current.mode).toBe("light");
  });

  it("setMode persists to localStorage", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    act(() => result.current.setMode("dark"));
    expect(localStorage.getItem("commdesk-theme")).toBe("dark");
  });

  it("setMode applies dark class to documentElement", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    act(() => result.current.setMode("dark"));
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("setMode removes dark class when switching to light", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    act(() => result.current.setMode("dark"));
    act(() => result.current.setMode("light"));
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("theme tokens are defined and contain expected keys", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(result.current.theme.text.primary).toBeDefined();
    expect(result.current.theme.bg.surface).toBeDefined();
    expect(result.current.theme.danger.default).toBeDefined();
  });
});
