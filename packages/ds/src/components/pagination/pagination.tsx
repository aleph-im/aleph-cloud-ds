import { forwardRef, type HTMLAttributes } from "react";
import {
  CaretDoubleLeft,
  CaretDoubleRight,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";
import { cn } from "@ac/lib/cn";

type PageItem = number | "ellipsis";

type BuildPageRangeArgs = {
  page: number;
  totalPages: number;
  siblingCount: number;
  showFirstLast: boolean;
};

function buildPageRange({
  page,
  totalPages,
  siblingCount,
  showFirstLast,
}: BuildPageRangeArgs): PageItem[] {
  const leftSibling = Math.max(page - siblingCount, 1);
  const rightSibling = Math.min(page + siblingCount, totalPages);

  const items: PageItem[] = [];

  if (showFirstLast) {
    const showLeftEllipsis = leftSibling > 2;
    const showRightEllipsis = rightSibling < totalPages - 2;

    items.push(1);

    if (showLeftEllipsis) {
      items.push("ellipsis");
    } else {
      for (let i = 2; i < leftSibling; i++) {
        items.push(i);
      }
    }

    for (let i = leftSibling; i <= rightSibling; i++) {
      if (i !== 1 && i !== totalPages) {
        items.push(i);
      }
    }

    if (showRightEllipsis) {
      items.push("ellipsis");
    } else {
      for (let i = rightSibling + 1; i < totalPages; i++) {
        items.push(i);
      }
    }

    if (totalPages > 1) {
      items.push(totalPages);
    }
  } else {
    for (let i = leftSibling; i <= rightSibling; i++) {
      items.push(i);
    }
  }

  return items;
}

type PaginationProps = Omit<HTMLAttributes<HTMLElement>, "onChange"> & {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  showFirstLast?: boolean;
};

const NAV_BUTTON = [
  "inline-flex items-center justify-center",
  "size-8 rounded-full",
  "text-primary-600 dark:text-primary-400",
  "hover:bg-primary-100 dark:hover:bg-primary-200/10",
  "transition-colors cursor-pointer",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
].join(" ");

const NAV_DISABLED = "opacity-50 pointer-events-none";

const PAGE_BUTTON = [
  "inline-flex items-center justify-center",
  "size-8 rounded-full",
  "font-heading font-bold text-lg",
  "text-primary-600 dark:text-primary-400",
  "hover:bg-primary-100 dark:hover:bg-primary-200/10",
  "transition-colors cursor-pointer",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500",
].join(" ");

const PAGE_ACTIVE = [
  "bg-primary-600 text-white dark:bg-primary-800",
  "hover:bg-primary-600 dark:hover:bg-primary-800",
].join(" ");

const Pagination = forwardRef<HTMLElement, PaginationProps>(
  (
    {
      page,
      totalPages,
      onPageChange,
      siblingCount = 1,
      showFirstLast = true,
      className,
      ...rest
    },
    ref,
  ) => {
    const items = buildPageRange({
      page,
      totalPages,
      siblingCount,
      showFirstLast,
    });

    const isFirst = page <= 1;
    const isLast = page >= totalPages;

    return (
      <nav
        ref={ref}
        aria-label="Pagination"
        className={cn("flex items-center gap-4", className)}
        {...rest}
      >
        {showFirstLast && (
          <button
            type="button"
            className={cn(NAV_BUTTON, isFirst && NAV_DISABLED)}
            aria-label="First page"
            aria-disabled={isFirst || undefined}
            onClick={isFirst ? undefined : () => onPageChange(1)}
          >
            <CaretDoubleLeft
              weight="bold"
              className="size-4"
              aria-hidden="true"
            />
          </button>
        )}

        <button
          type="button"
          className={cn(NAV_BUTTON, isFirst && NAV_DISABLED)}
          aria-label="Previous page"
          aria-disabled={isFirst || undefined}
          onClick={isFirst ? undefined : () => onPageChange(page - 1)}
        >
          <CaretLeft weight="bold" className="size-4" aria-hidden="true" />
        </button>

        {items.map((item, i) =>
          item === "ellipsis" ? (
            <span
              key={`ellipsis-${i}`}
              className="inline-flex items-center justify-center size-8 font-heading font-bold text-lg text-primary-600 dark:text-primary-400 select-none"
              aria-hidden="true"
            >
              {"\u2026"}
            </span>
          ) : (
            <button
              key={item}
              type="button"
              className={cn(PAGE_BUTTON, item === page && PAGE_ACTIVE)}
              aria-label={`Page ${item}`}
              aria-current={item === page ? "page" : undefined}
              onClick={item === page ? undefined : () => onPageChange(item)}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          className={cn(NAV_BUTTON, isLast && NAV_DISABLED)}
          aria-label="Next page"
          aria-disabled={isLast || undefined}
          onClick={isLast ? undefined : () => onPageChange(page + 1)}
        >
          <CaretRight weight="bold" className="size-4" aria-hidden="true" />
        </button>

        {showFirstLast && (
          <button
            type="button"
            className={cn(NAV_BUTTON, isLast && NAV_DISABLED)}
            aria-label="Last page"
            aria-disabled={isLast || undefined}
            onClick={isLast ? undefined : () => onPageChange(totalPages)}
          >
            <CaretDoubleRight
              weight="bold"
              className="size-4"
              aria-hidden="true"
            />
          </button>
        )}
      </nav>
    );
  },
);

Pagination.displayName = "Pagination";

export { buildPageRange, Pagination, type PageItem, type PaginationProps };
