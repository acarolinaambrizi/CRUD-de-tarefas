"use client";

import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/* -----------------------------------------------------------------
   Content variants – match the styling used across the app
   ----------------------------------------------------------------- */
const dropdownMenuContentVariants = cva(
  "z-50 min-w-[8rem] overflow-hidden rounded-xl border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in-80",
  {
    variants: {
      sideOffset: {
        default: "data-[side=bottom]:mt-1 data-[side=top]:mb-1",
      },
    },
    defaultVariants: {
      sideOffset: "default",
    },
  }
);

/* -----------------------------------------------------------------
   Root component
   ----------------------------------------------------------------- */
type DropdownMenuProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Root
>;
const DropdownMenu = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Root>,
  DropdownMenuProps
>(({ children, ...props }, ref) => (
  <DropdownMenuPrimitive.Root ref={ref} {...props}>
    {children}
  </DropdownMenuPrimitive.Root>
));
DropdownMenu.displayName = "DropdownMenu";

/* -----------------------------------------------------------------
   Trigger component
   ----------------------------------------------------------------- */
type DropdownMenuTriggerProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Trigger
>;
const DropdownMenuTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Trigger>,
  DropdownMenuTriggerProps
>(({ children, asChild = false, ...props }, ref) => (
  <DropdownMenuPrimitive.Trigger
    ref={ref}
    asChild={asChild}
    {...props}
  >
    {children}
  </DropdownMenuPrimitive.Trigger>
));
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

/* -----------------------------------------------------------------
   Content component
   ----------------------------------------------------------------- */
type DropdownMenuContentProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Content
> &
  VariantProps<typeof dropdownMenuContentVariants>;

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  DropdownMenuContentProps
>(({ className, sideOffset, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={4}
      className={cn(dropdownMenuContentVariants({ sideOffset }), className)}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = "DropdownMenuContent";

/* -----------------------------------------------------------------
   Item component
   ----------------------------------------------------------------- */
type DropdownMenuItemProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Item
>;
const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  DropdownMenuItemProps
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = "DropdownMenuItem";

/* -----------------------------------------------------------------
   Label component
   ----------------------------------------------------------------- */
type DropdownMenuLabelProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Label
>;
const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  DropdownMenuLabelProps
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn("px-2 py-1.5 text-sm font-semibold text-muted-foreground", className)}
    {...props}
  />
));
DropdownMenuLabel.displayName = "DropdownMenuLabel";

/* -----------------------------------------------------------------
   Separator component
   ----------------------------------------------------------------- */
type DropdownMenuSeparatorProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Separator
>;
const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  DropdownMenuSeparatorProps
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

/* -----------------------------------------------------------------
   Shortcut component – simple span for keyboard shortcuts
   ----------------------------------------------------------------- */
const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)}
    {...props}
  />
);
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  dropdownMenuContentVariants,
};