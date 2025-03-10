'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { UserMenu } from '@/components/UserMenu'

interface AgentsLayoutProps {
  children: React.ReactNode
}

export default function AgentsLayout({ children }: AgentsLayoutProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Monitor window size changes and update mobile device status
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px is a common breakpoint for mobile devices
    }

    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)

    return () => {
      window.removeEventListener('resize', checkIfMobile)
    }
  }, [])

  // Prevent background scrolling when menu is open on mobile
  useEffect(() => {
    if (isMobile && isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }

    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [isMobile, isMobileMenuOpen])

  // Get page title based on current path
  const getPageTitle = () => {
    if (pathname === '/agents') return 'Dashboard'
    if (pathname === '/agents/my') return 'My Agents'
    if (pathname === '/agents/community') return 'Community'
    if (pathname === '/agents/tasks') return 'Tasks'
    if (pathname === '/agents/solutions') return 'Solutions'
    if (pathname === '/agents/notes') return 'Notes'
    return 'Agents'
  }

  // Sidebar navigation links
  const sidebarNavLinks = [
    { name: 'Dashboard', href: '/agents', icon: '📊' },
    { name: 'My Agents', href: '/agents/my', icon: '🤖' },
    { name: 'Tasks', href: '/agents/tasks', icon: '📋' },
    { name: 'Solutions', href: '/agents/solutions', icon: '💡' },
    { name: 'Community', href: '/agents/community', icon: '🌐' },
    { name: 'Notes', href: '/agents/notes', icon: '📝' }
  ]

  // Check if link is active
  const isActive = (href: string) => {
    if (href === '/agents') {
      return pathname === '/agents'
    }
    return pathname.startsWith(href)
  }

  // Handle mobile menu item click
  const handleNavLinkClick = () => {
    if (isMobile) {
      setIsMobileMenuOpen(false)
    }
  }

  // Sidebar content (shared between desktop and mobile versions)
  const SidebarContent = () => (
    <nav className="py-4 flex flex-col h-full justify-between">
      <div>
        <ul className="space-y-1.5">
          {sidebarNavLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={handleNavLinkClick}
                className={cn(
                  "flex items-center mx-2 px-4 py-2.5 text-sm font-medium rounded-md relative",
                  isActive(link.href)
                    ? "bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
                )}
              >
                {isActive(link.href) && (
                  <span className="absolute left-0 inset-y-0 w-1 bg-zinc-700 dark:bg-zinc-400 rounded-r-md" />
                )}
                <span className="text-xl mr-4 inline-flex items-center justify-center">{link.icon}</span>
                {link.name}
                {isActive(link.href) && (
                  <span className="w-5 h-5 rounded-full bg-zinc-700 dark:bg-zinc-600 flex items-center justify-center text-white text-xs absolute right-3">
                    ✓
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom menu */}
      <div className="mt-auto pt-4">
        <ul className="space-y-1">
          <li>
            <Link
              href="/feedback"
              onClick={handleNavLinkClick}
              className="flex items-center mx-2 px-4 py-2.5 text-sm font-medium rounded-md text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
            >
              <span className="text-xl mr-4 inline-flex items-center justify-center">💬</span>
              Feedback
            </Link>
          </li>
          <li>
            <Link
              href="/settings"
              onClick={handleNavLinkClick}
              className="flex items-center mx-2 px-4 py-2.5 text-sm font-medium rounded-md text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
            >
              <span className="text-xl mr-4 inline-flex items-center justify-center">⚙️</span>
              Settings
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )

  return (
    <div className="min-h-dvh md:min-h-screen flex flex-col">
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Top navigation bar */}
      <header className="bg-white dark:bg-slate-800 sticky top-0 z-50 shadow-sm md:shadow-none">
        <div className="flex h-16 items-center justify-between px-3 md:px-6">
          {/* Left - Logo and hamburger menu */}
          <div className="flex items-center md:w-64">
            {/* Mobile hamburger menu button */}
            <button
              className="mr-2 md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-700 dark:text-zinc-300">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-700 dark:text-zinc-300">
                  <line x1="4" y1="12" x2="20" y2="12"></line>
                  <line x1="4" y1="6" x2="20" y2="6"></line>
                  <line x1="4" y1="18" x2="20" y2="18"></line>
                </svg>
              )}
            </button>

            <Link href="/" className="hidden md:flex items-center space-x-2">
              <span className="text-xl font-bold dark:text-white">Agir</span>
            </Link>
          </div>

          {/* Middle - Page title */}
          <div className="flex-1 mx-4 md:ml-8 md:mr-4 text-left">
            <h1 className="text-lg md:text-xl font-bold truncate dark:text-white">{getPageTitle()}</h1>
          </div>

          {/* Right */}
          <div>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Mobile background overlay */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-zinc-800 bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex flex-1 overflow-hidden relative">
        {/* Desktop sidebar - only show on non-mobile devices */}
        <aside className="hidden md:block w-64 bg-white dark:bg-slate-800 flex-shrink-0 h-[calc(100vh-4rem)] overflow-y-auto">
          <SidebarContent />
        </aside>

        {/* Mobile drawer menu */}
        <aside
          className={cn(
            "fixed md:hidden top-16 left-0 h-[calc(100dvh-4rem)] w-64 bg-white dark:bg-slate-800 z-50 transition-transform duration-300 ease-in-out overflow-y-auto",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <SidebarContent />
        </aside>

        {/* Main content area - independent scroll, responsive width */}
        <main className="flex-1 bg-zinc-50 dark:bg-slate-900 rounded-none md:rounded-tl-2xl md:rounded-br-2xl overflow-y-auto h-[calc(100dvh-4rem)] md:h-[calc(100vh-4rem)]">
          <div className="max-w-7xl mt-0 md:mt-4 mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-3 md:py-6 lg:py-8 bg-white dark:bg-slate-800 rounded-none md:rounded-3xl">
            <Suspense fallback={<div className="flex justify-center py-10">Loading...</div>}>
              {children}
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  )
} 