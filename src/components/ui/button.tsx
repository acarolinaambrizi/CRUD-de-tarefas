"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const {
    variant = "primary",
    size = "md",
    className,
    ...buttonProps
  } = props;

  const variants: Record<string, string> = {
    primary: "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-400",
    secondary: "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-300",
    ghost: "bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800",
    outline: "border border-primary hover:bg-primary/10 dark:border-primary dark:bg-primary/20 dark:hover:bg-primary/30",
  };

  const sizeClasses: Record<string, string> = {
    lg: "px-6 py-3",
    md: "px-4 py-2",
    sm: "px-3 py-1.5",
  };

  const radiusClasses: Record<string, string> = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  };

  const variantClass = variants[variant] ?? variants.primary;
  const sizeClass = sizeClasses[size] ?? sizeClasses.md;
  const radiusClass = radiusClasses[size] ?? "rounded-md";

  const baseClass = "font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary";

  const classes = cn(
    baseClass,
    variantClass,
    sizeClass,
    radiusClass,
    className
  );

  return (
    <button className={classes} {...buttonProps} />
  );
}