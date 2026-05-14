'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, CheckCircle2, Circle, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export function CareerTimeline() {
  const [selectedWeek, setSelectedWeek] = useState(1)
  const [expandedDay, setExpandedDay] = useState<number | null>(null)
  const [dayTasks, setDayTasks] = useState<Record<number, { completed: boolean; name: string }[]>>({
    1: [
      { completed: true, name: 'Binary Tree Reversal' },
      { completed: false, name: 'Graph DFS Practice' },
    ],
    2: [
      { completed: false, name: 'DP Problem Set' },
    ],
  })

  // Generate 33 weeks of data
  const weeks = Array.from({ length: 33 }, (_, i) => {
    const weekNum = i + 1
    const phase = Math.ceil(weekNum / 4)
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
    return {
      number: weekNum,
      phase,
      phaseName: phases[phase - 1] || 'Advanced Development',
      status: weekNum === 1 ? 'in-progress' : weekNum < 1 ? 'completed' : 'pending',
      focus: ['DSA', 'System Design', 'Outreach'][Math.floor(Math.random() * 3)],
      completion: weekNum === 1 ? 65 : weekNum < 1 ? 100 : 0,
    }
  })

  const selectedWeekData = weeks[selectedWeek - 1]
  const nextDeadline = new Date('2026-12-31')
  const daysRemaining = Math.ceil((nextDeadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  const toggleDayTask = (dayIndex: number, taskIndex: number) => {
    const dayKey = dayIndex
    if (!dayTasks[dayKey]) dayTasks[dayKey] = []
    const updated = [...dayTasks[dayKey]]
    updated[taskIndex].completed = !updated[taskIndex].completed
    setDayTasks({ ...dayTasks, [dayKey]: updated })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      className="p-8 space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header with Countdown */}
      <motion.div variants={itemVariants} className="backdrop-blur-xl bg-slate-900/40 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Master Timeline</h3>
            <p className="text-sm text-slate-400">33 weeks · locked on Dec 31, 2026</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-indigo-400">{daysRemaining}</p>
            <p className="text-xs text-slate-500 uppercase tracking-wider">days remaining</p>
          </div>
        </div>
      </motion.div>

      {/* Week Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-12 gap-2">
        {weeks.map((week) => (
          <motion.button
            key={week.number}
            onClick={() => setSelectedWeek(week.number)}
            whileHover={{ scale: 1.05 }}
            className={`aspect-square rounded-lg flex items-center justify-center font-bold text-xs transition-all ${
              week.number === selectedWeek
                ? 'bg-indigo-500 text-white border-2 border-indigo-400'
                : week.status === 'completed'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : week.status === 'in-progress'
                ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700/30 hover:border-indigo-500/30'
            }`}
          >
            W{week.number}
          </motion.button>
        ))}
      </motion.div>

      {/* Week Details */}
      {selectedWeekData && (
        <motion.div variants={itemVariants} className="grid grid-cols-3 gap-6">
          {/* Week Info */}
          <motion.div className="backdrop-blur-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/30 rounded-xl p-6">
            <h4 className="text-sm font-bold text-indigo-300 uppercase tracking-wider mb-4 font-mono">Week {selectedWeekData.number}</h4>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Phase</p>
                <p className="text-lg font-bold text-white">{selectedWeekData.phaseName}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Primary Focus</p>
                <p className="text-sm text-indigo-400">{selectedWeekData.focus}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Completion</p>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${selectedWeekData.completion}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">{selectedWeekData.completion}%</p>
              </div>
            </div>
          </motion.div>

          {/* Daily Breakdown with Expandable Days */}
          <motion.div className="col-span-2 backdrop-blur-xl bg-slate-900/40 border border-white/10 rounded-xl p-6 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Daily Breakdown</h4>
            <div className="space-y-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                const isExpanded = expandedDay === idx
                const tasks = dayTasks[idx] || []

                return (
                  <motion.div key={day} className="border border-white/10 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedDay(isExpanded ? null : idx)}
                      className="w-full p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1 text-left">
                        <p className="text-xs text-slate-500 uppercase font-mono min-w-[60px]">{day}</p>
                        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden max-w-xs">
                          <motion.div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${idx < 5 ? 75 : 40}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <p className="text-xs text-slate-400 font-mono">{idx < 5 ? '6h' : '3h'} focus</p>
                      </div>
                      <ChevronDown
                        size={16}
                        className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* Expanded Day Tasks */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-white/10 bg-slate-800/20 p-4 space-y-3"
                        >
                          {/* Task List */}
                          <div className="space-y-2">
                            {tasks.map((task, taskIdx) => (
                              <motion.button
                                key={taskIdx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: taskIdx * 0.05 }}
                                onClick={() => toggleDayTask(idx, taskIdx)}
                                className="w-full flex items-center gap-3 p-2 rounded hover:bg-slate-700/50 transition-colors text-left"
                              >
                                {task.completed ? (
                                  <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                                ) : (
                                  <Circle size={16} className="text-slate-600 flex-shrink-0" />
                                )}
                                <span
                                  className={`text-sm ${
                                    task.completed ? 'text-slate-500 line-through' : 'text-slate-300'
                                  }`}
                                >
                                  {task.name}
                                </span>
                              </motion.button>
                            ))}
                          </div>

                          {/* Mark Day Complete */}
                          <motion.button className="w-full py-2 px-3 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/50 text-xs text-indigo-300 font-mono transition-colors uppercase tracking-wider">
                            ✓ Mark Day Complete
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Mission Control Card */}
      <motion.div variants={itemVariants} className="backdrop-blur-xl bg-gradient-to-br from-orange-500/10 to-red-500/5 border border-orange-500/30 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-orange-300 uppercase tracking-wider mb-2 font-mono">Current Sprint</h4>
            <p className="text-xl font-bold text-white">DSA Mastery Sprint</p>
            <p className="text-xs text-slate-400 mt-1">Week 1 · Day 5/7</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-orange-400">71%</p>
            <p className="text-xs text-slate-500">on track</p>
          </div>
        </div>
      </motion.div>

      {/* Career Insights */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-6">
        <div className="backdrop-blur-xl bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/30 rounded-xl p-6">
          <p className="text-xs text-green-400 uppercase tracking-wider font-mono mb-2">Growth Trajectory</p>
          <p className="text-sm text-white">Senior Engineer track, +18% ahead of pace</p>
        </div>
        <div className="backdrop-blur-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/30 rounded-xl p-6">
          <p className="text-xs text-blue-400 uppercase tracking-wider font-mono mb-2">Learning Velocity</p>
          <p className="text-sm text-white">+24% this month</p>
        </div>
        <div className="backdrop-blur-xl bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/30 rounded-xl p-6">
          <p className="text-xs text-purple-400 uppercase tracking-wider font-mono mb-2">Next Milestone</p>
          <p className="text-sm text-white">System Design Deep Dive, 9 weeks</p>
        </div>
      </motion.div>
    </motion.div>
  )
}
