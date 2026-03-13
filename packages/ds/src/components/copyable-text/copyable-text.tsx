"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ArrowUpRight, Copy } from "@phosphor-icons/react";
import { cn } from "@ac/lib/cn";

const copyableTextVariants = cva(
  "inline-flex items-center font-mono select-none",
  {
    variants: {
      size: {
        sm: "text-xs gap-1",
        md: "text-sm gap-1.5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const iconSize: Record<"sm" | "md", string> = {
  sm: "size-3.5",
  md: "size-4",
};

const buttonSize: Record<"sm" | "md", string> = {
  sm: "size-4",
  md: "size-5",
};

function truncateMiddle(
  text: string,
  startChars: number,
  endChars: number,
): string {
  if (text.length <= startChars + endChars) return text;
  return `${text.slice(0, startChars)}...${text.slice(-endChars)}`;
}

type CopyableTextProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> &
  VariantProps<typeof copyableTextVariants> & {
    text: string;
    startChars?: number;
    endChars?: number;
    href?: string;
  };

const CopyableText = forwardRef<HTMLSpanElement, CopyableTextProps>(
  (
    {
      text,
      startChars = 6,
      endChars = 4,
      href,
      size = "md",
      className,
      ...rest
    },
    ref,
  ) => {
    const [copied, setCopied] = useState(false);
    const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

    useEffect(() => {
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }, []);

    const handleCopy = useCallback((e: React.MouseEvent) => {
      e.stopPropagation();
      void navigator.clipboard.writeText(text).then(() => {
        setCopied(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopied(false), 1500);
      });
    }, [text]);

    const resolvedSize = size ?? "md";
    const iconCn = iconSize[resolvedSize];
    const btnCn = buttonSize[resolvedSize];

    return (
      <span
        ref={ref}
        className={cn(
          copyableTextVariants({ size }),
          href && "text-primary-500 dark:text-primary-300",
          className,
        )}
        {...rest}
      >
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="cursor-pointer hover:underline"
          >
            {truncateMiddle(text, startChars, endChars)}
          </a>
        ) : (
          <span className="cursor-default">
            {truncateMiddle(text, startChars, endChars)}
          </span>
        )}

        <button
            type="button"
            onClick={handleCopy}
            className={cn(
              "relative inline-flex items-center justify-center",
              "rounded-md cursor-pointer",
              "hover:bg-foreground/10 transition-colors",
              btnCn,
            )}
            aria-label={copied ? "Copied" : "Copy to clipboard"}
          >
            <Copy
              weight="bold"
              className={cn(
                iconCn,
                "text-muted-foreground",
                "transition-opacity duration-100",
                "motion-reduce:transition-none",
                copied && "opacity-0",
              )}
              aria-hidden="true"
            />
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn(
                iconCn,
                "text-muted-foreground absolute",
                "[stroke-dasharray:20] [stroke-dashoffset:20]",
                "transition-[stroke-dashoffset] duration-300 delay-75 ease-out",
                "motion-reduce:transition-none",
                copied && "[stroke-dashoffset:0]",
              )}
              aria-hidden="true"
            >
              <polyline points="4 12 9 17 20 6" />
            </svg>
          </button>

        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "inline-flex items-center justify-center rounded-md",
              "text-muted-foreground hover:text-foreground",
              "hover:bg-foreground/10 transition-colors",
              btnCn,
            )}
            aria-label="Open in new tab"
          >
            <ArrowUpRight
              weight="bold"
              className={iconCn}
              aria-hidden="true"
            />
          </a>
        ) : null}
      </span>
    );
  },
);

CopyableText.displayName = "CopyableText";

export { CopyableText, copyableTextVariants, type CopyableTextProps };
