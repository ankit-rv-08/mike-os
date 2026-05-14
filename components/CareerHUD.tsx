'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useCareer } from '@/lib/career-context'
import { ArrowLeft, ChevronRight, CheckCircle2, Circle, Clock, Target, Zap, Brain, TrendingUp, Calendar, Flame, X, AlertCircle, BookOpen } from 'lucide-react'
import { useState, useEffect } from 'react'

// Types for MongoDB-ready data structure
interface DayTask {
  id: string
  title: string
  completed: boolean
  priority: 'high' | 'medium' | 'low'
  estimatedHours: number
}

interface DayData {
  dayNumber: number
  highPriorityTask: string
  tasks: DayTask[]
  focusHours: number
  status: 'pending' | 'in-progress' | 'completed'
}

interface WeekData {
  weekNumber: number
  startDate: string
  endDate: string
  theme: string
  days: DayData[]
  overallStatus: 'pending' | 'in-progress' | 'completed'
}

interface CareerRoadmap {
  weeks: WeekData[]
  targetDate: string
  currentWeek: number
}

export function CareerHUD() {
  const { isCareerHUDOpen, setIsCareerHUDOpen, careerFocusTime, incrementCareerFocusTime } = useCareer()
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [roadmap, setRoadmap] = useState<CareerRoadmap>(() => generateRoadmap())

  // Track focus time while HUD is open
  useEffect(() => {
    if (!isCareerHUDOpen) return

    const interval = setInterval(() => {
      incrementCareerFocusTime(1) // Add 1 minute every minute
    }, 60000)

    return () => clearInterval(interval)
  }, [isCareerHUDOpen, incrementCareerFocusTime])

  const handleBackToOS = () => {
    setIsCareerHUDOpen(false)
    setSelectedWeek(null)
    setSelectedDay(null)
  }

  const handleWeekClick = (weekNum: number) => {
    setSelectedWeek(weekNum)
    setSelectedDay(null)
  }

  const handleDayClick = (dayNum: number) => {
    setSelectedDay(dayNum)
  }

  const handleTaskToggle = (weekNum: number, dayNum: number, taskId: string) => {
    setRoadmap(prev => {
      const newRoadmap = { ...prev }
      const week = newRoadmap.weeks[weekNum - 1]
      const day = week.days[dayNum - 1]
      const task = day.tasks.find(t => t.id === taskId)
      if (task) {
        task.completed = !task.completed
      }
      return newRoadmap
    })
  }

  const hours = Math.floor(careerFocusTime / 60)
  const minutes = careerFocusTime % 60
  const dailyGoal = 5 * 60 // 5 hours in minutes
  const progress = Math.min((careerFocusTime / dailyGoal) * 100, 100)

  return (
    <AnimatePresence>
      {isCareerHUDOpen && (
        <>
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-2xl z-[200]"
            onClick={handleBackToOS}
          />

          {/* Main HUD Container - Full Screen */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-[#020617] z-[201] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-indigo-500/20 bg-gradient-to-r from-[#020617] to-[#0f172a]">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handleBackToOS}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 transition-all"
                >
                  <ArrowLeft size={18} />
                  <span className="text-sm font-bold uppercase tracking-wider">Back to MIKE OS</span>
                </button>

                <div className="flex items-center gap-4">
                  {/* Focus Clock */}
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900/50 border border-indigo-500/30">
                    <Clock size={16} className="text-indigo-400" />
                    <div className="text-sm">
                      <span className="text-indigo-400 font-bold">{hours}h {minutes}m</span>
                      <span className="text-slate-500 ml-2">/ 5h daily</span>
                    </div>
                  </div>

                  {/* Daily Goal Progress */}
                  <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-900/50 border border-indigo-500/30">
                    <div className="text-xs text-slate-400 uppercase tracking-wider">Progress</div>
                    <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className="text-sm text-indigo-400 font-bold w-10 text-right">{Math.round(progress)}%</span>
                  </div>
                </div>
              </div>

              <div>
                <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
                  CAREER <span className="text-indigo-500">COMMAND</span>
                </h1>
                <p className="text-slate-400 text-sm">Strategic Career Planning • Target: December 31, 2026</p>
              </div>
            </div>

            {/* Content Area - Three Column Layout (or Drilled Down View) */}
            <div className="flex-1 overflow-hidden flex">
              {!selectedWeek ? (
                /* Master View: Three Column Layout */
                <ThreeColumnLayout
                  roadmap={roadmap}
                  onWeekClick={handleWeekClick}
                />
              ) : !selectedDay ? (
                /* Weekly Gameplan */
                <WeeklyGameplan
                  week={roadmap.weeks[selectedWeek - 1]}
                  onBack={() => setSelectedWeek(null)}
                  onDayClick={handleDayClick}
                />
              ) : (
                /* Daily HUD */
                <DailyHUD
                  week={roadmap.weeks[selectedWeek - 1]}
                  day={roadmap.weeks[selectedWeek - 1].days[selectedDay - 1]}
                  onBack={() => setSelectedDay(null)}
                  onTaskToggle={(taskId) => handleTaskToggle(selectedWeek, selectedDay, taskId)}
                />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Three Column Layout: Master Timeline | Mission Control | AI Insights
function ThreeColumnLayout({ roadmap, onWeekClick }: { roadmap: CareerRoadmap, onWeekClick: (week: number) => void }) {
  return (
    <div className="w-full flex gap-6 p-6 overflow-hidden">
      {/* LEFT: Master Timeline */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex-1 overflow-y-auto pr-2"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-6 sticky top-0 bg-[#020617] z-10 py-2">
            <Target className="text-indigo-500" size={24} />
            <h2 className="text-lg font-bold text-white">Master Timeline</h2>
            <span className="text-xs text-slate-500 uppercase tracking-wider">W1-W33</span>
          </div>

          <div className="space-y-2">
            {roadmap.weeks.map((week) => (
              <motion.div
                key={week.weekNumber}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: week.weekNumber * 0.02 }}
                onClick={() => onWeekClick(week.weekNumber)}
                className={`group relative p-3 rounded-lg border transition-all cursor-pointer ${
                  week.weekNumber === roadmap.currentWeek
                    ? 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                    : 'bg-slate-900/30 border-slate-700/30 hover:border-indigo-500/30 hover:bg-slate-800/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                      week.weekNumber === roadmap.currentWeek
                        ? 'bg-indigo-500 text-white'
                        : 'bg-slate-800 text-slate-400 group-hover:bg-indigo-500/20 group-hover:text-indigo-400'
                    }`}>
                      W{week.weekNumber}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white text-sm truncate">{week.theme}</h3>
                      <p className="text-xs text-slate-500 truncate">{week.startDate}</p>
                    </div>
                  </div>
                  <ChevronRight 
                    size={16} 
                    className={`transition-transform flex-shrink-0 ml-2 ${
                      week.weekNumber === roadmap.currentWeek ? 'text-indigo-400' : 'text-slate-600 group-hover:translate-x-0.5'
                    }`}
                  />
                </div>

                {/* Progress indicator */}
                <div className="mt-2 h-1 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${(week.days.filter(d => d.status === 'completed').length / week.days.length) * 100}%` 
                    }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* CENTER: Mission Control (Active Sprints) */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 border-l border-r border-indigo-500/10 px-6 overflow-y-auto"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6 sticky top-0 bg-[#020617] z-10 py-2">
            <Zap className="text-orange-500" size={24} />
            <h2 className="text-lg font-bold text-white">Mission Control</h2>
          </div>

          {/* Current Active Sprint */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/5 border border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.1)]"
          >
            <div className="flex items-start gap-3 mb-4">
              <Flame className="text-orange-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="text-sm font-bold text-orange-400 uppercase tracking-wider">Current Sprint</h3>
                <p className="text-white font-semibold mt-1">DSA Mastery Sprint</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span>Days in Sprint</span>
                <span className="text-orange-400 font-bold">5 / 14</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                  initial={{ width: 0 }}
                  animate={{ width: '36%' }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </div>
              <div className="pt-2 text-xs text-slate-500">
                <div>Focus: Algorithms & Data Structures</div>
                <div className="mt-1 text-orange-400">🔥 High Priority</div>
              </div>
            </div>
          </motion.div>

          {/* Secondary Sprint */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/5 border border-purple-500/30"
          >
            <div className="flex items-start gap-3 mb-4">
              <Target className="text-purple-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider">Next Sprint</h3>
                <p className="text-white font-semibold mt-1">System Design Deep Dive</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span>Start in</span>
                <span className="text-purple-400 font-bold">3 days</span>
              </div>
              <div className="pt-2 text-xs text-slate-500">
                <div>Focus: Architecture Patterns & Scalability</div>
                <div className="mt-1 text-purple-400">📊 Moderate Priority</div>
              </div>
            </div>
          </motion.div>

          {/* Weekly Highlights */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50"
          >
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-3">This Week's Focus</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Circle size={4} className="text-indigo-500 flex-shrink-0" />
                <span>Complete binary tree traversal patterns</span>
              </li>
              <li className="flex items-center gap-2">
                <Circle size={4} className="text-indigo-500 flex-shrink-0" />
                <span>Review dynamic programming solutions</span>
              </li>
              <li className="flex items-center gap-2">
                <Circle size={4} className="text-indigo-500 flex-shrink-0" />
                <span>Practice system design questions</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </motion.div>

      {/* RIGHT: AI Career Trajectory Insights */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="flex-1 overflow-y-auto pl-2"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-6 sticky top-0 bg-[#020617] z-10 py-2">
            <Brain className="text-purple-500" size={24} />
            <h2 className="text-lg font-bold text-white">Career Insights</h2>
          </div>

          {/* Growth Trajectory */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/30"
          >
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="text-green-500" size={18} />
              <h3 className="text-sm font-bold text-green-400 uppercase tracking-wider">Trajectory</h3>
            </div>
            <div className="space-y-2">
              <p className="text-white text-sm font-semibold">On Track for Senior Engineer Role</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Based on current progress, you're advancing 18% faster than baseline. Continue this momentum for promotion by Q3.
              </p>
            </div>
          </motion.div>

          {/* Learning Velocity */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/30"
          >
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="text-blue-500" size={18} />
              <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Velocity</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Learning Rate</span>
                <span className="text-sm text-blue-400 font-bold">+24% this month</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                  initial={{ width: 0 }}
                  animate={{ width: '76%' }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </div>
            </div>
          </motion.div>

          {/* Skills Gap Analysis */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border border-amber-500/30"
          >
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="text-amber-500" size={18} />
              <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">Focus Areas</h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>• Advanced concurrency patterns (3 weeks)</li>
              <li>• Machine Learning fundamentals (4 weeks)</li>
              <li>• DevOps best practices (2 weeks)</li>
            </ul>
          </motion.div>

          {/* Next Milestone */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="p-4 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/30"
          >
            <div className="flex items-center gap-2 mb-3">
              <Target className="text-indigo-500" size={18} />
              <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider">Next Milestone</h3>
            </div>
            <p className="text-white text-sm font-semibold mb-2">Lead System Design Project</p>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>9 weeks away</span>
              <span className="text-indigo-400">88% ready</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

// Level 2: Weekly Gameplan Component
function WeeklyGameplan({ week, onBack, onDayClick }: { week: WeekData, onBack: () => void, onDayClick: (day: number) => void }) {
  return (
    <div className="w-full p-6 overflow-y-auto">
      <div className="space-y-6 max-w-5xl">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-indigo-500/30 transition-all"
          >
            <ArrowLeft size={18} className="text-slate-400" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-white">Week {week.weekNumber}</h2>
            <p className="text-sm text-indigo-400">{week.theme}</p>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-3">
          {week.days.map((day) => (
            <motion.div
              key={day.dayNumber}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: day.dayNumber * 0.05 }}
              onClick={() => onDayClick(day.dayNumber)}
              className={`p-3 rounded-xl border cursor-pointer transition-all ${
                day.status === 'completed'
                  ? 'bg-green-500/10 border-green-500/30'
                  : day.status === 'in-progress'
                  ? 'bg-indigo-500/10 border-indigo-500/30'
                  : 'bg-slate-900/50 border-slate-700/50 hover:border-indigo-500/30'
              }`}
            >
              <div className="text-center">
                <div className={`text-lg font-bold mb-1 ${
                  day.status === 'completed' ? 'text-green-400' : day.status === 'in-progress' ? 'text-indigo-400' : 'text-slate-400'
                }`}>
                  D{day.dayNumber}
                </div>
                <div className="text-[10px] text-slate-500 mb-2">
                  {day.focusHours}h
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${day.status === 'completed' ? 'bg-green-500' : 'bg-indigo-500'}`}
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${(day.tasks.filter(t => t.completed).length / day.tasks.length) * 100}%` 
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Level 3: Daily HUD Component
function DailyHUD({ week, day, onBack, onTaskToggle }: { week: WeekData, day: DayData, onBack: () => void, onTaskToggle: (taskId: string) => void }) {
  return (
    <div className="w-full p-6 overflow-y-auto">
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-indigo-500/30 transition-all"
          >
            <ArrowLeft size={18} className="text-slate-400" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-white">Day {day.dayNumber}</h2>
            <p className="text-sm text-slate-500">Week {week.weekNumber} • {week.theme}</p>
          </div>
        </div>

        {/* High Priority Task */}
        <div className="p-6 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30">
          <div className="flex items-center gap-3 mb-3">
            <Zap className="text-indigo-500" size={20} />
            <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400">High Priority Task</h3>
          </div>
          <p className="text-lg font-semibold text-white">{day.highPriorityTask}</p>
        </div>

        {/* Task Checklist */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Daily Tasks</h3>
          {day.tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: parseInt(task.id.split('-')[2]) * 0.05 }}
              onClick={() => onTaskToggle(task.id)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                task.completed
                  ? 'bg-green-500/5 border-green-500/20'
                  : 'bg-slate-900/50 border-slate-700/50 hover:border-indigo-500/30'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {task.completed ? (
                    <CheckCircle2 size={18} className="text-green-500" />
                  ) : (
                    <Circle size={18} className="text-slate-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${task.completed ? 'text-slate-500 line-through' : 'text-white'}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-[10px] uppercase px-2 py-0.5 rounded ${
                      task.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                      task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-slate-700 text-slate-400'
                    }`}>
                      {task.priority}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {task.estimatedHours}h estimated
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Focus Summary */}
        <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-indigo-400" />
              <span className="text-sm text-slate-400">Target Focus Time</span>
            </div>
            <span className="text-lg font-bold text-white">{day.focusHours}h</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Generate sample roadmap data (MongoDB-ready structure)
function generateRoadmap(): CareerRoadmap {
  const weeks: WeekData[] = []
  const startDate = new Date('2026-01-01')
  const targetDate = new Date('2026-12-31')
  
  for (let i = 1; i <= 33; i++) {
    const weekStart = new Date(startDate)
    weekStart.setDate(startDate.getDate() + (i - 1) * 7)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    
    const days: DayData[] = []
    for (let j = 1; j <= 7; j++) {
      days.push({
        dayNumber: j,
        highPriorityTask: `Complete milestone ${i}.${j} - Core development task`,
        tasks: [
          { id: `t${i}-${j}-1`, title: 'Review documentation', completed: false, priority: 'low', estimatedHours: 1 },
          { id: `t${i}-${j}-2`, title: 'Implement feature module', completed: false, priority: 'high', estimatedHours: 3 },
          { id: `t${i}-${j}-3`, title: 'Code review and testing', completed: false, priority: 'medium', estimatedHours: 2 },
          { id: `t${i}-${j}-4`, title: 'Update progress tracker', completed: false, priority: 'low', estimatedHours: 0.5 },
        ],
        focusHours: 6,
        status: 'pending',
      })
    }
    
    weeks.push({
      weekNumber: i,
      startDate: weekStart.toISOString().split('T')[0],
      endDate: weekEnd.toISOString().split('T')[0],
      theme: `Phase ${Math.ceil(i / 4)}: ${getPhaseTheme(i)}`,
      days,
      overallStatus: i === 1 ? 'in-progress' : 'pending',
    })
  }
  
  return {
    weeks,
    targetDate: targetDate.toISOString().split('T')[0],
    currentWeek: 1,
  }
}

function getPhaseTheme(week: number): string {
  const phases = [
    'Foundation & Setup',
    'Core Architecture',
    'Feature Development',
    'Integration & Testing',
    'Optimization & Scaling',
    'Launch Preparation',
    'Growth & Expansion',
    'Mastery & Innovation',
  ]
  return phases[Math.floor((week - 1) / 4)] || 'Advanced Development'
}
