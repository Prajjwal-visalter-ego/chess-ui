"use client"

import { 
  Settings, 
  Volume2, 
  VolumeX, 
  RotateCw, 
  Palette,
  Maximize2,
  Eye,
  Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

interface SettingsPanelProps {
  soundEnabled?: boolean
  onToggleSound?: () => void
  onFlipBoard?: () => void
  flipped?: boolean
  onOpenTheme?: () => void
  onFullscreen?: () => void
  showCoordinates?: boolean
  onToggleCoordinates?: () => void
  premovesEnabled?: boolean
  onTogglePremoves?: () => void
  onOpenSettings?: () => void
}

export function SettingsPanel({
  soundEnabled = true,
  onToggleSound,
  onFlipBoard,
  flipped = false,
  onOpenTheme,
  onFullscreen,
  showCoordinates = true,
  onToggleCoordinates,
  premovesEnabled = true,
  onTogglePremoves,
  onOpenSettings
}: SettingsPanelProps) {
  return (
    <TooltipProvider>
      <div className="flex flex-col items-center gap-2 py-4 px-2 bg-card/50 rounded-xl border border-border/50 backdrop-blur-sm">
        {/* Main settings button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-primary/10"
              onClick={onOpenSettings}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">Settings</TooltipContent>
        </Tooltip>

        <div className="w-6 h-px bg-border/50 my-1" />

        {/* Sound toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-9 w-9",
                soundEnabled 
                  ? "text-primary hover:text-primary/80" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={onToggleSound}
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4" />
              ) : (
                <VolumeX className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            {soundEnabled ? "Mute Sound" : "Enable Sound"}
          </TooltipContent>
        </Tooltip>

        {/* Flip board */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-primary/10"
              onClick={onFlipBoard}
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">Flip Board</TooltipContent>
        </Tooltip>

        {/* Theme */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-primary/10"
              onClick={onOpenTheme}
            >
              <Palette className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">Board Theme</TooltipContent>
        </Tooltip>

        {/* Coordinates toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-9 w-9",
                showCoordinates 
                  ? "text-primary hover:text-primary/80" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={onToggleCoordinates}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            {showCoordinates ? "Hide Coordinates" : "Show Coordinates"}
          </TooltipContent>
        </Tooltip>

        {/* Premove toggle */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={cn(
                "h-9 w-9",
                premovesEnabled 
                  ? "text-primary hover:text-primary/80" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={onTogglePremoves}
            >
              <Zap className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            {premovesEnabled ? "Disable Premoves" : "Enable Premoves"}
          </TooltipContent>
        </Tooltip>

        <div className="w-6 h-px bg-border/50 my-1" />

        {/* Fullscreen */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-primary/10"
              onClick={onFullscreen}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">Fullscreen</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
