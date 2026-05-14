'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

interface WidgetCoords {
  x: number
  y: number
}

interface CareerContextType {
  isCareerCommandOpen: boolean
  setIsCareerCommandOpen: (open: boolean) => void
  widgetCoords: WidgetCoords
  setWidgetCoords: (coords: WidgetCoords) => void
  toggleCareerCommand: () => void
  careerFocusTime: number
  incrementCareerFocusTime: (minutes: number) => void
  activeCareerTab: string
  setActiveCareerTab: (tab: string) => void
}

const CareerContext = createContext<CareerContextType | undefined>(undefined)

export function CareerProvider({ children }: { children: React.ReactNode }) {
  const [isCareerCommandOpen, setIsCareerCommandOpen] = useState(false)
  const [widgetCoords, setWidgetCoords] = useState<WidgetCoords>({ x: 20, y: 20 })
  const [careerFocusTime, setCareerFocusTime] = useState(0)
  const [activeCareerTab, setActiveCareerTab] = useState('dashboard')

  // Load widget coordinates from localStorage on mount
  useEffect(() => {
    const savedCoords = localStorage.getItem('career-widget-coords')
    if (savedCoords) {
      try {
        setWidgetCoords(JSON.parse(savedCoords))
      } catch (e) {
        // Use default if parse fails
      }
    }

    // Load career focus time
    const savedFocusTime = localStorage.getItem('career-focus-time')
    if (savedFocusTime) {
      try {
        setCareerFocusTime(parseInt(savedFocusTime, 10))
      } catch (e) {
        // Use default if parse fails
      }
    }

    // Load active tab
    const savedTab = localStorage.getItem('career-active-tab')
    if (savedTab) {
      setActiveCareerTab(savedTab)
    }
  }, [])

  // Save widget coordinates to localStorage when they change
  useEffect(() => {
    localStorage.setItem('career-widget-coords', JSON.stringify(widgetCoords))
  }, [widgetCoords])

  // Save career focus time to localStorage
  useEffect(() => {
    localStorage.setItem('career-focus-time', careerFocusTime.toString())
  }, [careerFocusTime])

  // Save active tab to localStorage
  useEffect(() => {
    localStorage.setItem('career-active-tab', activeCareerTab)
  }, [activeCareerTab])

  const toggleCareerCommand = useCallback(() => {
    setIsCareerCommandOpen(prev => !prev)
  }, [])

  const incrementCareerFocusTime = useCallback((minutes: number) => {
    setCareerFocusTime(prev => prev + minutes)
  }, [])

  return (
    <CareerContext.Provider
      value={{
        isCareerCommandOpen,
        setIsCareerCommandOpen,
        widgetCoords,
        setWidgetCoords,
        toggleCareerCommand,
        careerFocusTime,
        incrementCareerFocusTime,
        activeCareerTab,
        setActiveCareerTab,
      }}
    >
      {children}
    </CareerContext.Provider>
  )
}

export function useCareer() {
  const context = useContext(CareerContext)
  if (!context) {
    throw new Error('useCareer must be used within CareerProvider')
  }
  return context
}
