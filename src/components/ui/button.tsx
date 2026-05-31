"use client";

import React from "react";
import { Button as BaseButton } from "react";
import { cn } from "@/lib/utils";

type Size = "lg" | "sm" | "default" | "icon"; // Added 'icon' to the size type

export const Button = ({ 
  children, 
  variant = "outline", 
  size = "default", 
  ...props 
}: {
  children: React.ReactNode;
  variant?: "ghost" | "outline" | "filled";
  size?: Size; // Now accepts 'icon'
  [key: string]: any;
}) => {
  const classes = cn(
    `btn-${variant}-${size}`,
    // Other class mappings...
  );

  return (
    <BaseButton 
      className={classes}
      variant={variant}
      size={size}
      {...props}
    >
      {children}
    </BaseButton>
  );
};