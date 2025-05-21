"use client"

import { useAuth } from "@/context/auth-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { List, LogOut, Plus, User } from "lucide-react"
import Link from "next/link"

export function UserNav({ isMobile = false }: { isMobile?: boolean }) {
  const { user, logout } = useAuth()

  if (!user) return null

  if (isMobile) {
    return (
      <div className="bg-popover rounded-lg shadow flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="text-white">
              {user.username ? user.username.charAt(0).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">{user.username}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.points || "No points available"}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/profile" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-muted transition cursor-pointer">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </Link>
          <Link href="/profile?tab=my-quizzes" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-muted transition cursor-pointer">
            <List className="h-4 w-4" />
            <span>My Quizzes</span>
          </Link>
          <Link href="/profile?tab=create-quiz" className="flex items-center gap-2 px-2 py-2 rounded hover:bg-muted transition cursor-pointer">
            <Plus className="h-4 w-4" />
            <span>Create Quiz</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-2 py-2 rounded hover:bg-muted transition cursor-pointer text-left"
            type="button"
          >
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-white">
              {user.username ? user.username.charAt(0).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.username}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.points || "No points available"}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer w-full">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuItem asChild>
          <Link href="/profile?tab=my-quizzes" className="cursor-pointer w-full">
            <List className="mr-2 h-4 w-4" />
            <span>My Quizzes</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
