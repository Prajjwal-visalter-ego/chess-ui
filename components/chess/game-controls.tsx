"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Flag, 
  RotateCcw,
  ChevronFirst, 
  ChevronLast, 
  ChevronLeft, 
  ChevronRight,
  Send
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface GameControlsProps {
  onResign?: () => void
  onOfferDraw?: () => void
  onFirstMove?: () => void
  onPrevMove?: () => void
  onNextMove?: () => void
  onLastMove?: () => void
  onSendMessage?: (message: string) => void
  onNewGame?: () => void
  activeTab?: "new" | "resign"
}

export function GameControls({
  onResign,
  onOfferDraw,
  onFirstMove,
  onPrevMove,
  onNextMove,
  onLastMove,
  onSendMessage,
  onNewGame,
  activeTab = "new"
}: GameControlsProps) {
  const [message, setMessage] = useState("")
  const [tab, setTab] = useState<string>(activeTab)

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage?.(message)
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <TooltipProvider>
      <div className="flex flex-col h-full">
        {/* Tab header */}
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="w-full grid grid-cols-2 h-9 bg-secondary/50">
            <TabsTrigger value="new" className="text-xs">New Game</TabsTrigger>
            <TabsTrigger value="resign" className="text-xs">Resign</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Play options */}
        <div className="p-3 space-y-2">
          {tab === "new" ? (
            <>
            </>
          ) : (
            <div className="flex gap-2">
              <Button 
                variant="destructive" 
                className="flex-1 gap-2 h-10"
                onClick={onResign}
              >
                <Flag className="h-4 w-4" />
                Resign
              </Button>
              <Button 
                variant="secondary" 
                className="flex-1 gap-2 h-10"
                onClick={onOfferDraw}
              >
                <RotateCcw className="h-4 w-4" />
                Offer Draw
              </Button>
            </div>
          )}
        </div>

        {/* This will be replaced by MoveHistory in the page */}
        <div className="flex-1" />

        {/* Navigation controls */}
        <div className="px-3 pb-2">
          <div className="flex items-center justify-center gap-0.5 bg-secondary/50 rounded-lg p-0.5">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onFirstMove}>
                  <ChevronFirst className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>First Move</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-4" onClick={onPrevMove}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Previous</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="secondary" size="sm" className="h-8 px-4" onClick={onNextMove}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Next</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onLastMove}>
                  <ChevronLast className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Last Move</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Message input */}
        <div className="p-3 pt-0">
          <div className="relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Send a message..."
              className="pr-10 h-9 text-sm bg-secondary/50 border-border"
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
              onClick={handleSendMessage}
              disabled={!message.trim()}
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
