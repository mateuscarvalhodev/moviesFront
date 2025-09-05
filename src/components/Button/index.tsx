import * as React from "react";
import { Button } from "@/components/ui/button";
import { cva, type VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

function cn(...classes: Array<string | false | null | undefined>) {
  return twMerge(classes.filter(Boolean).join(" "));
}

const appButtonVariants = cva(
  [
    "inline-flex items-center justify-center select-none",
    "font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2",
    "focus-visible:ring-[--color-focus] ring-offset-0",
    "disabled:opacity-60 disabled:cursor-not-allowed",
  ].join(" "),
  {
    variants: {
      variant: {
        brand: cn(
          "text-white bg-brand",
          "hover:bg-brand-cta",
          "active:bg-purple-11"
        ),
        surface: cn("text-fg bg-bg-elev border border-white/10", "hover:bg-bg"),
        outline: cn(
          "text-fg bg-transparent border border-white/15",
          "hover:bg-white/5"
        ),
        subtle: cn(
          "border border-purple-10/30",
          // Light: fundo sólido claro + texto legível
          "bg-purple-3 text-fg hover:bg-purple-4 active:bg-purple-5",
          // Dark: translúcido como antes + texto branco
          "dark:bg-purple-3/30 dark:text-white dark:hover:bg-purple-4/40 dark:active:bg-purple-5/50"
        ),
        ghost: cn("text-fg bg-transparent hover:bg-white/5"),
        danger: cn("text-white bg-destructive hover:opacity-90"),
      },
      size: {
        sm: "h-9 px-3 rounded-sm text-sm",
        md: "h-10 px-4 rounded text-sm",
        lg: "h-11 px-5 rounded text-base",
      },
      full: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "brand",
      size: "md",
      full: false,
    },
  }
);

export interface AppButtonProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof Button>,
      "variant" | "size"
    >,
    VariantProps<typeof appButtonVariants> {}

export const AppButton = React.forwardRef<HTMLButtonElement, AppButtonProps>(
  ({ className, variant, size, full, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="ghost"
        className={cn(appButtonVariants({ variant, size, full }), className)}
        {...props}
      />
    );
  }
);

AppButton.displayName = "AppButton";
