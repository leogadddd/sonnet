import { Loader, Loader2 } from "lucide-react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const spinnerVariants = cva("text-muted-foreground animated-spin", {
  variants: {
    size: {
      default: "h-4 w-4",
      sm: "h-2 w-2",
      lg: "h-6 w-6",
      icon: "h-10 w-10",
    },
    defaultVariants: {
      size: "default",
    },
  },
});

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
}

export const Spinner = ({ size, className }: SpinnerProps) => {
  return (
    <Loader2
      className={cn(spinnerVariants({ size }), "animate-spin", className)}
    />
  );
};
