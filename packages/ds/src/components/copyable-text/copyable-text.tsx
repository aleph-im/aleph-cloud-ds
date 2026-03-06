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
import { ArrowUpRight, Check, Copy } from "@phosphor-icons/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ac/components/tooltip/tooltip";
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
  sm: "size-5",
  md: "size-6",
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

    const handleCopy = useCallback(() => {
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
      <TooltipProvider>
        <span
          ref={ref}
          className={cn(copyableTextVariants({ size }), className)}
          {...rest}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-default">
                {truncateMiddle(text, startChars, endChars)}
              </span>
            </TooltipTrigger>
            <TooltipContent>{text}</TooltipContent>
          </Tooltip>

          <button
            type="button"
            onClick={handleCopy}
            className={cn(
              "relative inline-flex items-center justify-center",
              "rounded-full cursor-pointer",
              "hover:bg-foreground/10 transition-colors",
              btnCn,
            )}
            aria-label={copied ? "Copied" : "Copy to clipboard"}
          >
            {/* Default layer: Copy icon */}
            <Copy
              weight="bold"
              className={cn(iconCn, "text-muted-foreground")}
              aria-hidden="true"
            />

            {/* Reveal layer: circle bg + Check icon */}
            <span
              className={cn(
                "absolute inset-0 flex items-center justify-center",
                "rounded-full bg-foreground",
                "[clip-path:circle(0%_at_50%_50%)]",
                "transition-[clip-path] duration-200",
                "[transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]",
                "motion-reduce:transition-none",
                copied && "[clip-path:circle(50%_at_50%_50%)]",
              )}
              aria-hidden="true"
            >
              <Check
                weight="bold"
                className={cn(
                  iconCn,
                  "text-background",
                  "scale-0 transition-transform duration-150 delay-75",
                  "[transition-timing-function:cubic-bezier(0.34,1.56,0.64,1)]",
                  "motion-reduce:transition-none",
                  copied && "scale-100",
                )}
              />
            </span>
          </button>

          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center justify-center rounded-full",
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
      </TooltipProvider>
    );
  },
);

CopyableText.displayName = "CopyableText";

export { CopyableText, copyableTextVariants, type CopyableTextProps };
