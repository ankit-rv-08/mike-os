'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useCareer } from '@/lib/career-context'
import { X, ArrowLeft, AlertTriangle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { CareerDashboard } from './career/CareerDashboard'
import { CareerTimeline } from './career/CareerTimeline'
import { CareerOutreach } from './career/CareerOutreach'
import { CareerPipeline } from './career/CareerPipeline'
import { CareerPresence } from './career/CareerPresence'
import { MikeSidebar } from './career/MikeSidebar'

export function CareerCommand() {
  const { isCareerCommandOpen, setIsCareerCommandOpen, activeCareerTab, setActiveCareerTab, careerFocusTime, incrementCareerFocusTime } = useCareer()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Track focus time while open
  useEffect(() => {
    if (!isCareerCommandOpen) return

    const interval = setInterval(() => {
      incrementCareerFocusTime(1)
    }, 60000)

    return () => clearInterval(interval)
  }, [isCareerCommandOpen, incrementCareerFocusTime])

  // Keyboard shortcuts
  useEffect(() => {
    if (!isCareerCommandOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setIsCareerCommandOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCareerCommandOpen, setIsCareerCommandOpen])

  if (!mounted) return null

  return (
    <AnimatePresence>
      {isCareerCommandOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-2xl z-[200]"
            onClick={() => setIsCareerCommandOpen(false)}
          />

          {/* Main Career Command Container */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="fixed inset-0 z-[201] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Full Screen Glassmorphic Container */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
              {/* Animated mesh gradient background */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-60" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-purple-500/5 via-transparent to-transparent opacity-40" />
            </div>

            {/* Content Wrapper */}
            <div className="relative h-full flex flex-col z-10">
              {/* Header Bar */}
              <div className="backdrop-blur-xl bg-slate-950/40 border-b border-white/10 px-8 py-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <motion.h1 
                      className="text-3xl font-bold text-white tracking-tight"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      CAREER <span className="text-indigo-400">COMMAND</span>
                    </motion.h1>
                    <div className="text-xs text-slate-400 font-mono uppercase tracking-wider">// MASTER CONTROL</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span>System Status: Placing…</span>
                    </div>
                    <button
                      onClick={() => setIsCareerCommandOpen(false)}
                      className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
                    >
                      <X size={20} className="text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 items-center">
                  {['dashboard', 'presence', 'outreach', 'pipeline', 'timeline'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveCareerTab(tab)}
                      className={`px-4 py-2 rounded-lg font-mono text-sm uppercase tracking-wider transition-all ${
                        activeCareerTab === tab
                          ? 'bg-indigo-500/20 border border-indigo-500/50 text-indigo-300'
                          : 'text-slate-400 border border-transparent hover:bg-slate-800/30 hover:text-slate-300'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Content Area with Sidebar */}
              <div className="flex-1 flex overflow-hidden">
                {/* Main Content (3-column grid) */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex-1 overflow-y-auto pr-4"
                >
                  {activeCareerTab === 'dashboard' && <CareerDashboard onCardClick={setActiveCareerTab} />}
                  {activeCareerTab === 'presence' && <CareerPresence />}
                  {activeCareerTab === 'timeline' && <CareerTimeline />}
                  {activeCareerTab === 'outreach' && <CareerOutreach />}
                  {activeCareerTab === 'pipeline' && <CareerPipeline />}
                </motion.div>

                {/* Persistent MIKE AI Sidebar */}
                <MikeSidebar />
              </div>

              {/* Alert Marquee Footer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="backdrop-blur-xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border-t border-red-500/30 px-8 py-4 flex items-center gap-4"
              >
                <AlertTriangle className="text-red-400 flex-shrink-0" size={20} />
                <div className="flex-1">
                  <p className="text-sm font-bold text-red-300 uppercase tracking-wider font-mono animate-pulse">
                    ⚠️ TRAJECTORY ALERT: MISSING MILESTONE 'SYSTEM DESIGN: CACHING'. SYSTEM RESTRICTIONS ACTIVE.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
