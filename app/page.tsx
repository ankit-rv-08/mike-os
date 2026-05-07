'use client';

import { Calendar, AlertCircle, TrendingUp, Zap, Activity, Flame, Heart, Brain, Target, CheckCircle2, Lock, Loader2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useEffect, useState } from 'react';

// Default sample data (shown when backend is offline)
const defaultBriefing = { sleepQuality: 6.8, sleepTarget: 8, pendingTasks: 5, focusHoursAvailable: '9–11 AM', missedYesterday: 2, streak: 6 };
const defaultLifeScores = { overall: 74, mind: 80, body: 65, work: 78, discipline: 72 };
const defaultEvents = [
  { time: '10:30 AM', title: 'Team Standup', type: 'meeting' },
  { time: '2:00 PM', title: 'Project Review', type: 'meeting' },
  { time: '4:30 PM', title: 'Client Call', type: 'meeting' },
];

export default function Dashboard() {
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8787';
  const [completedToday, setCompletedToday] = useState(8);
  const [totalTasks, setTotalTasks] = useState(12);
  const [liveBriefing, setLiveBriefing] = useState<any>(defaultBriefing);
  const [liveLifeScores, setLiveLifeScores] = useState(defaultLifeScores);
  const [liveEvents, setLiveEvents] = useState(defaultEvents);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(true);
  const completionPercentage = Math.round((completedToday / Math.max(1, totalTasks)) * 100);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [tasksRes, briefingRes, perfRes, calendarRes] = await Promise.all([
          fetch(`${API_BASE}/api/tasks`),
          fetch(`${API_BASE}/api/briefing`),
          fetch(`${API_BASE}/api/performance`),
          fetch(`${API_BASE}/api/calendar`),
        ]);

        const tasks = (await tasksRes.json())?.data?.tasks || [];
        const done = tasks.filter((t: any) => t.status === 'completed').length;
        if (tasks.length > 0) {
          setTotalTasks(tasks.length);
          setCompletedToday(done);
          setIsLive(true);
        }

        const briefing = (await briefingRes.json())?.data?.briefing;
        if (briefing) { setLiveBriefing(briefing); setIsLive(true); }

        const life = (await perfRes.json())?.data?.lifeScore;
        if (life) { setLiveLifeScores(life); setIsLive(true); }

        const calendarDays = (await calendarRes.json())?.data?.days || [];
        const flattened = calendarDays.flatMap((d: any) => d.events || []).slice(0, 3);
        if (flattened.length) {
          setLiveEvents(flattened.map((ev: any) => ({
            time: new Date(ev.start_time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
            title: ev.title,
            type: ev.event_type || 'meeting',
          })));
          setIsLive(true);
        }
      } catch {
        // Use sample data
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, [API_BASE]);

  const lifeScoringBreakdown = [
    { name: 'Mind', value: liveLifeScores.mind, color: 'rgb(100, 200, 255)' },
    { name: 'Body', value: liveLifeScores.body, color: 'rgb(34, 197, 94)' },
    { name: 'Work', value: liveLifeScores.work, color: 'rgb(168, 85, 247)' },
    { name: 'Discipline', value: liveLifeScores.discipline, color: 'rgb(251, 146, 60)' },
  ];

  const productivityData = [
    { day: 'Mon', score: 78 }, { day: 'Tue', score: 85 }, { day: 'Wed', score: 72 },
    { day: 'Thu', score: 88 }, { day: 'Fri', score: 92 }, { day: 'Sat', score: 65 }, { day: 'Sun', score: 55 },
  ];

  const aiInsights = [
    { id: 1, icon: '⚡', title: 'Peak productivity', desc: 'Friday 10-11 AM is your most productive hour', type: 'positive' },
    { id: 2, icon: '📅', title: 'Meeting reminder', desc: '3 meetings scheduled for tomorrow', type: 'info' },
    { id: 3, icon: '🎯', title: 'Goal progress', desc: 'On track for weekly targets', type: 'positive' },
    { id: 4, icon: '⚠️', title: 'Sleep impact', desc: 'Your sleep affects productivity by 23%', type: 'warning' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Live/Offline indicator */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-glow mb-1">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            {isLive ? '🟢 Live data from MIKE OS' : '🟡 Showing sample data - start logging to see real stats'}
          </p>
        </div>
      </div>

      {/* Daily AI Briefing Header */}
      <div className="glass-panel-lg p-8 border border-accent/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold">MIKE Morning Briefing</h2>
            {!isLive && <span className="text-xs text-yellow-400 ml-2">(Sample)</span>}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <MoonIcon />
              <p className="text-2xl font-bold">{liveBriefing?.sleepQuality || '--'}<span className="text-sm text-muted-foreground">/{liveBriefing?.sleepTarget || '--'}h</span></p>
              <p className="text-xs text-muted-foreground">Sleep Quality</p>
            </div>
            <div className="text-center">
              <TargetIcon />
              <p className="text-2xl font-bold">{liveBriefing?.pendingTasks || '--'}</p>
              <p className="text-xs text-muted-foreground">Pending Tasks</p>
            </div>
            <div className="text-center">
              <ZapIcon />
              <p className="text-2xl font-bold">{liveBriefing?.focusHoursAvailable || '--'}</p>
              <p className="text-xs text-muted-foreground">Focus Window</p>
            </div>
            <div className="text-center">
              <FlameIcon />
              <p className="text-2xl font-bold">{liveBriefing?.streak || '--'}</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Life Score + Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6">
          <h3 className="text-lg font-semibold mb-4">Life Score</h3>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-accent">{liveLifeScores.overall}</div>
              <p className="text-xs text-muted-foreground mt-1">Overall</p>
            </div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={lifeScoringBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                    {lifeScoringBreakdown.map((_, i) => <Cell key={i} fill={lifeScoringBreakdown[i].color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold mb-4">Today's Tasks</h3>
          <div className="text-center mb-4">
            <p className="text-4xl font-bold text-accent">{completedToday}/{totalTasks}</p>
            <p className="text-sm text-muted-foreground">{completionPercentage}% Complete</p>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div className="bg-accent h-2 rounded-full transition-all" style={{ width: `${completionPercentage}%` }} />
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="glass-panel p-6">
        <h3 className="text-lg font-semibold mb-4">Upcoming</h3>
        <div className="space-y-3">
          {liveEvents.map((ev, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-card/30">
              <Calendar className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium w-20">{ev.time}</span>
              <span className="text-sm">{ev.title}</span>
              <span className="text-xs text-muted-foreground ml-auto">{ev.type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {aiInsights.map((insight) => (
          <div key={insight.id} className="glass-panel p-4 flex items-start gap-3">
            <span className="text-xl">{insight.icon}</span>
            <div>
              <p className="font-medium text-sm">{insight.title}</p>
              <p className="text-xs text-muted-foreground">{insight.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Simple icon components
function MoonIcon() { return <span className="text-2xl">🌙</span>; }
function TargetIcon() { return <span className="text-2xl">🎯</span>; }
function ZapIcon() { return <span className="text-2xl">⚡</span>; }
function FlameIcon() { return <span className="text-2xl">🔥</span>; }
