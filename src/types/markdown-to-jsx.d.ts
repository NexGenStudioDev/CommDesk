declare module "markdown-to-jsx" {
  import * as React from "react";

  export type MarkdownOverride = {
    component?: React.ElementType;
    props?: Record<string, unknown>;
  };

  export type MarkdownOptions = {
    forceBlock?: boolean;
    forceInline?: boolean;
    disableParsingRawHTML?: boolean;
    overrides?: Record<string, MarkdownOverride>;
    [key: string]: unknown;
  };

  export type MarkdownProps = {
    children?: React.ReactNode;
    options?: MarkdownOptions;
    [key: string]: unknown;
  };

  export default function Markdown(props: MarkdownProps): React.ReactElement;
}
declare module "markdown-to-jsx" {
  import type { ComponentType, ReactElement } from "react";

  export type MarkdownToJsxOverride = {
    component?: ComponentType<Record<string, unknown>>;
    props?: Record<string, unknown>;
  };

  export type MarkdownToJsxOptions = {
    forceBlock?: boolean;
    disableParsingRawHTML?: boolean;
    overrides?: Record<string, MarkdownToJsxOverride>;
    [key: string]: unknown;
  };

  export type MarkdownProps = {
    children: string;
    options?: MarkdownToJsxOptions;
  };

  export default function Markdown(props: MarkdownProps): ReactElement;
}
