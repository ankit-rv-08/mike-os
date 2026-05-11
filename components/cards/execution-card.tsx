'use client'

import { useState } from 'react'
import { MoreVertical, CheckCircle2, Circle } from 'lucide-react'

export function ExecutionCard() {
  const [menuOpen, setMenuOpen] = useState(false)
  
  // Real Interactive State
  const [tasks, setTasks] = useState([
    { id: 1, text: "Review DeepSeek API setup", done: true },
    { id: 2, text: "Deploy MIKE OS Dashboard UI", done: true },
    { id: 3, text: "Sync Groq routing logic", done: false },
    { id: 4, text: "Review DSA Array Patterns", done: false },
    { id: 5, text: "Update LinkedIn for HUDRA", done: false }
  ])

  const completedCount = tasks.filter(t => t.done).length
  const totalCount = tasks.length
  const progressPercent = Math.round((completedCount / totalCount) * 100)

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-bold text-slate-300 flex items-center gap-2">
          <span className="text-blue-400">📋</span>
          EXECUTION (Tasks)
        </h2>
        <button onClick={() => setMenuOpen(!menuOpen)} className="p-1 hover:bg-slate-700 rounded transition-all">
          <MoreVertical size={16} className="text-slate-400" />
        </button>
      </div>

      <div className="space-y-4">
        {/* Active Projects Tracker */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400">Daily Execution Flow</span>
            <span className="text-sm font-bold text-white">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-cyan-500 h-2 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(6,182,212,0.5)]" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Clickable Task List */}
        <div className="space-y-2 mt-4 pt-2 border-t border-slate-700/50 max-h-[140px] overflow-y-auto pr-1">
          {tasks.map(task => (
            <div 
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`flex items-start gap-3 p-2 rounded cursor-pointer transition-all border border-transparent hover:bg-slate-800 ${
                task.done ? 'opacity-50' : 'hover:border-slate-600'
              }`}
            >
              <div className="mt-0.5">
                {task.done ? (
                  <CheckCircle2 size={16} className="text-cyan-400" />
                ) : (
                  <Circle size={16} className="text-slate-500" />
                )}
              </div>
              <span className={`text-sm ${task.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                {task.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}