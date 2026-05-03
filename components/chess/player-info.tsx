"use client"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PlayerInfoProps {
  name: string
  rating?: number
  avatar?: string
  timeLeft: number // in seconds
  isActive: boolean
  isCurrentPlayer?: boolean
  capturedPieces?: string[]
  materialAdvantage?: number
  onSettingsClick?: () => void
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function PlayerInfo({
  name,
  rating,
  avatar,
  timeLeft,
  isActive,
  isCurrentPlayer = false,
  capturedPieces = [],
  materialAdvantage = 0,
  onSettingsClick
}: PlayerInfoProps) {
  const isLowTime = timeLeft < 30
  const isWarningTime = timeLeft < 60 && timeLeft >= 30

  return (
    <div className="flex items-center justify-between gap-2 py-1">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <Avatar className={cn(
          "h-7 w-7 ring-2 transition-all shrink-0",
          isActive ? "ring-primary" : "ring-border"
        )}>
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold text-[10px]">
            {name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-semibold text-foreground text-sm truncate">{name}</span>
          {rating && (
            <span className="text-xs text-muted-foreground shrink-0">
              ({rating})
            </span>
          )}
          
          {/* Captured pieces inline */}
          {capturedPieces.length > 0 && (
            <div className="flex items-center gap-0.5">
              {capturedPieces.slice(0, 6).map((piece, i) => (
                <span key={i} className="text-xs opacity-60">{piece}</span>
              ))}
              {materialAdvantage > 0 && (
                <span className="text-[10px] text-primary ml-0.5">+{materialAdvantage}</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Timer - compact pill style */}
        <div className={cn(
          "flex items-center gap-1 px-2.5 py-1 rounded-md font-mono text-sm font-bold transition-all",
          isActive && !isLowTime && !isWarningTime && "bg-secondary text-foreground",
          isActive && isWarningTime && "bg-amber-500/20 text-amber-400",
          isActive && isLowTime && "bg-destructive/20 text-destructive animate-pulse",
          !isActive && "bg-secondary/50 text-muted-foreground"
        )}>
          {formatTime(timeLeft)}
        </div>

        {/* Settings icon */}
        {onSettingsClick && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={onSettingsClick}
          >
            <Settings className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  )
}
