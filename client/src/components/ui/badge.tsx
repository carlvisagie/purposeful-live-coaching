import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * WORLD-CLASS BADGE COMPONENT
 * Apple/Headspace/Calm-level quality
 * Professional status indicators, smooth animations
 */

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none transition-all duration-200 uppercase tracking-wider",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm [a&]:hover:bg-primary/90 [a&]:hover:shadow-md",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground shadow-sm [a&]:hover:bg-secondary/90 [a&]:hover:shadow-md",
        destructive:
          "border-transparent bg-destructive text-white shadow-sm [a&]:hover:bg-destructive/90 [a&]:hover:shadow-md",
        outline:
          "text-foreground border-border/50 bg-background/50 backdrop-blur-sm [a&]:hover:bg-accent [a&]:hover:border-border",
        success:
          "border-transparent bg-success text-success-foreground shadow-sm [a&]:hover:bg-success/90 [a&]:hover:shadow-md",
        warning:
          "border-transparent bg-warning text-warning-foreground shadow-sm [a&]:hover:bg-warning/90 [a&]:hover:shadow-md",
        info:
          "border-transparent bg-info text-info-foreground shadow-sm [a&]:hover:bg-info/90 [a&]:hover:shadow-md",
        premium:
          "border-transparent bg-gradient-to-r from-primary to-secondary text-white shadow-md [a&]:hover:shadow-lg [a&]:hover:scale-105",
      },
      size: {
        default: "px-3 py-1 text-xs",
        sm: "px-2 py-0.5 text-[10px]",
        lg: "px-4 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Badge({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
