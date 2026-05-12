import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { withTheme } from "@/test/mocks/theme";
import { Input } from "@/Component/ui/Input";

function renderInput(props: Partial<React.ComponentProps<typeof Input>> = {}) {
  return render(withTheme(<Input name="test-input" {...props} />));
}

describe("Input", () => {
  it("renders an input element", () => {
    renderInput();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders label when provided", () => {
    renderInput({ label: "Email" });
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("does not render label element when label is omitted", () => {
    const { container } = renderInput();
    expect(container.querySelector("label")).not.toBeInTheDocument();
  });

  it("label htmlFor links to input id", () => {
    renderInput({ label: "Username", name: "username" });
    const label = screen.getByText("Username");
    expect(label).toHaveAttribute("for", "username");
    expect(screen.getByRole("textbox")).toHaveAttribute("id", "username");
  });

  it("renders placeholder text", () => {
    renderInput({ placeholder: "Enter value" });
    expect(screen.getByPlaceholderText("Enter value")).toBeInTheDocument();
  });

  it("calls onChange with name and value on typing", async () => {
    const onChange = vi.fn();
    renderInput({ name: "email", onChange });
    await userEvent.type(screen.getByRole("textbox"), "a");
    expect(onChange).toHaveBeenCalledWith("email", "a");
  });

  it("renders controlled value", () => {
    renderInput({ value: "hello", onChange: vi.fn() });
    expect(screen.getByRole("textbox")).toHaveValue("hello");
  });

  it("shows error message when error prop is provided", () => {
    renderInput({ error: "This field is required" });
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("does not show error message when error is absent", () => {
    renderInput();
    expect(screen.queryByText("This field is required")).not.toBeInTheDocument();
  });

  it("is disabled when disabled prop is true", () => {
    renderInput({ disabled: true });
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("renders leftIcon when provided", () => {
    renderInput({ leftIcon: <span data-testid="left-icon">@</span> });
    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
  });

  it("renders rightIcon when provided", () => {
    renderInput({ rightIcon: <span data-testid="right-icon">✓</span> });
    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });

  it("supports password type", () => {
    renderInput({ type: "password", name: "pwd" });
    expect(screen.getByDisplayValue("")).toHaveAttribute("type", "password");
  });

  it("supports number type", () => {
    renderInput({ type: "number", name: "age" });
    expect(screen.getByRole("spinbutton")).toHaveAttribute("type", "number");
  });

  it("fires onKeyDown handler", async () => {
    const onKeyDown = vi.fn();
    renderInput({ onKeyDown });
    await userEvent.type(screen.getByRole("textbox"), "{Enter}");
    expect(onKeyDown).toHaveBeenCalled();
  });

  it("applies custom className to wrapper", () => {
    const { container } = renderInput({ className: "custom-wrapper" });
    expect(container.firstChild).toHaveClass("custom-wrapper");
  });
});
