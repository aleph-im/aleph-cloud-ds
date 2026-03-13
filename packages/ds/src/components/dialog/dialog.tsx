"use client";

import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type HTMLAttributes,
} from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { X } from "@phosphor-icons/react";
import { cn } from "@ac/lib/cn";

/* ── Direct re-exports ─────────────────────────── */

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;

/* ── DialogContent (Portal + Overlay + Content) ── */

type DialogContentProps = ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> & {
  locked?: boolean;
};

const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, children, locked, ...rest }, ref) => (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
          "motion-reduce:animate-none",
        )}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            "relative w-full max-w-md rounded-md bg-surface p-6 shadow-brand-lg",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "motion-reduce:animate-none",
            className,
          )}
          {...(locked
            ? {
                onInteractOutside: (e: Event) => e.preventDefault(),
                onEscapeKeyDown: (e: KeyboardEvent) => e.preventDefault(),
              }
            : {})}
          {...rest}
        >
          {children}
          {locked ? null : (
            <DialogPrimitive.Close
              className={cn(
                "absolute top-4 right-4 rounded-sm",
                "text-muted-foreground transition-colors hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-primary-400 focus-visible:ring-offset-2",
              )}
              aria-label="Close"
            >
              <X weight="bold" className="size-4" />
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Content>
      </div>
    </DialogPrimitive.Portal>
  ),
);

DialogContent.displayName = "DialogContent";

/* ── DialogTitle ───────────────────────────────── */

const DialogTitle = forwardRef<
  HTMLHeadingElement,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...rest }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "font-heading font-bold text-lg text-foreground",
      className,
    )}
    {...rest}
  />
));

DialogTitle.displayName = "DialogTitle";

/* ── DialogDescription ─────────────────────────── */

const DialogDescription = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...rest }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...rest}
  />
));

DialogDescription.displayName = "DialogDescription";

/* ── Layout helpers (plain divs) ───────────────── */

function DialogHeader({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)} {...rest} />
  );
}

function DialogFooter({
  className,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex justify-end gap-3 pt-4", className)}
      {...rest}
    />
  );
}

/* ── Exports ───────────────────────────────────── */

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  type DialogContentProps,
};
