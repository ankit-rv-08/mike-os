'use client'

import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { useCareer } from '@/lib/career-context'
import { Target } from 'lucide-react'
import { useState } from 'react'

export function FloatingWidget() {
  const { toggleCareerCommand, widgetCoords, setWidgetCoords, careerFocusTime } = useCareer()
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartTime, setDragStartTime] = useState(0)
  const [dragStartCoords, setDragStartCoords] = useState({ x: 0, y: 0 })

  const x = useMotionValue(widgetCoords.x)
  const y = useMotionValue(widgetCoords.y)

  const handleDragStart = () => {
    setDragStartTime(Date.now())
    setDragStartCoords({ x: x.get(), y: y.get() })
    setIsDragging(true)
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const dragDuration = Date.now() - dragStartTime
    const dragDistance = Math.sqrt(info.offset.x ** 2 + info.offset.y ** 2)
    
    // Threshold: if drag distance < 8px and duration < 200ms, treat as click
    const isClick = dragDistance < 8 && dragDuration < 200

    // Save new coordinates regardless of click or drag
    setWidgetCoords({ x: x.get(), y: y.get() })

    if (isClick) {
      toggleCareerCommand()
    }
    setIsDragging(false)
  }

  const hours = Math.floor(careerFocusTime / 60)
  const minutes = careerFocusTime % 60

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      initial={{ x: widgetCoords.x, y: widgetCoords.y }}
      style={{ x, y }}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      className="fixed z-[100] cursor-pointer"
    >
      <motion.div
        className="relative group"
        animate={{
          boxShadow: isDragging 
            ? '0 0 30px rgba(99, 102, 241, 0.6)' 
            : '0 0 20px rgba(99, 102, 241, 0.4), 0 0 40px rgba(99, 102, 241, 0.2)'
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Main Orb */}
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
          {/* Inner glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
          
          {/* Pulse animation */}
          <motion.div
            className="absolute inset-0 rounded-full bg-indigo-500/50"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Icon */}
          <Target size={24} className="relative z-10 text-white" />
        </div>

        {/* Focus Timer Badge */}
        <motion.div
          className="absolute -bottom-1 -right-1 bg-slate-900 border border-indigo-500/50 rounded-full px-2 py-1 text-[10px] font-bold text-indigo-400 whitespace-nowrap"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {hours}h {minutes}m
        </motion.div>

        {/* Tooltip */}
        <motion.div
          className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-slate-900/95 backdrop-blur-md border border-indigo-500/30 rounded-lg px-3 py-2 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          initial={{ x: -10 }}
          whileHover={{ x: 0 }}
        >
          <div className="font-bold text-indigo-400">Career Command</div>
          <div className="text-[10px] text-slate-400">Click to open • Drag to move</div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
