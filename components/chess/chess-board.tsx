"use client"

import { useState, useCallback } from "react"
import { cn } from "@/lib/utils"

// Chess piece unicode characters
const PIECES: Record<string, string> = {
  'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
  'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1']

// Initial board position in FEN-like format
const INITIAL_POSITION: (string | null)[][] = [
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
]

interface ChessBoardProps {
  position?: (string | null)[][]
  lastMove?: { from: [number, number]; to: [number, number] } | null
  onMove?: (from: [number, number], to: [number, number]) => void
  flipped?: boolean
}

export function ChessBoard({ 
  position = INITIAL_POSITION, 
  lastMove = null,
  onMove,
  flipped = false 
}: ChessBoardProps) {
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null)
  const [draggedPiece, setDraggedPiece] = useState<{ piece: string; from: [number, number] } | null>(null)

  const isLightSquare = (row: number, col: number) => (row + col) % 2 === 0

  const isHighlighted = useCallback((row: number, col: number) => {
    if (!lastMove) return false
    return (
      (lastMove.from[0] === row && lastMove.from[1] === col) ||
      (lastMove.to[0] === row && lastMove.to[1] === col)
    )
  }, [lastMove])

  const handleSquareClick = (row: number, col: number) => {
    const piece = position[row][col]
    
    if (selectedSquare) {
      if (selectedSquare[0] === row && selectedSquare[1] === col) {
        setSelectedSquare(null)
      } else {
        onMove?.(selectedSquare, [row, col])
        setSelectedSquare(null)
      }
    } else if (piece) {
      setSelectedSquare([row, col])
    }
  }

  const handleDragStart = (e: React.DragEvent, row: number, col: number) => {
    const piece = position[row][col]
    if (piece) {
      setDraggedPiece({ piece, from: [row, col] })
      e.dataTransfer.effectAllowed = 'move'
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault()
    if (draggedPiece) {
      onMove?.(draggedPiece.from, [row, col])
      setDraggedPiece(null)
    }
  }

  const displayPosition = flipped 
    ? position.map(row => [...row].reverse()).reverse()
    : position

  const displayFiles = flipped ? [...FILES].reverse() : FILES
  const displayRanks = flipped ? [...RANKS].reverse() : RANKS

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Board container - perfectly square */}
      <div className="aspect-square w-full h-full max-w-full max-h-full rounded-lg overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/10">
        {/* Board grid - 8x8 squares */}
        <div className="grid grid-cols-8 grid-rows-8 w-full h-full board-texture">
          {displayPosition.map((row, rowIndex) => (
            row.map((piece, colIndex) => {
              const actualRow = flipped ? 7 - rowIndex : rowIndex
              const actualCol = flipped ? 7 - colIndex : colIndex
              const isLight = isLightSquare(actualRow, actualCol)
              const highlighted = isHighlighted(actualRow, actualCol)
              const isSelected = selectedSquare?.[0] === actualRow && selectedSquare?.[1] === actualCol

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={cn(
                    "flex items-center justify-center relative cursor-pointer transition-all duration-150",
                    isLight 
                      ? highlighted 
                        ? "bg-[#f7f77a]" 
                        : "bg-[#ebecd0]"
                      : highlighted 
                        ? "bg-[#bbcc44]" 
                        : "bg-[#779556]",
                    isSelected && "ring-2 ring-inset ring-primary/80",
                    "hover:brightness-110"
                  )}
                  onClick={() => handleSquareClick(actualRow, actualCol)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, actualRow, actualCol)}
                >
                  {/* File labels (bottom row) */}
                  {rowIndex === 7 && (
                    <span className={cn(
                      "absolute bottom-0.5 right-1 text-[9px] sm:text-[10px] font-semibold",
                      isLight ? "text-[#779556]" : "text-[#ebecd0]"
                    )}>
                      {displayFiles[colIndex]}
                    </span>
                  )}
                  
                  {/* Rank labels (left column) */}
                  {colIndex === 0 && (
                    <span className={cn(
                      "absolute top-0.5 left-1 text-[9px] sm:text-[10px] font-semibold",
                      isLight ? "text-[#779556]" : "text-[#ebecd0]"
                    )}>
                      {displayRanks[rowIndex]}
                    </span>
                  )}

                  {/* Chess piece */}
                  {piece && (
                    <span
                      draggable
                      onDragStart={(e) => handleDragStart(e, actualRow, actualCol)}
                      className={cn(
                        "text-[2rem] sm:text-[2.5rem] md:text-[2.8rem] select-none cursor-grab active:cursor-grabbing transition-transform hover:scale-105",
                        piece === piece.toUpperCase() 
                          ? "text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.8)]" 
                          : "text-zinc-900 drop-shadow-[0_2px_2px_rgba(255,255,255,0.3)]",
                        draggedPiece?.from[0] === actualRow && draggedPiece?.from[1] === actualCol && "opacity-40"
                      )}
                    >
                      {PIECES[piece]}
                    </span>
                  )}

                  {/* Selected square indicator */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-primary/20 pointer-events-none" />
                  )}
                </div>
              )
            })
          ))}
        </div>
      </div>
    </div>
  )
}
