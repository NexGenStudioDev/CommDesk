import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { withTheme } from "@/test/mocks/theme";
import Button from "@/Component/ui/Button";

function renderButton(props: Partial<React.ComponentProps<typeof Button>> = {}) {
  const onClick = props.onClick ?? vi.fn();
  return render(withTheme(<Button text="Click me" onClick={onClick} {...props} />));
}

describe("Button", () => {
  it("renders button text", () => {
    renderButton();
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("renders icon when provided", () => {
    renderButton({ icon: <span data-testid="icon">★</span> });
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    renderButton({ onClick });
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", async () => {
    const onClick = vi.fn();
    renderButton({ onClick, disabled: true });
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("has disabled attribute when disabled prop is true", () => {
    renderButton({ disabled: true });
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("applies primary variant class by default", () => {
    renderButton({ variant: "primary" });
    expect(screen.getByRole("button").className).toContain("cd-btn-primary");
  });

  it("applies secondary variant class", () => {
    renderButton({ variant: "secondary" });
    expect(screen.getByRole("button").className).toContain("cd-btn-secondary");
  });

  it("applies ghost variant class", () => {
    renderButton({ variant: "ghost" });
    expect(screen.getByRole("button").className).toContain("cd-btn-ghost");
  });

  it("applies danger variant class", () => {
    renderButton({ variant: "danger" });
    expect(screen.getByRole("button").className).toContain("cd-btn-danger");
  });

  it("applies disabled style class when disabled", () => {
    renderButton({ disabled: true });
    expect(screen.getByRole("button").className).toContain("cursor-not-allowed");
  });

  it("applies custom className", () => {
    renderButton({ className: "my-custom-class" });
    expect(screen.getByRole("button").className).toContain("my-custom-class");
  });

  it("applies custom width and height via style", () => {
    renderButton({ width: "200px", height: "50px" });
    const btn = screen.getByRole("button");
    expect(btn).toHaveStyle({ width: "200px", height: "50px" });
  });

  it("is keyboard accessible via Enter key", async () => {
    const onClick = vi.fn();
    renderButton({ onClick });
    screen.getByRole("button").focus();
    await userEvent.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("is keyboard accessible via Space key", async () => {
    const onClick = vi.fn();
    renderButton({ onClick });
    screen.getByRole("button").focus();
    await userEvent.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
