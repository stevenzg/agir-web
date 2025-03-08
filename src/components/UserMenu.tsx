import React from 'react'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from 'next-themes'
import {
  Avatar,
  AvatarFallback
} from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu'
import { SunIcon, MoonIcon, MonitorIcon } from 'lucide-react'

export function UserMenu() {
  const { user, logout, isAuthenticated } = useAuth()
  const { theme, setTheme } = useTheme()

  // If not logged in, show login button
  if (!isAuthenticated) {
    return (
      <Link
        href="/login"
        className="px-4 py-2 text-sm font-medium text-white bg-zinc-800 rounded-md hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
      >
        Login
      </Link>
    )
  }

  // Get user's first letter as avatar fallback
  const userInitial = user?.email ? user.email[0].toUpperCase() : '?'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="cursor-pointer">
          {/* Since there's no avatar property in the User interface, we're only showing the fallback */}
          <AvatarFallback className="bg-zinc-700 text-white">
            {userInitial}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">User Account</p>
            <p className="text-xs leading-none text-zinc-500">{user?.email || ''}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer w-full">
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer w-full">
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        {/* Theme Switcher */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="cursor-pointer">
            <span className="flex items-center">
              {theme === 'light' && <SunIcon className="mr-2 h-4 w-4" />}
              {theme === 'dark' && <MoonIcon className="mr-2 h-4 w-4" />}
              {theme === 'system' && <MonitorIcon className="mr-2 h-4 w-4" />}
              <span>Theme</span>
            </span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={theme || "system"} onValueChange={setTheme}>
              <DropdownMenuRadioItem value="light" className="cursor-pointer">
                <SunIcon className="mr-2 h-4 w-4" />
                <span>Light</span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark" className="cursor-pointer">
                <MoonIcon className="mr-2 h-4 w-4" />
                <span>Dark</span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system" className="cursor-pointer">
                <MonitorIcon className="mr-2 h-4 w-4" />
                <span>System</span>
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-500 cursor-pointer focus:text-red-500"
          onClick={() => logout()}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
