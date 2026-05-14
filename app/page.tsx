'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from '@/components/sidebar'
import { MainDashboard } from '@/components/main-dashboard'
import { ThemeProvider } from '@/components/theme-provider'
import { CareerProvider, useCareer } from '@/lib/career-context'
import { FloatingWidget } from '@/components/FloatingWidget'
import { CareerCommand } from '@/components/CareerCommand'

function HomeContent() {
  const [activeNav, setActiveNav] = useState('CORE')
  const { isCareerCommandOpen } = useCareer()

  return (
    <div className="relative h-screen overflow-hidden" style={{ perspective: '1200px' }}>
      <motion.div
        className="h-screen flex overflow-hidden transition-colors duration-700 ease-in-out bg-[var(--bg-primary)] text-[var(--text-primary)]"
        animate={{
          scale: isCareerCommandOpen ? 0.9 : 1,
          rotateX: isCareerCommandOpen ? -5 : 0,
          filter: isCareerCommandOpen ? 'blur(12px)' : 'blur(0px)',
        }}
        transition={{
          type: 'spring',
          damping: 25,
          stiffness: 200,
        }}
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
        <MainDashboard activeNav={activeNav} />
      </motion.div>

      <FloatingWidget />
      <CareerCommand />
    </div>
  )
}

export default function Home() {
  return (
    <ThemeProvider>
      <CareerProvider>
        <HomeContent />
      </CareerProvider>
    </ThemeProvider>
  )
}