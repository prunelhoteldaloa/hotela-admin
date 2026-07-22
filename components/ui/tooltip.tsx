"use client";

import * as React from "react";
import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";

import { cn } from "@/lib/utils";
import { asChildProps } from "@/components/ui/base-ui-utils";

function TooltipProvider({
  delayDuration = 0,
  ...props
}: Omit<React.ComponentProps<typeof TooltipPrimitive.Provider>, "delay"> & {
  delayDuration?: number;
}) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delayDuration}
      {...props}
    />
  );
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
}

function TooltipTrigger({
  asChild,
  children,
  ...props
}: Omit<React.ComponentProps<typeof TooltipPrimitive.Trigger>, "children"> & {
  asChild?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <TooltipPrimitive.Trigger
      data-slot="tooltip-trigger"
      {...props}
      {...asChildProps(asChild, children)}
    />
  );
}

function TooltipContent({
  className,
  side = "top",
  sideOffset = 6,
  align = "center",
  alignOffset,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Popup> & {
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  align?: "start" | "center" | "end";
  alignOffset?: number;
}) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        className="z-50"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            "bg-foreground text-background w-fit origin-[var(--transform-origin)] rounded-lg px-3 py-1.5 text-xs text-balance",
            "transition-[transform,opacity] duration-150 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
            className,
          )}
          {...props}
        >
          {children}
          <TooltipPrimitive.Arrow className="bg-foreground fill-foreground z-50 size-2.5 -translate-y-1/2 rotate-45 rounded-[2px] data-[side=bottom]:top-[-3px] data-[side=top]:bottom-[-3px]" />
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
