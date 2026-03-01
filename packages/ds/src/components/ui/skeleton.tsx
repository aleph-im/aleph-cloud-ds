import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@ac/lib/cn";

type SkeletonProps = HTMLAttributes<HTMLDivElement>;

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn("animate-pulse rounded-md bg-muted", className)}
        {...rest}
      />
    );
  },
);

Skeleton.displayName = "Skeleton";

export { Skeleton, type SkeletonProps };
