"use client";

import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  CheckCircle,
  Info,
  Warning,
  XCircle,
  X,
} from "@phosphor-icons/react";
import { cn } from "@ac/lib/cn";

const VARIANT_LABELS: Record<string, string> = {
  warning: "Warning",
  error: "Error",
  info: "Info",
  success: "Success",
};

const VARIANT_ICONS: Record<string, typeof Warning> = {
  warning: Warning,
  error: XCircle,
  info: Info,
  success: CheckCircle,
};

const VARIANT_BG_CLASS: Record<string, string> = {
  warning: "alert-bg-warning",
  error: "alert-bg-error",
  info: "alert-bg-info",
  success: "alert-bg-success",
};

const alertVariants = cva(
  [
    "relative overflow-hidden rounded-sm border-l-3",
    "px-3 py-2",
    "transition-all duration-200",
    "motion-reduce:transition-none",
  ].join(" "),
  {
    variants: {
      variant: {
        warning: "border-warning-400",
        error: "border-error-400",
        info: "border-primary-400",
        success: "border-success-400",
      },
    },
    defaultVariants: {
      variant: "warning",
    },
  },
);

const labelVariants = cva(
  "font-heading font-extrabold italic text-[10px] uppercase leading-normal",
  {
    variants: {
      variant: {
        warning: "text-warning-600 dark:text-warning-300",
        error: "text-error-600 dark:text-error-300",
        info: "text-primary-600 dark:text-primary-300",
        success: "text-success-600 dark:text-success-300",
      },
    },
  },
);

const progressVariants = cva("absolute bottom-0 left-0 h-0.5", {
  variants: {
    variant: {
      warning: "bg-warning-400",
      error: "bg-error-400",
      info: "bg-primary-400",
      success: "bg-success-400",
    },
  },
});

type AlertVariant = "warning" | "error" | "info" | "success";

type AlertProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> &
  VariantProps<typeof alertVariants> & {
    title?: string;
    onDismiss?: () => void;
    dismissAfter?: number;
    children: ReactNode;
  };

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      variant = "warning",
      title,
      onDismiss,
      dismissAfter,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const [isDismissing, setIsDismissing] = useState(false);
    const [progressActive, setProgressActive] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
    const resolvedVariant: AlertVariant = variant ?? "warning";

    const Icon = VARIANT_ICONS[resolvedVariant];
    const label = VARIANT_LABELS[resolvedVariant];

    useEffect(() => {
      if (!dismissAfter || !onDismiss) return;

      requestAnimationFrame(() => {
        setProgressActive(true);
      });

      timerRef.current = setTimeout(() => {
        setIsDismissing(true);
      }, dismissAfter);

      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }, [dismissAfter, onDismiss]);

    function handleDismiss() {
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsDismissing(true);
    }

    function handleTransitionEnd() {
      if (isDismissing && onDismiss) {
        onDismiss();
      }
    }

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          alertVariants({ variant }),
          VARIANT_BG_CLASS[resolvedVariant],
          isDismissing && "opacity-0 -translate-y-2",
          className,
        )}
        onTransitionEnd={handleTransitionEnd}
        {...rest}
      >
        <div className="flex items-center justify-between">
          <span className={labelVariants({ variant })}>
            {label}
          </span>
          <Icon
            weight="bold"
            className={cn(
              "size-3",
              labelVariants({ variant }),
            )}
            aria-hidden="true"
          />
        </div>

        {title ? (
          <p
            data-alert-title=""
            className="font-sans font-bold text-sm text-foreground mt-0.5"
          >
            {title}
          </p>
        ) : null}

        <div className="font-sans italic text-xs text-foreground leading-relaxed">
          {children}
        </div>

        {onDismiss ? (
          <button
            type="button"
            onClick={handleDismiss}
            className={cn(
              "absolute top-2 right-2",
              "opacity-60 hover:opacity-100 transition-opacity",
              "motion-reduce:transition-none",
              labelVariants({ variant }),
            )}
            aria-label="Dismiss"
          >
            <X weight="bold" className="size-3.5" />
          </button>
        ) : null}

        {dismissAfter && onDismiss ? (
          <div
            data-alert-progress=""
            className={cn(
              progressVariants({ variant }),
              "motion-reduce:transition-none",
            )}
            style={{
              width: progressActive ? "0%" : "100%",
              transitionProperty: "width",
              transitionDuration: `${dismissAfter}ms`,
              transitionTimingFunction: "linear",
            }}
          />
        ) : null}
      </div>
    );
  },
);

Alert.displayName = "Alert";

export { Alert, alertVariants, type AlertProps };
