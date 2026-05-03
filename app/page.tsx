"use client"

import { useState, useEffect, useCallback } from "react"
import { ChessBoard } from "@/components/chess/chess-board"
import { PlayerInfo } from "@/components/chess/player-info"
import { MoveHistory } from "@/components/chess/move-history"
import { GameControls } from "@/components/chess/game-controls"
import { SettingsPanel } from "@/components/chess/settings-panel"
import { Sidebar } from "@/components/chess/sidebar"
import { cn } from "@/lib/utils"

// Sample game state for demo
const SAMPLE_POSITION: (string | null)[][] = [
  ['r', null, 'b', 'q', null, 'r', 'k', null],
  [null, null, 'p', null, 'b', 'p', 'p', 'p'],
  ['p', null, 'n', 'p', null, 'n', null, null],
  [null, 'p', null, null, 'p', null, null, null],
  [null, 'B', null, null, 'P', null, null, null],
  [null, null, 'P', null, null, 'N', null, 'P'],
  ['P', 'P', null, 'P', null, 'P', 'P', null],
  ['R', 'N', 'B', 'Q', null, 'R', 'K', null],
]

const SAMPLE_MOVES = [
  { number: 1, white: "e4", black: "e5" },
  { number: 2, white: "Nf3", black: "Nc6" },
  { number: 3, white: "Bb5", black: "a6" },
  { number: 4, white: "Ba4", black: "Nf6" },
  { number: 5, white: "O-O", black: "Be7" },
  { number: 6, white: "Re1", black: "b5" },
  { number: 7, white: "Bb3", black: "d6" },
  { number: 8, white: "c3", black: "O-O" },
  { number: 9, white: "h3", black: "Na5" },
]

export default function ChessGame() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [position, setPosition] = useState(SAMPLE_POSITION)
  const [currentMoveIndex, setCurrentMoveIndex] = useState(17)
  const [lastMove, setLastMove] = useState<{ from: [number, number]; to: [number, number] } | null>({
    from: [2, 2],
    to: [3, 0]
  })
  const [flipped, setFlipped] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showCoordinates, setShowCoordinates] = useState(true)
  const [premovesEnabled, setPremovesEnabled] = useState(true)
  
  // Timers
  const [whiteTime, setWhiteTime] = useState(225)
  const [blackTime, setBlackTime] = useState(263)
  const [activePlayer, setActivePlayer] = useState<'white' | 'black'>('black')

  useEffect(() => {
    const interval = setInterval(() => {
      if (activePlayer === 'white') {
        setWhiteTime(t => Math.max(0, t - 1))
      } else {
        setBlackTime(t => Math.max(0, t - 1))
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [activePlayer])

  const handleMove = useCallback((from: [number, number], to: [number, number]) => {
    setPosition(prev => {
      const newPosition = prev.map(row => [...row])
      newPosition[to[0]][to[1]] = newPosition[from[0]][from[1]]
      newPosition[from[0]][from[1]] = null
      return newPosition
    })
    setLastMove({ from, to })
    setActivePlayer(prev => prev === 'white' ? 'black' : 'white')
  }, [])

  return (
    <div className="h-screen w-screen bg-background overflow-hidden">
      {/* Collapsible Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onCollapse={setSidebarCollapsed} />

      {/* Main Container: Flexbox, horizontal on desktop, vertical on mobile */}
      <main
        className={cn(
          "h-screen w-full transition-all duration-300 ease-in-out",
          "flex flex-col lg:flex-row items-center justify-center",
          "p-2 sm:p-3 lg:p-4 gap-2 lg:gap-3",
          sidebarCollapsed ? "pl-14 sm:pl-16" : "pl-48 sm:pl-52"
        )}
      >
        {/* Board Section - Player info + Board with strict 1:1 aspect ratio */}
        {/* Uses container query: fills available space but constrained by max-height: 90vh and max-width */}
        <div 
          className={cn(
            "flex flex-col gap-1 shrink-0",
            "w-full lg:w-auto"
          )}
          style={{
            /* 
             * Board size calculation:
             * - Desktop: Use min of (90vh - player bars) or available width
             * - The board+player container height = 90vh max
             * - Player bars take ~70px total, so board = 90vh - 70px
             */
            maxWidth: 'min(calc(90vh - 70px), 560px)',
          }}
        >
          {/* Opponent info */}
          <PlayerInfo
            name="Grandmaster_Sarah"
            rating={2450}
            avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
            timeLeft={blackTime}
            isActive={activePlayer === 'black'}
            capturedPieces={['P', 'B']}
            materialAdvantage={1}
          />

          {/* Chess Board Container - STRICT 1:1 ASPECT RATIO */}
          {/* Width fills container, height is constrained to maintain square */}
          <div 
            className="relative w-full"
            style={{
              /* Force square: width = 100% of parent, height = same as width via aspect-ratio */
              aspectRatio: '1 / 1',
              maxHeight: 'calc(90vh - 70px)',
              maxWidth: 'min(calc(90vh - 70px), 560px)',
            }}
          >
            <ChessBoard
              position={position}
              lastMove={lastMove}
              onMove={handleMove}
              flipped={flipped}
            />
          </div>

          {/* Current player info */}
          <PlayerInfo
            name="You"
            rating={2410}
            avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Player"
            timeLeft={whiteTime}
            isActive={activePlayer === 'white'}
            isCurrentPlayer={true}
            capturedPieces={['p']}
          />
        </div>

        {/* Settings Panel - Desktop: inline vertical bar, Mobile: fixed to right edge */}
        <div className="hidden lg:flex items-center shrink-0">
          <SettingsPanel
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled(!soundEnabled)}
            onFlipBoard={() => setFlipped(!flipped)}
            flipped={flipped}
            showCoordinates={showCoordinates}
            onToggleCoordinates={() => setShowCoordinates(!showCoordinates)}
            premovesEnabled={premovesEnabled}
            onTogglePremoves={() => setPremovesEnabled(!premovesEnabled)}
          />
        </div>

        {/* Right Panel: Move History & Controls - Desktop: fixed width, Mobile: below board */}
        <div 
          className={cn(
            "flex flex-col bg-card rounded-xl border border-border overflow-hidden shrink-0",
            "w-full lg:w-64 xl:w-72",
            "flex-1 lg:flex-none"
          )}
          style={{
            /* Desktop: match board section height */
            maxHeight: 'min(90vh, 600px)',
          }}
        >
          {/* Game Controls */}
          <GameControls
            onResign={() => console.log('Resign')}
            onOfferDraw={() => console.log('Offer draw')}
            onPlayOnline={() => console.log('Play online')}
            onPlayBot={() => console.log('Play bot')}
            onPlayFriend={() => console.log('Play friend')}
            onFirstMove={() => setCurrentMoveIndex(0)}
            onPrevMove={() => setCurrentMoveIndex(Math.max(0, currentMoveIndex - 1))}
            onNextMove={() => setCurrentMoveIndex(Math.min(SAMPLE_MOVES.length * 2 - 1, currentMoveIndex + 1))}
            onLastMove={() => setCurrentMoveIndex(SAMPLE_MOVES.length * 2 - 1)}
            onSendMessage={(msg) => console.log('Message:', msg)}
          />

          {/* Move History - scrollable area */}
          <div className="flex-1 min-h-0 border-t border-border overflow-hidden">
            <MoveHistory
              moves={SAMPLE_MOVES}
              openingName="Ruy Lopez: Morphy Defense"
              currentMoveIndex={currentMoveIndex}
              onMoveClick={setCurrentMoveIndex}
              timeControl="5+0"
              isLive={true}
            />
          </div>
        </div>

        {/* Mobile Settings - Fixed position, pinned to right edge */}
        <div className="lg:hidden fixed right-3 top-1/2 -translate-y-1/2 z-50">
          <SettingsPanel
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled(!soundEnabled)}
            onFlipBoard={() => setFlipped(!flipped)}
            flipped={flipped}
            showCoordinates={showCoordinates}
            onToggleCoordinates={() => setShowCoordinates(!showCoordinates)}
            premovesEnabled={premovesEnabled}
            onTogglePremoves={() => setPremovesEnabled(!premovesEnabled)}
          />
        </div>
      </main>
    </div>
  )
}
