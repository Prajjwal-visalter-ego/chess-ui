"use client"

import { useState } from "react"
import {
  Play,
  Puzzle,
  GraduationCap,
  Eye,
  Newspaper,
  Users,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Crown,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SidebarProps {
  collapsed: boolean
  onCollapse: (collapsed: boolean) => void
}

const menuItems = [
  { icon: Play, label: "Play", active: true },
  { icon: Puzzle, label: "Puzzles" },
  { icon: GraduationCap, label: "Learn" },
  { icon: Eye, label: "Watch" },
  { icon: Newspaper, label: "News" },
  { icon: Users, label: "Social" },
]

const bottomItems = [
  { icon: User, label: "Profile" },
  { icon: Settings, label: "Settings" },
]

export function Sidebar({ collapsed, onCollapse }: SidebarProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-card border-r border-border flex flex-col transition-all duration-300 ease-in-out",
          collapsed ? "w-16" : "w-52"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 p-4 border-b border-border">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
            <Crown className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-bold text-lg text-foreground whitespace-nowrap">
              ChessMaster
            </span>
          )}
        </div>

        {/* Main Menu */}
        <nav className="flex-1 p-2 space-y-1">
          {menuItems.map((item) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <Button
                  variant={item.active ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-10",
                    item.active && "bg-primary/10 text-primary hover:bg-primary/20",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Button>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right" className="font-medium">
                  {item.label}
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </nav>

        {/* Bottom Menu */}
        <div className="p-2 space-y-1 border-t border-border">
          {bottomItems.map((item) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 h-10",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Button>
              </TooltipTrigger>
              {collapsed && (
                <TooltipContent side="right" className="font-medium">
                  {item.label}
                </TooltipContent>
              )}
            </Tooltip>
          ))}

          {/* Collapse Button */}
          <Button
            variant="ghost"
            onClick={() => onCollapse(!collapsed)}
            className={cn(
              "w-full justify-start gap-3 h-10 text-muted-foreground hover:text-foreground",
              collapsed && "justify-center px-2"
            )}
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5 shrink-0" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5 shrink-0" />
                <span>Collapse</span>
              </>
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  )
}
