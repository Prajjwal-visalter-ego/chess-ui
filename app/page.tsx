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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
    <div className="flex h-screen w-screen overflow-hidden bg-background relative">
      {/* Collapsible Sidebar with Mobile Drawer */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onCollapse={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onMobileOpenChange={setMobileMenuOpen}
      />

      {/* Main Content Area */}
      <main
        className={cn(
          "flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden transition-all duration-300 ease-in-out",
          "p-4 pt-18 lg:pt-4 gap-4",
          // Account for sidebar width
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-56"
        )}
      >
        {/* Play Area Wrapper: Board + Profiles + Settings Toolbar */}
        <div className="flex flex-row items-stretch justify-center gap-2 lg:gap-4 w-full lg:max-w-[70%]">
          
          {/* Left Column: Player Profiles + Board */}
          <div className="flex flex-col flex-1 max-w-[85vh]">
            {/* Top Player Profile - Fixed Height */}
            <div className="h-12 flex items-center">
              <PlayerInfo
                name="Grandmaster_Sarah"
                rating={2450}
                avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
                timeLeft={blackTime}
                isActive={activePlayer === 'black'}
                capturedPieces={['P', 'B']}
                materialAdvantage={1}
              />
            </div>

            {/* Chessboard - Strict 1:1 Aspect Ratio */}
            <div className="w-full aspect-square max-h-full">
              <ChessBoard
                position={position}
                lastMove={lastMove}
                onMove={handleMove}
                flipped={flipped}
              />
            </div>

            {/* Bottom Player Profile - Fixed Height */}
            <div className="h-12 flex items-center">
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
          </div>

          {/* Right Column: Settings Toolbar - Flex sibling, stretches with board */}
          <div className="flex flex-col w-12 lg:w-14 justify-center shrink-0">
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
        </div>

        {/* Side Panel: Move History & Controls
            - Mobile: Definite height (h-[40vh]) so inner flex-1 ScrollArea renders
            - Desktop: Fills available height next to play area
        */}
        <div 
          className={cn(
            "flex flex-col bg-card rounded-xl border border-border overflow-hidden shrink-0",
            "w-full lg:flex-1 lg:min-w-[300px] lg:max-w-[400px]",
            "h-[40vh] lg:h-full"
          )}
        >
          {/* Game Controls */}
          <GameControls
            onResign={() => console.log('Resign')}
            onOfferDraw={() => console.log('Offer draw')}
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
              currentMoveIndex={currentMoveIndex}
              onMoveClick={setCurrentMoveIndex}
              timeControl="5+0"
              isLive={true}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
