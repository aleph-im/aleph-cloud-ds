"use client";

import { useState } from "react";
import { Button } from "@aleph-front/ds/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@aleph-front/ds/dialog";
import { DocHeader } from "@preview/components/doc-header";
import { DemoSection } from "@preview/components/demo-section";

export default function DialogPage() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [lockedOpen, setLockedOpen] = useState(false);

  return (
    <>
      <DocHeader
        title="Dialog"
        description="Modal dialog with focus trap, frosted overlay, and configurable dismiss behavior. Composable API: Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose, DialogHeader, DialogFooter."
      />

      <DemoSection title="Basic (uncontrolled)">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Open dialog
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Basic dialog</DialogTitle>
              <DialogDescription>
                This dialog can be dismissed by clicking the overlay,
                pressing Escape, or the close button.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" size="sm">
                  Close
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DemoSection>

      <DemoSection title="Confirmation (controlled)">
        <Button
          variant="primary"
          size="sm"
          onClick={() => setConfirmOpen(true)}
        >
          Delete node
        </Button>
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete node?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. The node and all
                associated data will be permanently removed.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setConfirmOpen(false)}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DemoSection>

      <DemoSection title="Locked (no dismiss)">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLockedOpen(true)}
        >
          Open locked dialog
        </Button>
        <Dialog open={lockedOpen} onOpenChange={setLockedOpen}>
          <DialogContent locked>
            <DialogHeader>
              <DialogTitle>Confirm action</DialogTitle>
              <DialogDescription>
                This dialog cannot be dismissed by clicking outside or
                pressing Escape. You must choose an action.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLockedOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setLockedOpen(false)}
              >
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DemoSection>
    </>
  );
}
