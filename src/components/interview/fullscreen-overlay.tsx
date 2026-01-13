"use client"

import { Button } from "@/components/ui/button";
import { Monitor } from "lucide-react";

interface FullscreenOverlayProps {
  onRequestFullscreen: () => void;
}

export function FullscreenOverlay({ onRequestFullscreen }: FullscreenOverlayProps) {
  return (
    <div className="fixed inset-0 z-[9999] bg-background/95 backdrop-blur-sm flex items-center justify-center">
      <div className="text-center space-y-6 p-8 max-w-md">
        <div className="p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-full w-fit mx-auto">
          <Monitor className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Fullscreen Mode Required</h2>
          <p className="text-muted-foreground">
            The interview has been paused. You must re-enter fullscreen mode to continue.
          </p>
        </div>
        <Button 
          size="lg" 
          onClick={onRequestFullscreen}
          className="w-full"
        >
          <Monitor className="h-5 w-5 mr-2" />
          Re-enter Fullscreen
        </Button>
      </div>
    </div>
  );
}
