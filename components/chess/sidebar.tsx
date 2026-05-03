"use client"

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
  Menu,
  X,
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
  mobileOpen: boolean
  onMobileOpenChange: (open: boolean) => void
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

export function Sidebar({ collapsed, onCollapse, mobileOpen, onMobileOpenChange }: SidebarProps) {
  return (
    <TooltipProvider delayDuration={0}>
      {/* Mobile Header - visible only on mobile */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 w-full h-14 flex items-center px-4 border-b border-border bg-card">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onMobileOpenChange(!mobileOpen)}
          className="h-10 w-10"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2 ml-3">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary">
            <Crown className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-base text-foreground">ChessMaster</span>
        </div>
      </header>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => onMobileOpenChange(false)}
        />
      )}

      {/* Sidebar - Desktop: fixed left, Mobile: drawer */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen bg-card border-r border-border flex flex-col transition-all duration-300 ease-in-out",
          // Desktop behavior
          "lg:z-40",
          collapsed ? "lg:w-16" : "lg:w-52",
          // Mobile behavior - drawer
          "w-64 -translate-x-full lg:translate-x-0",
          mobileOpen && "translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between gap-2 p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <Crown className="w-5 h-5 text-primary-foreground" />
            </div>
            {(!collapsed || mobileOpen) && (
              <span className="font-bold text-lg text-foreground whitespace-nowrap lg:hidden xl:inline">
                ChessMaster
              </span>
            )}
            {!collapsed && (
              <span className="font-bold text-lg text-foreground whitespace-nowrap hidden lg:inline">
                ChessMaster
              </span>
            )}
          </div>
          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onMobileOpenChange(false)}
            className="lg:hidden h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
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
                    collapsed && !mobileOpen && "lg:justify-center lg:px-2"
                  )}
                  onClick={() => onMobileOpenChange(false)}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {/* Always show label on mobile when drawer is open */}
                  <span className={cn(collapsed && !mobileOpen && "lg:hidden")}>{item.label}</span>
                </Button>
              </TooltipTrigger>
              {collapsed && !mobileOpen && (
                <TooltipContent side="right" className="font-medium hidden lg:block">
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
                    collapsed && !mobileOpen && "lg:justify-center lg:px-2"
                  )}
                  onClick={() => onMobileOpenChange(false)}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  <span className={cn(collapsed && !mobileOpen && "lg:hidden")}>{item.label}</span>
                </Button>
              </TooltipTrigger>
              {collapsed && !mobileOpen && (
                <TooltipContent side="right" className="font-medium hidden lg:block">
                  {item.label}
                </TooltipContent>
              )}
            </Tooltip>
          ))}

          {/* Collapse Button - desktop only */}
          <Button
            variant="ghost"
            onClick={() => onCollapse(!collapsed)}
            className={cn(
              "w-full justify-start gap-3 h-10 text-muted-foreground hover:text-foreground hidden lg:flex",
              collapsed && "lg:justify-center lg:px-2"
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
