"use client"

import { useEffect } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription } from "@/components/ui/alert-dialog";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ViolationWarningModalProps {
  open: boolean;
  violationCount: number;
  maxViolations: number;
  onClose?: () => void;
}

export function ViolationWarningModal({ open, violationCount, maxViolations, onClose }: ViolationWarningModalProps) {
  const remainingWarnings = maxViolations - violationCount;
  
  // Auto-close modal after 5 seconds (unless it's the final violation)
  useEffect(() => {
    if (open && remainingWarnings > 0 && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [open, remainingWarnings, onClose]);
  
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md mx-auto" onEscapeKeyDown={(e) => e.preventDefault()}>
        <div className="w-full flex items-center justify-center">
        {/* Close button - only show if not final violation */}
        {remainingWarnings > 0 && onClose && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 h-6 w-6 rounded-full"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2 pr-8">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <AlertDialogTitle className="text-xl">Security Violation Detected</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base space-y-2">
            <p className="font-semibold text-foreground">
              Warning: Tab switching or exiting fullscreen is prohibited. This incident has been logged.
            </p>
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">Violations:</span> {violationCount} / {maxViolations}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">Remaining Warnings:</span> {remainingWarnings}
              </p>
              {remainingWarnings <= 0 && (
                <p className="text-sm font-semibold text-red-600 dark:text-red-400 mt-2">
                  The interview will be terminated automatically.
                </p>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
