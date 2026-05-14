'use client'

import { motion } from 'framer-motion'
import { Linkedin, Github, FileText, Lightbulb, Edit2 } from 'lucide-react'
import { useState } from 'react'

export function CareerPresence() {
  const [notes, setNotes] = useState('')
  const [showNotes, setShowNotes] = useState(false)

  const scoreCards = [
    {
      icon: Linkedin,
      label: 'LinkedIn Score',
      value: 78,
      trend: '+4',
      color: 'from-blue-500/20 to-cyan-500/10',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
    },
    {
      icon: Github,
      label: 'GitHub Commit Health',
      value: 64,
      trend: '-2',
      color: 'from-slate-500/20 to-gray-500/10',
      borderColor: 'border-slate-500/30',
      textColor: 'text-slate-400',
    },
    {
      icon: FileText,
      label: 'Resume Integrity',
      value: 88,
      trend: '+1',
      color: 'from-green-500/20 to-emerald-500/10',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-400',
    },
  ]

  const improvementTips = [
    '▸ Post a system-design teardown twice a week on LinkedIn',
    '▸ Engage with 10 senior engineers daily in comments/discussions',
    '▸ Update GitHub repos with detailed READMEs every 2 weeks',
    '▸ Maintain a consistent commit streak (target: 3-5 commits/day)',
    '▸ Add 2 new projects to portfolio showcasing 15 LPA-level work',
    '▸ Optimize resume: Add measurable impact metrics for each role',
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
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
      {/* Header */}
      <motion.div variants={itemVariants} className="backdrop-blur-xl bg-slate-900/40 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Identity HUD</h3>
            <p className="text-sm text-slate-400">Presence Matrix across LinkedIn, GitHub, and Resume</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-indigo-400">77%</p>
            <p className="text-xs text-slate-500">avg identity score</p>
          </div>
        </div>
      </motion.div>

      {/* Score Cards Grid */}
      <motion.div className="grid grid-cols-3 gap-6">
        {scoreCards.map((card, idx) => {
          const Icon = card.icon
          return (
            <motion.div
              key={idx}
              variants={itemVariants}
              className={`backdrop-blur-xl bg-gradient-to-br ${card.color} border ${card.borderColor} rounded-xl p-6`}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-mono mb-2">{card.label}</p>
                  <div className="flex items-end gap-2">
                    <p className="text-4xl font-bold text-white">{card.value}</p>
                    <div className={`flex items-center gap-1 text-sm font-bold mb-1 ${card.trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      <span>{card.trend}</span>
                    </div>
                  </div>
                </div>
                <Icon className={`${card.textColor} opacity-60`} size={24} />
              </div>

              <motion.button
                whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.2)' }}
                className="w-full py-2 px-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs text-slate-400 hover:text-slate-300 transition-all font-mono uppercase tracking-wider"
              >
                Generate Update
              </motion.button>
            </motion.div>
          )
        })}
      </motion.div>

      {/* AI Improvement Tips */}
      <motion.div variants={itemVariants} className="backdrop-blur-xl bg-gradient-to-br from-amber-500/10 to-yellow-500/5 border border-amber-500/30 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Lightbulb className="text-amber-400" size={20} />
          <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider">AI Improvement Tips</h3>
        </div>
        <div className="space-y-2 text-sm text-slate-300">
          {improvementTips.map((tip, idx) => (
            <motion.p key={idx} variants={itemVariants} className="leading-relaxed">
              {tip}
            </motion.p>
          ))}
        </div>
      </motion.div>

      {/* Notes Section */}
      <motion.div variants={itemVariants} className="backdrop-blur-xl bg-slate-900/40 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Personal Notes</h3>
          <button
            onClick={() => setShowNotes(!showNotes)}
            className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
          >
            <Edit2 size={16} className="text-slate-400" />
          </button>
        </div>
        {showNotes ? (
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add your personal notes about your career strategy..."
            className="w-full h-32 bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 resize-none"
          />
        ) : (
          <p className="text-sm text-slate-400">{notes || 'No notes yet. Click edit to add notes.'}</p>
        )}
      </motion.div>
    </motion.div>
  )
}
