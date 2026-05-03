"use client"

import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, Copy, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Move {
  number: number
  white: string
  black?: string
}

interface MoveHistoryProps {
  moves: Move[]
  openingName?: string
  currentMoveIndex?: number
  onMoveClick?: (moveIndex: number) => void
  timeControl?: string
  isLive?: boolean
}

export function MoveHistory({ 
  moves, 
  openingName,
  currentMoveIndex,
  onMoveClick,
  timeControl = "5+0",
  isLive = true
}: MoveHistoryProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header with time control */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">Move History</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Time control badge */}
          <Badge variant="secondary" className="gap-1 font-mono text-xs">
            <Clock className="h-3 w-3" />
            {timeControl}
          </Badge>
          {isLive && (
            <Badge className="bg-primary/20 text-primary border-0 text-xs">
              Live
            </Badge>
          )}
        </div>
      </div>



      {/* Moves list */}
      <ScrollArea className="flex-1 custom-scrollbar">
        <div className="p-2">
          {moves.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
              <span className="text-xs">No moves yet</span>
            </div>
          ) : (
            <div className="space-y-0.5">
              {moves.map((move, index) => (
                <div
                  key={move.number}
                  className="grid grid-cols-[28px_1fr_1fr] gap-0.5 text-sm animate-slide-in"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <span className="text-muted-foreground text-right pr-1 text-xs leading-7">
                    {move.number}.
                  </span>
                  <button
                    onClick={() => onMoveClick?.(index * 2)}
                    className={cn(
                      "px-2 py-1 rounded text-left text-xs transition-colors hover:bg-secondary",
                      currentMoveIndex === index * 2 && "bg-primary/20 text-primary"
                    )}
                  >
                    {move.white}
                  </button>
                  {move.black && (
                    <button
                      onClick={() => onMoveClick?.(index * 2 + 1)}
                      className={cn(
                        "px-2 py-1 rounded text-left text-xs transition-colors hover:bg-secondary",
                        currentMoveIndex === index * 2 + 1 && "bg-primary/20 text-primary"
                      )}
                    >
                      {move.black}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer actions */}
      <div className="flex items-center justify-end gap-1 px-2 py-1.5 border-t border-border">
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Copy className="h-3 w-3" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Download className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
