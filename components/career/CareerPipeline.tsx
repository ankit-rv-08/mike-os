'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Circle, Clock, Zap } from 'lucide-react'
import { useState } from 'react'

export function CareerPipeline() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      category: 'DSA',
      title: 'Binary Tree Traversal Patterns',
      priority: 'high',
      time: '2h',
      status: 'completed',
    },
    {
      id: 2,
      category: 'DSA',
      title: 'Dynamic Programming: Memoization',
      priority: 'high',
      time: '3h',
      status: 'in-progress',
    },
    {
      id: 3,
      category: 'System Design',
      title: 'Database Sharding Strategies',
      priority: 'medium',
      time: '2.5h',
      status: 'pending',
    },
    {
      id: 4,
      category: 'System Design',
      title: 'Load Balancing & Caching',
      priority: 'high',
      time: '3h',
      status: 'in-progress',
    },
    {
      id: 5,
      category: 'Outreach',
      title: 'LinkedIn Cold Outreach (10 msgs)',
      priority: 'medium',
      time: '1h',
      status: 'pending',
    },
    {
      id: 6,
      category: 'Outreach',
      title: 'Follow-up Emails',
      priority: 'low',
      time: '30m',
      status: 'pending',
    },
  ])

  const moveTask = (taskId: number, newStatus: string) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, status: newStatus } : task))
  }

  const pendingTasks = tasks.filter(t => t.status === 'pending')
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress')
  const completedTasks = tasks.filter(t => t.status === 'completed')

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

  const TaskCard = ({ task }: { task: any }) => (
    <motion.div
      layout
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      className="backdrop-blur-xl bg-slate-900/40 border border-white/10 rounded-lg p-4 hover:border-indigo-500/30 transition-all cursor-move group"
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0">
          {task.status === 'completed' ? (
            <CheckCircle2 size={18} className="text-green-500" />
          ) : (
            <Circle size={18} className="text-slate-600" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className={`text-xs px-2 py-0.5 rounded uppercase tracking-wider font-mono ${
                task.category === 'DSA'
                  ? 'bg-blue-500/20 text-blue-400'
                  : task.category === 'System Design'
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'bg-green-500/20 text-green-400'
              }`}
            >
              {task.category}
            </span>
            {task.priority === 'high' && (
              <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400 uppercase tracking-wider">
                <Zap size={12} className="inline mr-1" />
                High
              </span>
            )}
          </div>
          <h4 className={`font-semibold text-sm ${task.status === 'completed' ? 'text-slate-500 line-through' : 'text-white'}`}>
            {task.title}
          </h4>
        </div>

        <div className="flex items-center gap-2 text-slate-500 flex-shrink-0 text-xs">
          <Clock size={14} />
          <span className="font-mono">{task.time}</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
        {task.status !== 'completed' && (
          <button
            onClick={() => moveTask(task.id, task.status === 'pending' ? 'in-progress' : 'completed')}
            className="flex-1 py-1.5 px-2 rounded bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/50 text-xs text-indigo-300 font-mono transition-colors"
          >
            {task.status === 'pending' ? 'Start' : 'Complete'}
          </button>
        )}
        {task.status !== 'pending' && (
          <button
            onClick={() => moveTask(task.id, 'pending')}
            className="flex-1 py-1.5 px-2 rounded bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-xs text-slate-400 font-mono transition-colors"
          >
            Back
          </button>
        )}
      </div>
    </motion.div>
  )

  const KanbanColumn = ({ title, tasks, status, color }: { title: string; tasks: any[]; status: string; color: string }) => (
    <motion.div
      layout
      variants={itemVariants}
      className="backdrop-blur-xl bg-slate-900/20 border border-white/5 rounded-xl p-6 space-y-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className={`font-bold uppercase tracking-wider text-sm ${color}`}>{title}</h3>
          <p className="text-xs text-slate-500 mt-1">{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</p>
        </div>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${color} opacity-50`}>
          {tasks.length}
        </div>
      </div>

      {/* Tasks Container */}
      <motion.div className="space-y-3 min-h-[200px]">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))
        ) : (
          <div className="flex items-center justify-center h-32 text-slate-500 text-sm">
            <p>No tasks here</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  )

  return (
    <motion.div
      className="p-8 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="backdrop-blur-xl bg-slate-900/40 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Execution Pipeline</h3>
            <p className="text-sm text-slate-400">Kanban board for active task management</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-indigo-400">
              {completedTasks.length}/{tasks.length}
            </p>
            <p className="text-xs text-slate-500">completed</p>
          </div>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div variants={itemVariants} className="backdrop-blur-xl bg-slate-900/40 border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-mono">Overall Progress</p>
          <p className="text-sm font-bold text-indigo-400">{Math.round((completedTasks.length / tasks.length) * 100)}%</p>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${(completedTasks.length / tasks.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>

      {/* Kanban Columns */}
      <motion.div className="grid grid-cols-3 gap-6">
        <KanbanColumn 
          title="📋 Pending" 
          tasks={pendingTasks} 
          status="pending"
          color="text-slate-400"
        />
        <KanbanColumn 
          title="⚡ In Progress" 
          tasks={inProgressTasks} 
          status="in-progress"
          color="text-amber-400"
        />
        <KanbanColumn 
          title="✅ Completed" 
          tasks={completedTasks} 
          status="completed"
          color="text-green-400"
        />
      </motion.div>

      {/* Pro Tip */}
      <motion.div variants={itemVariants} className="backdrop-blur-xl bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border border-amber-500/30 rounded-xl p-6">
        <p className="text-xs text-amber-400 uppercase tracking-wider font-mono mb-2">💡 Pro Tip</p>
        <p className="text-sm text-slate-300">
          Limit WIP (Work In Progress) to 2-3 tasks max. Hover over tasks to move them between columns quickly. Batch similar task types for maximum flow.
        </p>
      </motion.div>
    </motion.div>
  )
}

