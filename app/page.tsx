'use client';

import { Calendar, AlertCircle, TrendingUp, Zap, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

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
  { id: 1, icon: '⚡', title: 'Peak productivity', desc: 'Friday 10-11 AM is your most productive hour' },
  { id: 2, icon: '📅', title: 'Meeting reminder', desc: '3 meetings scheduled for tomorrow' },
  { id: 3, icon: '🎯', title: 'Goal progress', desc: 'On track for weekly targets' },
];

const upcomingEvents = [
  { time: '10:30 AM', title: 'Team Standup', type: 'meeting' },
  { time: '2:00 PM', title: 'Project Review', type: 'meeting' },
  { time: '4:30 PM', title: 'Client Call', type: 'meeting' },
];

export default function Dashboard() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Title */}
      <div>
        <h1 className="text-4xl font-bold text-glow mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back. Here&apos;s your daily overview.</p>
      </div>

      {/* Daily Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dailySummary.map((item) => (
          <div key={item.label} className="glass-panel p-6 hover-glow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {item.label}
              </h3>
              <Zap className="w-4 h-4 text-accent" />
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-3xl font-bold text-foreground">{item.completed}</div>
                <p className="text-xs text-muted-foreground">of {item.value} completed</p>
              </div>
              <div className="w-full h-1.5 bg-card/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent to-primary"
                  style={{ width: `${(item.completed / item.value) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Insights Panel */}
      <div className="glass-panel-lg p-8 hover-glow">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-accent" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">AI Insights</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiInsights.map((insight) => (
            <div key={insight.id} className="bg-card/30 border border-border/20 rounded-lg p-4">
              <div className="text-2xl mb-2">{insight.icon}</div>
              <h4 className="font-medium text-foreground mb-1">{insight.title}</h4>
              <p className="text-xs text-muted-foreground">{insight.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Productivity & Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Productivity Chart */}
        <div className="lg:col-span-2 glass-panel p-8 hover-glow">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-semibold text-foreground">Weekly Productivity</h2>
          </div>
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
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Calendar Preview */}
        <div className="glass-panel p-8 hover-glow flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-5 h-5 text-accent" />
            <h2 className="text-xl font-semibold text-foreground">Today</h2>
          </div>

          <div className="space-y-3 flex-1">
            {upcomingEvents.map((event, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="text-xs text-accent font-mono w-16 flex-shrink-0">
                  {event.time}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.type}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-4 w-full py-2 px-4 rounded-lg bg-accent/20 text-accent border border-accent/50 hover:bg-accent/30 transition-colors duration-200 text-sm font-medium">
            View Full Calendar
          </button>
        </div>
      </div>

      {/* Market Snapshot */}
      <div className="glass-panel p-8 hover-glow">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-5 h-5 text-accent" />
          <h2 className="text-xl font-semibold text-foreground">Market Snapshot</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'S&P 500', value: '5,847.23', change: '+1.2%' },
            { label: 'NASDAQ', value: '18,239.04', change: '+1.8%' },
            { label: 'BTC/USD', value: '48,932', change: '+3.2%' },
            { label: 'ETH/USD', value: '3,248', change: '+2.1%' },
          ].map((market) => (
            <div key={market.label} className="bg-card/30 border border-border/20 rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-2">{market.label}</p>
              <p className="text-lg font-bold text-foreground">{market.value}</p>
              <p className="text-xs text-green-400 mt-1">{market.change}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      <div className="glass-panel p-8 border-yellow-500/30 hover-glow">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-foreground mb-2">Active Alerts</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Email backlog: 24 unread messages</li>
              <li>• Team task: Review PR #1234</li>
              <li>• Calendar: Meeting starts in 45 minutes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
