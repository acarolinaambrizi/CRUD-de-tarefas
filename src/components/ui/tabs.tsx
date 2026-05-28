"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/* -----------------------------------------------------------------
   Tabs list variants
   ----------------------------------------------------------------- */
const tabsListVariants = cva(
  "inline-flex items-center justify-center rounded-md bg-muted p-1",
  {
    variants: {
      variant: {
        default: "",
        underline: "border-b-2 border-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/* -----------------------------------------------------------------
   Tabs trigger variants
   ----------------------------------------------------------------- */
const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/* -----------------------------------------------------------------
   Root component
   ----------------------------------------------------------------- */
type TabsProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>;
const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  TabsProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Root ref={ref} className={cn(className)} {...props} />
));
Tabs.displayName = "Tabs";

/* -----------------------------------------------------------------
   List component
   ----------------------------------------------------------------- */
type TabsListProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabsListVariants({ variant }), className)}
    {...props}
  />
));
TabsList.displayName = "TabsList";

/* -----------------------------------------------------------------
   Trigger component
   ----------------------------------------------------------------- */
type TabsTriggerProps = React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.Trigger
> &
  VariantProps<typeof tabsTriggerVariants>;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant }), className)}
    {...props}
  />
));
TabsTrigger.displayName = "TabsTrigger";

export { Tabs, TabsList, TabsTrigger, tabsListVariants, tabsTriggerVariants };