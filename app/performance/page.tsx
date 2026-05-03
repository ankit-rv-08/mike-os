'use client';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Flame, Clock, Target } from 'lucide-react';

const productivityData = [
  { day: 'Mon', score: 78 },
  { day: 'Tue', score: 85 },
  { day: 'Wed', score: 72 },
  { day: 'Thu', score: 88 },
  { day: 'Fri', score: 92 },
  { day: 'Sat', score: 65 },
  { day: 'Sun', score: 55 },
];

const hoursData = [
  { day: 'Mon', focused: 6, regular: 2 },
  { day: 'Tue', focused: 7, regular: 1.5 },
  { day: 'Wed', focused: 5, regular: 3 },
  { day: 'Thu', focused: 8, regular: 1 },
  { day: 'Fri', focused: 6.5, regular: 2.5 },
  { day: 'Sat', focused: 3, regular: 4 },
  { day: 'Sun', focused: 2, regular: 2 },
];

const streaks = [
  { name: 'Focus Streak', current: 8, best: 23, unit: 'days' },
  { name: 'Daily Workout', current: 12, best: 45, unit: 'days' },
  { name: 'Reading Streak', current: 5, best: 15, unit: 'days' },
];

export default function PerformancePage() {
  const avgProductivity = Math.round(productivityData.reduce((sum, d) => sum + d.score, 0) / productivityData.length);
  const totalHours = hoursData.reduce((sum, d) => sum + d.focused + d.regular, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-glow mb-2">Performance</h1>
        <p className="text-muted-foreground">Track your productivity and activity metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { icon: Activity, label: 'Avg Productivity', value: avgProductivity, unit: '%' },
          { icon: Clock, label: 'Total Focus Hours', value: totalHours.toFixed(1), unit: 'hrs' },
          { icon: Target, label: 'Weekly Target', value: 95, unit: '%' },
          { icon: Flame, label: 'Active Streak', current: 8, best: 23, unit: 'days' },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="glass-panel p-6 hover-glow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  {kpi.label}
                </h3>
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <p className="text-3xl font-bold text-foreground">
                {kpi.value}
                <span className="text-lg text-muted-foreground"> {kpi.unit}</span>
              </p>
              {'current' in kpi && (
                <p className="text-xs text-muted-foreground mt-2">
                  Current: {kpi.current} / Best: {kpi.best}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Productivity Score */}
        <div className="glass-panel p-8 hover-glow">
          <h2 className="text-xl font-semibold text-foreground mb-6">Weekly Productivity Score</h2>
          <ResponsiveContainer width="100%" height={300}>
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

        {/* Focus Hours */}
        <div className="glass-panel p-8 hover-glow">
          <h2 className="text-xl font-semibold text-foreground mb-6">Daily Focus Hours</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hoursData}>
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
              <Bar dataKey="focused" stackId="a" fill="rgb(100, 200, 255)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="regular" stackId="a" fill="rgb(147, 112, 219)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Streaks Section */}
      <div className="glass-panel-lg p-8 hover-glow">
        <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-400" />
          Active Streaks
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {streaks.map((streak, idx) => (
            <div key={idx} className="bg-card/30 border border-border/20 rounded-lg p-6">
              <h3 className="font-semibold text-foreground mb-4">{streak.name}</h3>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Current</span>
                    <span className="text-2xl font-bold text-accent">{streak.current}</span>
                  </div>
                  <div className="w-full h-3 bg-card/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent to-primary animate-neon-pulse"
                      style={{ width: `${Math.min((streak.current / streak.best) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-border/20">
                  <p className="text-xs text-muted-foreground mb-1">Personal Best</p>
                  <p className="text-lg font-bold text-foreground">{streak.best} {streak.unit}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Heatmap */}
      <div className="glass-panel-lg p-8 hover-glow">
        <h2 className="text-xl font-semibold text-foreground mb-6">Activity Heatmap</h2>

        <div className="space-y-6">
          {['Morning', 'Afternoon', 'Evening'].map((period) => (
            <div key={period}>
              <p className="text-sm font-medium text-muted-foreground mb-3">{period}</p>
              <div className="flex gap-1">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-lg border border-border/30 cursor-pointer hover:neon-glow transition-all duration-300"
                    style={{
                      backgroundColor: `rgba(100, 200, 255, ${Math.random() * 0.6 + 0.1})`,
                    }}
                    title={`${i}: ${Math.floor(Math.random() * 5)} activities`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-6">Each cell represents 1 hour | Color intensity = activity level</p>
      </div>

      {/* Recommendations */}
      <div className="glass-panel p-6">
        <h3 className="font-semibold text-foreground mb-4">Performance Insights</h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>✓ Friday is your most productive day - schedule important tasks then</p>
          <p>✓ Morning hours show highest focus - maintain this routine</p>
          <p>⚠ Weekend productivity drops - consider lighter schedules</p>
          <p>→ Try time-blocking technique to improve consistency</p>
        </div>
      </div>
    </div>
  );
}
