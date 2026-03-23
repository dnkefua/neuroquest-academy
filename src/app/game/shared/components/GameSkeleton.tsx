'use client'
import { motion } from 'framer-motion'

export default function GameSkeleton() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #1a0033 0%, #0d001a 50%, #1a0033 100%)' }}>

      {/* Header skeleton */}
      <div className="w-full max-w-2xl px-6 mb-8">
        <div className="h-12 bg-white/5 rounded-2xl animate-pulse mb-4" />
        <div className="h-6 bg-white/5 rounded-xl animate-pulse w-3/4" />
      </div>

      {/* Card skeleton */}
      <motion.div
        className="w-full max-w-2xl mx-6 p-8 rounded-3xl border"
        style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.1)' }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="space-y-4">
          <div className="h-8 bg-white/5 rounded-xl animate-pulse" />
          <div className="h-4 bg-white/5 rounded-lg animate-pulse w-5/6" />
          <div className="h-4 bg-white/5 rounded-lg animate-pulse w-4/6" />
          <div className="h-4 bg-white/5 rounded-lg animate-pulse w-3/4" />
        </div>
      </motion.div>

      {/* Progress bar skeleton */}
      <div className="w-full max-w-2xl px-6 mt-8">
        <div className="h-3 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-600 to-teal-500 rounded-full animate-pulse"
            style={{ width: '40%' }} />
        </div>
      </div>

      <p className="mt-8 text-white/40 text-sm font-medium">Loading adventure...</p>
    </div>
  )
}
