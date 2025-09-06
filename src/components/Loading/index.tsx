import { Loader2 } from "lucide-react";

type Size = "sm" | "md" | "lg";

type LoaderProps = {
  size?: Size;
  label?: string | null;
  className?: string;
};

type OverlayProps = LoaderProps & {
  fullscreen?: boolean;
  variant?: "blur" | "solid";
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const sizeMap: Record<Size, string> = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-10 w-10",
};

export function Loader({
  size = "md",
  label = "Carregando…",
  className,
}: LoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex items-center gap-2", className)}
    >
      <Loader2 aria-hidden className={cn("animate-spin", sizeMap[size])} />
      {label ? (
        <span className="text-sm text-muted-foreground">{label}</span>
      ) : (
        <span className="sr-only">Carregando</span>
      )}
    </div>
  );
}

export function LoadingOverlay({
  size = "md",
  label = "Carregando…",
  className,
  fullscreen,
  variant = "blur",
}: OverlayProps) {
  const container = fullscreen ? "fixed inset-0 z-50" : "absolute inset-0";
  const bg =
    variant === "solid"
      ? "bg-background/80"
      : "backdrop-blur-sm bg-background/50";

  return (
    <div
      className={cn(
        container,
        bg,
        "grid place-items-center pointer-events-none",
        className
      )}
    >
      <div className="pointer-events-auto rounded-2xl border bg-card p-4 shadow-lg">
        <Loader size={size} label={label} />
      </div>
    </div>
  );
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("h-4 w-full rounded-md bg-muted animate-pulse", className)}
    />
  );
}

export default Loader;
