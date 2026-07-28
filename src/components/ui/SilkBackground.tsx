import * as React from "react"

export function SilkBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-background pointer-events-none">
      {/* Base deep background */}
      <div className="absolute inset-0 bg-[#06060a]" />

      {/* Animated Silk Orbs/Waves */}
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-primary/20 blur-[120px] rounded-full animate-silk-flow mix-blend-screen opacity-50" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-accent/20 blur-[130px] rounded-full animate-silk-flow-reverse mix-blend-screen opacity-50" />
      <div className="absolute top-[20%] left-[40%] w-[40%] h-[40%] bg-indigo-500/10 blur-[100px] rounded-full animate-silk-flow-slow mix-blend-screen opacity-40" />
      
      {/* Subtle texture overlay for a polished look */}
      <div className="absolute inset-0 opacity-[0.015] mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] animate-pulse-slow" />
    </div>
  )
}
