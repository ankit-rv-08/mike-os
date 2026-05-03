'use client';

import { Calendar, AlertCircle, TrendingUp, Zap, Activity, Flame, Heart, Brain, Target, CheckCircle2, Lock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useState } from 'react';

// Daily Briefing Data
const dailyBriefing = {
  sleepQuality: 6.8,
  sleepTarget: 8,
  pendingTasks: 5,
  focusHoursAvailable: '9–11 AM',
  missedYesterday: 2,
  streak: 6,
};

// Life Score System (The Core Retention Feature)
const lifeScores = {
  overall: 74,
  mind: 80,
  body: 65,
  work: 78,
  discipline: 72,
};

const lifeScoringBreakdown = [
  { name: 'Mind', value: 80, color: 'rgb(100, 200, 255)' },
  { name: 'Body', value: 65, color: 'rgb(34, 197, 94)' },
  { name: 'Work', value: 78, color: 'rgb(168, 85, 247)' },
  { name: 'Discipline', value: 72, color: 'rgb(251, 146, 60)' },
];

const dailySummary = [
  { label: 'Tasks', value: 12, completed: 8 },
  { label: 'Meetings', value: 3, completed: 1 },
  { label: 'Focus Hours', value: 6.5, completed: 4.2 },
];

const productivityData = [
  { day: 'Mon', score: 78 },
  { day: 'Tue', score: 85 },
  { day: 'Wed', score: 72 },
  { day: 'Thu', score: 88 },
  { day: 'Fri', score: 92 },
  { day: 'Sat', score: 65 },
  { day: 'Sun', score: 55 },
];

const aiInsights = [
  { id: 1, icon: '⚡', title: 'Peak productivity', desc: 'Friday 10-11 AM is your most productive hour', type: 'positive' },
  { id: 2, icon: '📅', title: 'Meeting reminder', desc: '3 meetings scheduled for tomorrow', type: 'info' },
  { id: 3, icon: '🎯', title: 'Goal progress', desc: 'On track for weekly targets', type: 'positive' },
  { id: 4, icon: '⚠️', title: 'Sleep impact', desc: 'Your sleep affects productivity by 23%', type: 'warning' },
];

const upcomingEvents = [
  { time: '10:30 AM', title: 'Team Standup', type: 'meeting' },
  { time: '2:00 PM', title: 'Project Review', type: 'meeting' },
  { time: '4:30 PM', title: 'Client Call', type: 'meeting' },
];

export default function Dashboard() {
  const [completedToday] = useState(8);
  const totalTasks = 12;
  const completionPercentage = Math.round((completedToday / totalTasks) * 100);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Daily AI Briefing Header */}
      <div className="glass-panel-lg p-8 border border-accent/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-6 h-6 text-accent animate-float" />
            <h2 className="text-2xl font-bold text-glow">Good Morning, Ankith</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Sleep Quality</p>
              <p className="text-2xl font-bold text-foreground">{dailyBriefing.sleepQuality}h / {dailyBriefing.sleepTarget}h <span className="text-sm text-orange-400">(below target)</span></p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pending Tasks</p>
              <p className="text-2xl font-bold text-foreground">{dailyBriefing.pendingTasks} tasks <span className="text-sm text-accent">Need attention</span></p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Peak Focus Time</p>
              <p className="text-2xl font-bold text-foreground">{dailyBriefing.focusHoursAvailable} <span className="text-sm text-green-400">Schedule here</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Life Score System - Central Retention Feature */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Life Score */}
        <div className="glass-panel-lg p-8 hover-glow lg:col-span-1">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">Daily Life Score</h3>
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-32 h-32 flex items-center justify-center mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(100, 150, 200, 0.2)" strokeWidth="6" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="6"
                  strokeDasharray={`${(lifeScores.overall / 100) * 283} 283`}
                  className="transition-all duration-1000"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgb(100, 200, 255)" />
                    <stop offset="100%" stopColor="rgb(168, 85, 247)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute text-center">
                <div className="text-4xl font-bold text-accent">{lifeScores.overall}</div>
                <div className="text-xs text-muted-foreground">/ 100</div>
              </div>
            </div>
            <p className="text-center text-muted-foreground text-sm">Your life optimization score today</p>
          </div>
        </div>

        {/* Breakdown Scores */}
        <div className="glass-panel-lg p-8 hover-glow lg:col-span-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">Score Breakdown</h3>
          <div className="space-y-5">
            {[
              { label: 'Mind', value: lifeScores.mind, icon: Brain, color: 'from-blue-400 to-cyan-400' },
              { label: 'Body', value: lifeScores.body, icon: Heart, color: 'from-green-400 to-emerald-400' },
              { label: 'Work', value: lifeScores.work, icon: Target, color: 'from-purple-400 to-pink-400' },
              { label: 'Discipline', value: lifeScores.discipline, icon: Flame, color: 'from-orange-400 to-red-400' },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-accent" />
                      <span className="font-medium text-foreground">{item.label}</span>
                    </div>
                    <span className="text-lg font-bold text-accent">{item.value}</span>
                  </div>
                  <div className="w-full h-2.5 bg-card/40 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${item.color}`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Streak & Loss Aversion Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Streak */}
        <div className="glass-panel p-8 border-l-4 border-l-orange-400 hover-glow">
          <div className="flex items-center gap-3 mb-4">
            <Flame className="w-6 h-6 text-orange-400 animate-pulse" />
            <h3 className="text-lg font-semibold text-foreground">Focus Streak</h3>
          </div>
          <div className="text-4xl font-bold text-orange-400 mb-2">{dailyBriefing.streak} days</div>
          <p className="text-sm text-muted-foreground mb-4">You&apos;re in the top 20% of consistency</p>
          <div className="w-full h-3 bg-card/40 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-400 to-red-400 animate-neon-pulse" style={{ width: '75%' }} />
          </div>
        </div>

        {/* Loss Aversion Warning */}
        <div className="glass-panel p-8 border-l-4 border-l-red-400 hover-glow">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-red-400" />
            <h3 className="text-lg font-semibold text-foreground">Warning</h3>
          </div>
          <div className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              <span className="text-red-400 font-semibold">You broke your morning workout streak!</span> Yesterday you skipped.
            </p>
            <p className="text-muted-foreground">
              <span className="text-orange-400 font-semibold">Performance dropped 12% today.</span> Less sleep = lower productivity.
            </p>
            <button className="mt-4 px-4 py-2 bg-accent/20 text-accent rounded-lg text-xs font-semibold hover:bg-accent/30 transition-all">
              View Recovery Plan
            </button>
          </div>
        </div>
      </div>

      {/* Daily Summary Grid */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Daily Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dailySummary.map((item) => (
            <div key={item.label} className="glass-panel p-6 hover-glow">
              <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {item.label}
              </h3>
              <Activity className="w-5 h-5 text-accent" />
            </div>
            <div className="space-y-3 mb-4">
              <div>
                <p className="text-2xl font-bold text-foreground">{item.completed}</p>
                <p className="text-xs text-muted-foreground">of {item.value}</p>
              </div>
            </div>
            <div className="w-full h-3 bg-card/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-500"
                style={{ width: `${(item.completed / item.value) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Productivity Trends & Identity Building */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productivity Trend */}
        <div className="glass-panel p-8 hover-glow">
          <h2 className="text-lg font-semibold text-foreground mb-6">Weekly Productivity</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={productivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 200, 255, 0.1)" />
              <XAxis dataKey="day" stroke="rgb(100, 150, 200)" />
              <YAxis stroke="rgb(100, 150, 200)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(100, 200, 255, 0.3)',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="rgb(100, 200, 255)"
                strokeWidth={3}
                dot={{ fill: 'rgb(100, 200, 255)', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Identity Building Stats */}
        <div className="glass-panel-lg p-8 hover-glow">
          <h2 className="text-lg font-semibold text-foreground mb-6">Your Performance Identity</h2>
          <div className="space-y-5">
            <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <p className="text-lg font-bold text-accent">
                You&apos;re in top 20% productivity this week 🏆
              </p>
            </div>
            <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Consistency</p>
              <p className="text-lg font-bold text-primary">
                Outperforming your weekly average by 12%
              </p>
            </div>
            <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Identity</p>
              <p className="text-lg font-bold text-green-400">
                You are a highly disciplined individual
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced AI Insights with Micro Interactions */}
      <div className="glass-panel-lg p-8 hover-glow">
        <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <Brain className="w-5 h-5 text-accent animate-float" />
          AI Performance Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aiInsights.map((insight) => (
            <div
              key={insight.id}
              className={`p-5 rounded-lg border transition-all hover:scale-105 hover:shadow-lg cursor-pointer transform ${
                insight.type === 'positive'
                  ? 'bg-green-500/10 border-green-500/30 hover:border-green-500/60'
                  : insight.type === 'warning'
                    ? 'bg-orange-500/10 border-orange-500/30 hover:border-orange-500/60'
                    : 'bg-blue-500/10 border-blue-500/30 hover:border-blue-500/60'
              }`}
            >
              <div className="text-3xl mb-2">{insight.icon}</div>
              <h3 className="font-semibold text-foreground text-sm mb-1">{insight.title}</h3>
              <p className="text-xs text-muted-foreground">{insight.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Integration & Task Lock-in */}
      <div className="glass-panel p-8 hover-glow">
        <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-accent" />
          Today&apos;s Schedule
        </h2>
        <div className="space-y-3">
          {upcomingEvents.map((event, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 bg-card/40 border border-border/30 rounded-lg hover:border-accent/50 hover:bg-card/60 transition-all transform hover:scale-102 cursor-pointer group"
            >
              <div>
                <p className="font-semibold text-foreground text-sm group-hover:text-accent transition-colors">{event.title}</p>
                <p className="text-xs text-muted-foreground">{event.time}</p>
              </div>
              <span className="text-xs font-medium text-accent uppercase px-3 py-1 bg-accent/20 rounded-full">{event.type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Voice Assistant Hook */}
      <div className="glass-panel-lg p-8 border-l-4 border-l-accent hover-glow">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              AI Assistant Message
            </h3>
            <p className="text-muted-foreground italic">
              &quot;You&apos;re improving steadily. Keep the momentum. Your focus score is up 7% from last week. Keep going.&quot;
            </p>
          </div>
          <button className="px-4 py-2 bg-accent/20 text-accent rounded-lg text-sm font-semibold hover:bg-accent/30 transition-all hover:scale-105 whitespace-nowrap">
            Talk to MIKE
          </button>
        </div>
      </div>
    </div>
  );
}
