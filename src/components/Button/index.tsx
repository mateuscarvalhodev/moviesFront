import * as React from "react";
import { Button } from "@/components/ui/button";
import { cva, type VariantProps } from "class-variance-authority";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const appButtonVariants = cva("select-none transition-colors", {
  variants: {
    variant: {
      primary: cn(
        "!text-white !bg-brand",
        "hover:!bg-brand-cta",
        "active:!bg-purple-11",
        "disabled:!bg-mauve-8 disabled:!text-mauve-11"
      ),
      secondary: cn(
        "!text-white bg-purple-3/30 border border-purple-10/30",
        "hover:!bg-purple-4/40",
        "active:!bg-purple-5/50",
        "disabled:!bg-mauve-6/40 disabled:!text-mauve-11"
      ),
    },
    size: {
      sm: "h-9 px-3 rounded-md",
      md: "h-10 px-4 rounded-lg",
      lg: "h-11 px-5 rounded-lg",
    },
    full: {
      true: "w-full",
      false: "",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

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
