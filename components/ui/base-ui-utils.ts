import * as React from "react";

/**
 * Compatibility helper that lets our shadcn-style wrappers keep the Radix
 * `asChild` API while rendering Base UI primitives underneath.
 *
 * Base UI does not support `asChild`; instead it exposes a `render` prop that
 * accepts the element to render as. When `asChild` is true and the child is a
 * valid element, we forward it through `render` so Base UI merges its own props
 * (event handlers, aria attributes, data-state, etc.) onto the consumer's node.
 */
export function asChildProps(
  asChild: boolean | undefined,
  children: React.ReactNode,
): { render: React.ReactElement } | { children: React.ReactNode } {
  if (asChild && React.isValidElement(children)) {
    return { render: children as React.ReactElement };
  }
  return { children };
}
