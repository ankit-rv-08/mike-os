'use client';

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Flame, Droplet, Moon, Utensils, Dumbbell, Heart, TrendingUp, Check, X } from 'lucide-react';
import { useState } from 'react';

// Body metrics data
const bodyMetrics = [
  { label: 'Weight', current: 72.5, target: 70, unit: 'kg', status: 'On track' },
  { label: 'Body Fat %', current: 16.2, target: 14, unit: '%', status: 'Needs attention' },
  { label: 'Muscle Mass', current: 58.3, target: 60, unit: 'kg', status: 'On track' },
];

// Daily goals data
const dailyGoals = [
  { label: 'Water Intake', current: 1.8, target: 2.5, unit: 'L', icon: Droplet, color: 'from-blue-400 to-cyan-400' },
  { label: 'Sleep', current: 7.3, target: 8, unit: 'h', icon: Moon, color: 'from-purple-400 to-pink-400' },
  { label: 'Calories', current: 1840, target: 2200, unit: 'kcal', icon: Utensils, color: 'from-orange-400 to-red-400' },
];

// Daily habits
const dailyHabits = [
  { name: 'Morning Workout', completed: true },
  { name: 'Meditate', completed: true },
  { name: 'Reading', completed: false },
  { name: 'No Junk Food', completed: true },
  { name: 'Cold Shower', completed: false },
  { name: 'Journal', completed: true },
  { name: 'Water Goal', completed: true },
];

// Weekly progress data
const weeklyData = [
  { day: 'Mon', water: 2.2, sleep: 7.5, calories: 2100, active: 45, steps: 8200 },
  { day: 'Tue', water: 2.0, sleep: 7.2, calories: 1950, active: 50, steps: 9100 },
  { day: 'Wed', water: 2.5, sleep: 8.1, calories: 2050, active: 55, steps: 9800 },
  { day: 'Thu', water: 1.9, sleep: 7.0, calories: 2200, active: 40, steps: 7500 },
  { day: 'Fri', water: 2.3, sleep: 7.8, calories: 2150, active: 60, steps: 10200 },
  { day: 'Sat', water: 2.4, sleep: 9.0, calories: 2300, active: 65, steps: 11000 },
  { day: 'Sun', water: 2.1, sleep: 8.5, calories: 2100, active: 50, steps: 8900 },
];

// Gym progress data
const gymProgress = [
  { lift: 'Bench Press', current: 85, best: 100, unit: 'kg', progress: 85 },
  { lift: 'Squat', current: 120, best: 140, unit: 'kg', progress: 86 },
  { lift: 'Deadlift', current: 160, best: 180, unit: 'kg', progress: 89 },
];

// Looksmaxxing profile
const aestheticMetrics = [
  { metric: 'Jawline Definition', score: 7.2, level: 'Sharp' },
  { metric: 'Skin Quality', score: 7.8, level: 'Clear' },
  { metric: 'Eye Sharpness', score: 7.5, level: 'Alert' },
  { metric: 'Neck Thickness', score: 7.0, level: 'Good' },
];

const overallAttractiveness = 7.4;

// Productivity data (from old performance page)
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
  const [selectedWeek] = useState(14);
  const completedHabits = dailyHabits.filter(h => h.completed).length;
  const habitsTotal = dailyHabits.length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-glow mb-2">Performance</h1>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-lg">Health & Self Optimization</p>
          <div className="glass-panel px-4 py-2 text-sm font-medium text-accent">Week {selectedWeek}</div>
        </div>
      </div>

      {/* Body Metrics Cards */}
      <div className="space-y-3 mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Body Composition</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bodyMetrics.map((metric, idx) => (
            <div key={idx} className="glass-panel p-6 hover-glow">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                <Heart className="w-4 h-4 text-accent" />
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">{metric.current}</span>
                  <span className="text-sm text-muted-foreground">{metric.unit}</span>
                </div>
                <p className="text-xs text-muted-foreground">Target: {metric.target}{metric.unit}</p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="h-2 flex-1 bg-card/40 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-accent to-primary"
                      style={{ width: `${(metric.current / metric.target) * 100}%` }}
                    />
                  </div>
                  <span className={`text-xs font-semibold ${metric.status === 'On track' ? 'text-green-400' : 'text-orange-400'}`}>
                    {metric.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Goals Progress Bars */}
      <div className="space-y-3 mb-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Daily Goals</h2>
        <div className="glass-panel-lg p-8 space-y-6">
          {dailyGoals.map((goal, idx) => {
            const Icon = goal.icon;
            const percentage = (goal.current / goal.target) * 100;
            return (
              <div key={idx}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-accent" />
                    <span className="font-medium text-foreground">{goal.label}</span>
                  </div>
                  <span className={`font-bold ${percentage >= 100 ? 'text-green-400' : 'text-muted-foreground'}`}>
                    {goal.current.toFixed(1)} / {goal.target} {goal.unit}
                  </span>
                </div>
                <div className="w-full h-3 bg-card/40 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${goal.color} transition-all duration-500`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{percentage.toFixed(0)}% complete</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Habits Checklist */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Today&apos;s Habits</h2>
        <div className="glass-panel-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {dailyHabits.map((habit, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-card/30 border border-border/20 hover:border-border/40 transition-colors">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  habit.completed ? 'bg-green-500/20 border-green-400' : 'border-border/40'
                }`}>
                  {habit.completed && <Check className="w-3 h-3 text-green-400" />}
                </div>
                <span className={habit.completed ? 'text-foreground line-through opacity-60' : 'text-foreground'}>
                  {habit.name}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-border/20">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-2xl font-bold text-accent">{completedHabits}/{habitsTotal}</span>
          </div>
        </div>
      </div>

      {/* Weekly Progress Analytics */}
      <div className="space-y-3 mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Weekly Progress</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel p-8 hover-glow">
            <h3 className="font-semibold text-foreground mb-6">Sleep & Hydration</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 200, 255, 0.1)" />
                <XAxis dataKey="day" stroke="rgb(100, 150, 200)" />
                <YAxis stroke="rgb(100, 150, 200)" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(100, 200, 255, 0.3)', borderRadius: '8px' }} />
                <Bar dataKey="sleep" fill="rgb(168, 85, 247)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="water" fill="rgb(34, 211, 238)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-panel p-8 hover-glow">
            <h3 className="font-semibold text-foreground mb-6">Activity & Calories</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 200, 255, 0.1)" />
                <XAxis dataKey="day" stroke="rgb(100, 150, 200)" />
                <YAxis stroke="rgb(100, 150, 200)" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(100, 200, 255, 0.3)', borderRadius: '8px' }} />
                <Bar dataKey="active" fill="rgb(100, 200, 255)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Gym Progress Tracker */}
      <div className="space-y-3 mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Gym Progress</h2>
        <div className="glass-panel-lg p-8 space-y-6">
          {gymProgress.map((lift, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-accent" />
                  <span className="font-medium text-foreground">{lift.lift}</span>
                </div>
                <span className="text-sm font-bold text-accent">{lift.current}/{lift.best} {lift.unit}</span>
              </div>
              <div className="w-full h-3 bg-card/40 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-accent to-primary animate-neon-pulse"
                  style={{ width: `${lift.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Aesthetic Optimization (Looksmaxxing) */}
      <div className="space-y-3 mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Aesthetic Optimization</h2>
        <div className="glass-panel-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="space-y-4">
                {aestheticMetrics.map((item, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-foreground">{item.metric}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-accent">{item.score}</span>
                        <span className="text-xs text-muted-foreground">{item.level}</span>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-card/40 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-accent to-primary"
                        style={{ width: `${(item.score / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-accent/30 animate-spin" style={{ animationDuration: '3s' }} />
                <div className="text-center">
                  <div className="text-5xl font-bold text-glow mb-2">{overallAttractiveness}</div>
                  <p className="text-sm text-muted-foreground">Overall Score</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-6 text-center">Optimization score based on key aesthetic metrics</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insight Card */}
      <div className="glass-panel-lg p-8 border-l-4 border-l-accent mt-8">
        <div className="flex items-start gap-4">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse mt-2" />
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              AI Performance Insight
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>✓ You are on track with hydration but need better sleep consistency. Aim for 8+ hours daily.</p>
              <p>✓ Gym performance is improving. Maintain current strength progression and add 2-3kg weekly.</p>
              <p>⚠ Body fat needs attention. Increase daily steps and maintain calorie deficit of 300-400kcal.</p>
              <p>→ Aesthetic metrics are strong. Focus on maintaining jaw definition through consistent fitness.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Productivity & Focus Metrics */}
      <div className="space-y-3 mt-12">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Productivity Metrics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Productivity Score */}
          <div className="glass-panel p-8 hover-glow">
            <h3 className="font-semibold text-foreground mb-6">Weekly Productivity Score</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={productivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 200, 255, 0.1)" />
                <XAxis dataKey="day" stroke="rgb(100, 150, 200)" />
                <YAxis stroke="rgb(100, 150, 200)" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(100, 200, 255, 0.3)', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="score" stroke="rgb(100, 200, 255)" strokeWidth={3} dot={{ fill: 'rgb(100, 200, 255)', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Focus Hours */}
          <div className="glass-panel p-8 hover-glow">
            <h3 className="font-semibold text-foreground mb-6">Daily Focus Hours</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={hoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 200, 255, 0.1)" />
                <XAxis dataKey="day" stroke="rgb(100, 150, 200)" />
                <YAxis stroke="rgb(100, 150, 200)" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(100, 200, 255, 0.3)', borderRadius: '8px' }} />
                <Bar dataKey="focused" stackId="a" fill="rgb(100, 200, 255)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="regular" stackId="a" fill="rgb(147, 112, 219)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Active Streaks */}
      <div className="glass-panel-lg p-8 hover-glow mt-8">
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
                    <div className="h-full bg-gradient-to-r from-accent to-primary animate-neon-pulse" style={{ width: `${Math.min((streak.current / streak.best) * 100, 100)}%` }} />
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
      <div className="glass-panel-lg p-8 hover-glow mt-8">
        <h2 className="text-xl font-semibold text-foreground mb-6">Activity Heatmap</h2>
        <div className="space-y-6">
          {['Morning', 'Afternoon', 'Evening'].map((period) => (
            <div key={period}>
              <p className="text-sm font-medium text-muted-foreground mb-3">{period}</p>
              <div className="flex gap-1 flex-wrap">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-lg border border-border/30 cursor-pointer hover:neon-glow transition-all duration-300"
                    style={{ backgroundColor: `rgba(100, 200, 255, ${Math.random() * 0.6 + 0.1})` }}
                    title={`${i}: ${Math.floor(Math.random() * 5)} activities`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-6">Each cell represents 1 hour | Color intensity = activity level</p>
      </div>
    </div>
  );
}
