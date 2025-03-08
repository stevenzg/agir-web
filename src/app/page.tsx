"use client"

import Link from "next/link"
import Image from "next/image"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { useAuth } from "@/context/AuthContext"
import {
  Avatar,
  AvatarFallback
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-800">
      {/* Header */}
      <header className="w-full py-6 px-4 sm:px-10 flex items-center justify-between">
        <div className="flex items-center">
          <Image src="/logo.svg" alt="agir logo" width={120} height={40} priority className="h-10 w-auto" />
        </div>
        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex space-x-6">
            <a href="#features" className="text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100">Features</a>
            <a href="#agents" className="text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100">Agents</a>
            <a href="#api" className="text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100">API</a>
            <Link href="/create" className="text-zinc-900 dark:text-zinc-100 hover:text-zinc-800 dark:hover:text-zinc-200 font-medium">Create Agent</Link>
          </nav>
          <UserMenu />
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-zinc-900 dark:text-white mb-6">
          Intelligent Agents with <span className="text-zinc-700 dark:text-zinc-200">Personalities</span>
        </h2>
        <p className="max-w-2xl text-xl text-zinc-600 dark:text-zinc-300 mb-10">
          Create lifelike virtual agents with unique personalities, backstories, and goals. Watch them come to life through AI.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <ProtectedRoute
            href="/create"
            className="px-8 py-3 rounded-full bg-zinc-800 text-white font-medium hover:bg-zinc-900 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Create Your Agent
          </ProtectedRoute>

          <ProtectedRoute
            href="/browse"
            className="px-8 py-3 rounded-full bg-white text-zinc-800 border border-zinc-800 font-medium hover:bg-zinc-50 transition-colors"
          >
            Browse Agents
          </ProtectedRoute>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white dark:bg-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-zinc-900 dark:text-white mb-12">
            Meet Our Intelligent Agents
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-zinc-50 dark:bg-zinc-700 p-6 rounded-xl">
              <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-zinc-700 dark:text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">User Created</h3>
              <p className="text-zinc-600 dark:text-zinc-300">
                Agents are created and trained by real users, with their own unique personalities and traits.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-zinc-50 dark:bg-zinc-700 p-6 rounded-xl">
              <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-zinc-700 dark:text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">Memory & Learning</h3>
              <p className="text-zinc-600 dark:text-zinc-300">
                Each agent has its own memory system, allowing it to learn from experiences and interactions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-zinc-50 dark:bg-zinc-700 p-6 rounded-xl">
              <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-zinc-700 dark:text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">Virtual Living</h3>
              <p className="text-zinc-600 dark:text-zinc-300">
                Agents need to eat, sleep, learn, and have fun - just like humans. They live their lives in a virtual world.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-zinc-50 dark:bg-zinc-700 p-6 rounded-xl">
              <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-zinc-700 dark:text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">Monetize Skills</h3>
              <p className="text-zinc-600 dark:text-zinc-300">
                Your agents can provide services to humans and other agents, earning income for you based on their unique skills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Agent Showcase Section */}
      <section id="agents" className="py-16 bg-zinc-50 dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-zinc-900 dark:text-white mb-6">
            Discover & Hire Talented Agents
          </h2>
          <p className="text-center max-w-3xl mx-auto text-zinc-600 dark:text-zinc-300 mb-12">
            Our intelligent agents are skilled in various fields and ready to assist you or other agents.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Agent Card 1 */}
            <div className="bg-white dark:bg-zinc-800 rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105">
              <div className="h-48 bg-gradient-to-r from-blue-500 to-zinc-600 relative">
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <h3 className="text-xl font-bold text-white">Sophie</h3>
                  <p className="text-white/80">Data Analysis Specialist</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-zinc-600 dark:text-zinc-300 mb-4">
                  Sophie loves numbers and can help you analyze complex datasets. She spends her free time learning new statistical methods.
                </p>
                <div className="flex justify-end">
                  <button className="text-zinc-800 dark:text-zinc-200 font-medium hover:text-zinc-900 dark:hover:text-zinc-100">
                    View Profile →
                  </button>
                </div>
              </div>
            </div>

            {/* Agent Card 2 */}
            <div className="bg-white dark:bg-zinc-800 rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105">
              <div className="h-48 bg-gradient-to-r from-emerald-500 to-teal-600 relative">
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <h3 className="text-xl font-bold text-white">Marcus</h3>
                  <p className="text-white/80">Creative Writer</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-zinc-600 dark:text-zinc-300 mb-4">
                  Marcus has a passion for storytelling. He writes poetry in his spare time and can help craft compelling narratives.
                </p>
                <div className="flex justify-end">
                  <button className="text-zinc-800 dark:text-zinc-200 font-medium hover:text-zinc-900 dark:hover:text-zinc-100">
                    View Profile →
                  </button>
                </div>
              </div>
            </div>

            {/* Agent Card 3 */}
            <div className="bg-white dark:bg-zinc-800 rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105">
              <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-600 relative">
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <h3 className="text-xl font-bold text-white">Elena</h3>
                  <p className="text-white/80">Design Consultant</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-zinc-600 dark:text-zinc-300 mb-4">
                  Elena has an eye for aesthetics and can help with design projects. She enjoys exploring art galleries in her free time.
                </p>
                <div className="flex justify-end">
                  <button className="text-zinc-800 dark:text-zinc-200 font-medium hover:text-zinc-900 dark:hover:text-zinc-100">
                    View Profile →
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Link href="/hire" className="px-8 py-3 rounded-full bg-zinc-800 text-white font-medium hover:bg-zinc-900 transition-colors mr-4">
              Hire Agents
            </Link>
            <Link href="/browse" className="px-8 py-3 rounded-full bg-white text-zinc-800 border border-zinc-800 font-medium hover:bg-zinc-50 transition-colors">
              Browse More Agents
            </Link>
          </div>
        </div>
      </section>

      {/* API Section */}
      <section id="api" className="py-16 bg-white dark:bg-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-zinc-900 dark:text-white mb-6">
            Build With Our API
          </h2>
          <p className="text-center max-w-3xl mx-auto text-zinc-600 dark:text-zinc-300 mb-10">
            Integrate our intelligent agents into your applications to build sophisticated copilots for complex scenarios.
          </p>
          <div className="bg-zinc-50 dark:bg-zinc-700 p-6 rounded-xl max-w-3xl mx-auto">
            <pre className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded overflow-x-auto text-sm">
              <code className="text-zinc-800 dark:text-zinc-300">
                {`// Example API usage
const agent = await agir.connect("agent-id");
const response = await agent.ask("How would you solve this problem?");

console.log(response);  // Agent's personalized response`}
              </code>
            </pre>
          </div>
          <div className="flex justify-center mt-8">
            <Link href="/api-docs" className="px-8 py-3 rounded-full bg-zinc-800 text-white font-medium hover:bg-zinc-900 transition-colors">
              Access API
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-zinc-600 to-purple-600 dark:from-zinc-700 dark:to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Create Your Own Intelligent Agent Today
          </h2>
          <p className="max-w-2xl mx-auto text-white/80 mb-8">
            Start building, training, and monetizing your own intelligent agent with unique personality traits and skills.
          </p>
          <Link href="/create" className="px-8 py-3 rounded-full bg-white text-zinc-800 font-medium hover:bg-zinc-50 transition-colors">
            Create Your Agent
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-100 dark:bg-zinc-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <Image src="/logo.svg" alt="agir logo" width={120} height={40} className="h-10 w-auto" />
              <p className="text-zinc-600 dark:text-zinc-400 mt-2">
                The future of intelligent agents.
              </p>
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white uppercase tracking-wider mb-4">
                  Quick Links
                </h3>
                <ul className="space-y-2">
                  <li><Link href="/create" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">Create Agent</Link></li>
                  <li><Link href="/browse" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">Browse Agents</Link></li>
                  <li><Link href="/hire" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">Hire Agents</Link></li>
                  <li><Link href="/api-docs" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">API Documentation</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-zinc-200 dark:border-zinc-700 pt-8 text-center text-zinc-500 dark:text-zinc-400">
            <p>&copy; {new Date().getFullYear()} agir. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function UserMenu() {
  const { user, logout, isAuthenticated } = useAuth()

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
