"use client"

import React from "react"

interface WelcomeCardProps {
  className?: string
}

export function WelcomeCard({ className = "" }: WelcomeCardProps) {
  return (
    <div className="relative flex justify-center w-full">
      {/* Welcome Card with integrated gradient background - Fixed in elevated state */}
      <div className={`relative max-w-4xl w-[95%] rounded-2xl shadow-2xl -translate-y-1 overflow-hidden ${className}`}>
        {/* Bold Gradient Background - More prominent shades */}
        <div className="absolute inset-0">
          {/* Main vibrant gradient background with enhanced opacity */}
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-red-500 via-pink-500 via-purple-500 via-blue-500 to-cyan-500 opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-tl from-blue-600 via-cyan-500 via-teal-400 via-green-400 via-yellow-400 to-orange-500 opacity-80 animate-pulse" style={{ animationDelay: "2s" }} />
          
          {/* Additional color layers for depth with stronger colors */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/70 via-orange-500/50 via-yellow-400/40 via-green-400/40 via-blue-500/50 to-purple-500/70 opacity-90" />
          
          {/* Enhanced overlay for better blending */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/15 to-transparent opacity-60" />
        </div>
        
        {/* Transparent overlay for glass effect */}
        <div className="relative bg-white/60 dark:bg-[#1a1a1a]/60 backdrop-blur-md border border-white/20 dark:border-gray-700/50 rounded-2xl">
          <div className="flex items-center justify-center p-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 text-center tracking-wide drop-shadow-sm">
              ITNB AG × SWISS NATIONAL LIBRARY
            </h2>
          </div>
        </div>
      </div>
    </div>
  )
}
