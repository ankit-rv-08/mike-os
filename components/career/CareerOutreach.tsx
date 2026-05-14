'use client'

import { motion } from 'framer-motion'
import { Users, ChevronDown, MessageSquare, FileText } from 'lucide-react'
import { useState } from 'react'

export function CareerOutreach() {
  const [expandedRecruiter, setExpandedRecruiter] = useState<number | null>(null)
  const [recruiterNotes, setRecruiterNotes] = useState<Record<number, string>>({})

  const recruiters = [
    {
      id: 1,
      name: 'Sarah Chen',
      title: 'Senior Talent Acquisitor',
      company: 'Google',
      match: 92,
      lastContact: '3 days ago',
      status: 'hot',
    },
    {
      id: 2,
      name: 'Michael Rodriguez',
      title: 'Tech Recruiter',
      company: 'Amazon',
      match: 87,
      lastContact: '1 week ago',
      status: 'hot',
    },
    {
      id: 3,
      name: 'Priya Sharma',
      title: 'Engineering Recruiter',
      company: 'Microsoft',
      match: 78,
      lastContact: '10 days ago',
      status: 'warm',
    },
    {
      id: 4,
      name: 'James Wilson',
      title: 'Director of Talent',
      company: 'Stripe',
      match: 85,
      lastContact: '2 weeks ago',
      status: 'warm',
    },
    {
      id: 5,
      name: 'Lisa Park',
      title: 'Recruiting Manager',
      company: 'Airbnb',
      match: 72,
      lastContact: '3 weeks ago',
      status: 'warm',
    },
    {
      id: 6,
      name: 'David Kumar',
      title: 'Senior Recruiter',
      company: 'Uber',
      match: 68,
      lastContact: '1 month ago',
      status: 'cold',
    },
    {
      id: 7,
      name: 'Emma Thompson',
      title: 'Talent Sourcer',
      company: 'Atlassian',
      match: 65,
      lastContact: '1 month ago',
      status: 'cold',
    },
  ]

  const strategies = [
    {
      title: 'Hot Lead Strategy',
      description: 'Follow up within 2 days. Showcase recent achievements. Personalize message.',
      color: 'from-red-500/20 to-orange-500/10',
      borderColor: 'border-red-500/30',
    },
    {
      title: 'Warm Lead Nurture',
      description: 'Engage with their LinkedIn content. Share relevant articles. Build rapport over time.',
      color: 'from-orange-500/20 to-amber-500/10',
      borderColor: 'border-orange-500/30',
    },
    {
      title: 'Cold Outreach Protocol',
      description: 'Start with value add. Reference mutual connections. Focus on alignment with role.',
      color: 'from-blue-500/20 to-slate-500/10',
      borderColor: 'border-blue-500/30',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'warm':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'cold':
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
    }
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
      {/* Header */}
      <motion.div variants={itemVariants} className="backdrop-blur-xl bg-slate-900/40 border border-white/10 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Users className="text-indigo-400" size={24} />
            <div>
              <h3 className="text-2xl font-bold text-white">Target Recruiters</h3>
              <p className="text-sm text-slate-400">Active outreach pipeline across FAANG and growth companies</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-green-400">7</p>
            <p className="text-xs text-slate-500">active recruiter leads</p>
          </div>
        </div>
      </motion.div>

      {/* Recruiters Feed */}
      <motion.div className="space-y-3">
        {recruiters.map((recruiter, idx) => (
          <motion.div
            key={recruiter.id}
            variants={itemVariants}
            className="backdrop-blur-xl bg-slate-900/40 border border-white/10 rounded-xl overflow-hidden hover:border-indigo-500/20 transition-all"
          >
            <button
              onClick={() => setExpandedRecruiter(expandedRecruiter === recruiter.id ? null : recruiter.id)}
              className="w-full p-6 flex items-center justify-between hover:bg-slate-800/30 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500/30 to-purple-500/20 flex items-center justify-center border border-indigo-500/30">
                  <span className="text-sm font-bold text-indigo-300">{recruiter.name.split(' ').map(n => n[0]).join('')}</span>
                </div>

                {/* Recruiter Info */}
                <div className="text-left flex-1">
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-white">{recruiter.name}</p>
                    <span className={`px-2 py-1 text-xs font-mono uppercase rounded border ${getStatusColor(recruiter.status)}`}>
                      {recruiter.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400">{recruiter.title} at {recruiter.company}</p>
                </div>

                {/* Match Score */}
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-indigo-400">{recruiter.match}%</p>
                    <p className="text-xs text-slate-500">match</p>
                  </div>

                  {/* Last Contact */}
                  <div className="text-right min-w-[100px]">
                    <p className="text-sm text-slate-400">{recruiter.lastContact}</p>
                    <p className="text-xs text-slate-600">last contact</p>
                  </div>

                  {/* Expand Icon */}
                  <ChevronDown
                    size={20}
                    className={`text-slate-400 transition-transform ${
                      expandedRecruiter === recruiter.id ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>
            </button>

            {/* Expanded Details */}
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: expandedRecruiter === recruiter.id ? 'auto' : 0,
                opacity: expandedRecruiter === recruiter.id ? 1 : 0,
              }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-white/10"
            >
              <div className="p-6 space-y-4 bg-slate-800/20">
                {/* Tags */}
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-mono mb-3">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {recruiter.status === 'hot' && (
                      <>
                        <span className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-xs text-red-300 font-mono">
                          urgent-follow-up
                        </span>
                        <span className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-xs text-red-300 font-mono">
                          demo-ready
                        </span>
                      </>
                    )}
                    {recruiter.status === 'warm' && (
                      <>
                        <span className="px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/30 text-xs text-orange-300 font-mono">
                          nurture
                        </span>
                      </>
                    )}
                    {recruiter.status === 'cold' && (
                      <>
                        <span className="px-3 py-1 rounded-full bg-slate-500/20 border border-slate-500/30 text-xs text-slate-300 font-mono">
                          first-touch
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-mono mb-3">Notes</p>
                  <textarea
                    value={recruiterNotes[recruiter.id] || ''}
                    onChange={(e) => setRecruiterNotes({ ...recruiterNotes, [recruiter.id]: e.target.value })}
                    placeholder="Add notes about this recruiter..."
                    className="w-full h-24 bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/50 rounded-lg text-indigo-300 text-sm font-mono transition-colors">
                    <MessageSquare size={16} />
                    Generate Cold DM
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-lg text-slate-400 text-sm font-mono transition-colors">
                    <FileText size={16} />
                    View Profile
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {/* Strategy Cards */}
      <motion.div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
        {strategies.map((strategy, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            className={`backdrop-blur-xl bg-gradient-to-br ${strategy.color} border ${strategy.borderColor} rounded-xl p-6`}
          >
            <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">{strategy.title}</h4>
            <p className="text-sm text-slate-300 leading-relaxed">{strategy.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
}
