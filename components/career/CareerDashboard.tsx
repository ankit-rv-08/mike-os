'use client'

import { motion } from 'framer-motion'
import { useCareer } from '@/lib/career-context'
import { TrendingUp, Users, Zap, Target, AlertTriangle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function CareerDashboard({ onCardClick }: { onCardClick: (tab: string) => void }) {
  const { careerFocusTime } = useCareer()

  // Data
  const focusHoursToday = Math.floor(careerFocusTime / 60)
  const dailyGoal = 5
  const focusProgress = Math.min((focusHoursToday / dailyGoal) * 100, 100)

  // Chart data (simulated last 7 days)
  const focusChartData = [
    { day: 'Mon', hours: 4.2 },
    { day: 'Tue', hours: 5.1 },
    { day: 'Wed', hours: 3.8 },
    { day: 'Thu', hours: 5.5 },
    { day: 'Fri', hours: 4.9 },
    { day: 'Sat', hours: 2.1 },
    { day: 'Sun', hours: Math.floor(careerFocusTime / 60) },
  ]

  const statCards = [
    {
      label: 'Identity Score',
      value: '77%',
      icon: Target,
      color: 'from-blue-500/20 to-cyan-500/10',
      borderColor: 'border-blue-500/30',
      trend: '+4',
      onClick: () => onCardClick('presence'),
    },
    {
      label: 'Active Leads',
      value: '7',
      icon: Users,
      color: 'from-green-500/20 to-emerald-500/10',
      borderColor: 'border-green-500/30',
      trend: '2 hot',
      onClick: () => onCardClick('outreach'),
    },
    {
      label: "Today's DSA",
      value: '1/6',
      icon: Zap,
      color: 'from-orange-500/20 to-amber-500/10',
      borderColor: 'border-orange-500/30',
      trend: focusHoursToday + 'h focus',
      onClick: () => onCardClick('pipeline'),
    },
    {
      label: 'Trajectory',
      value: 'On Track',
      icon: TrendingUp,
      color: 'from-purple-500/20 to-pink-500/10',
      borderColor: 'border-purple-500/30',
      trend: '62% confidence',
      onClick: () => onCardClick('timeline'),
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
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
      {/* Stats Grid */}
      <motion.div className="grid grid-cols-4 gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon
          return (
            <motion.div
              key={idx}
              variants={itemVariants}
              onClick={card.onClick}
              whileHover={{ borderColor: 'rgb(99, 102, 241, 0.6)', scale: 1.02 }}
              className={`backdrop-blur-xl bg-gradient-to-br ${card.color} border ${card.borderColor} rounded-xl p-6 hover:border-opacity-60 transition-all cursor-pointer`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-mono mb-1">{card.label}</p>
                  <p className="text-3xl font-bold text-white">{card.value}</p>
                </div>
                <Icon size={20} className="text-indigo-400 opacity-60" />
              </div>
              <p className="text-xs text-slate-500">{card.trend}</p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Analytics Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-6">
        {/* Career Velocity Chart */}
        <motion.div className="col-span-2 backdrop-blur-xl bg-slate-900/40 border border-white/10 rounded-xl p-6">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 font-mono">Career Velocity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={focusChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="day" stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#e2e8f0' }}
              />
              <Line
                type="monotone"
                dataKey="hours"
                stroke="#6366f1"
                dot={{ fill: '#6366f1', r: 4 }}
                strokeWidth={2}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-slate-500 mt-4">Focus hours tracked over last 7 days. Target: 5h/day.</p>
        </motion.div>

        {/* Next Milestone */}
        <motion.div className="backdrop-blur-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/30 rounded-xl p-6">
          <h3 className="text-sm font-bold text-indigo-300 uppercase tracking-wider mb-4 font-mono">Next Milestone</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-slate-300 mb-1">System Design: Sharding</p>
              <p className="text-xs text-slate-500">Week 4 · Starts in 14 days</p>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: '65%' }}
                transition={{ duration: 1.5 }}
              />
            </div>
            <p className="text-xs text-indigo-400">65% prep complete</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Trajectory Alert */}
      {focusHoursToday < 3 && (
        <motion.div
          variants={itemVariants}
          className="backdrop-blur-xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-xl p-6 flex items-start gap-4"
        >
          <AlertTriangle className="text-red-400 flex-shrink-0 mt-1" size={20} />
          <div>
            <p className="text-sm font-bold text-red-300 uppercase tracking-wider">Trajectory Alert</p>
            <p className="text-xs text-slate-400 mt-2">
              Focus hours ({focusHoursToday}h) below daily target. System restrictions may activate. Start a 25-min sprint now.
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
