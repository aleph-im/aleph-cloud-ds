import { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ac/lib/cn";

const cardVariants = cva("rounded-xl", {
  variants: {
    variant: {
      default: "bg-surface text-surface-foreground border border-edge",
      noise: "fx-grain-lg text-surface-foreground",
      ghost: "bg-transparent",
    },
    padding: {
      sm: "p-4",
      md: "p-6",
      lg: "p-8",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "md",
  },
});

type CardProps = HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof cardVariants> & {
    title?: ReactNode;
  };

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ variant, padding, title, className, children, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding }), className)}
        {...rest}
      >
        {title ? (
          <h3 className="mb-4 text-lg font-heading font-bold">{title}</h3>
        ) : null}
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

export { Card, cardVariants, type CardProps };
