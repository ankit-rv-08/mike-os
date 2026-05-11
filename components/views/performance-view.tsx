'use client'

import { useState, useEffect } from 'react'
import { Activity, Target, Grid, Clock, Plus, Zap, Coffee, Moon, TrendingUp, CheckCircle2, Edit2 } from 'lucide-react'

// --- Interfaces ---
interface PerfLog { id: string; date: string; category: string; hours: number }
interface Habit { id: string; task: string; cat: string; done: boolean }
interface Vitals { water: number; calories: number; steps: number; weight: number; bodyFat: number; muscleMass: number; restingHR: number }
interface PerfData { logs: PerfLog[]; vitals: Vitals; habits: Habit[] }

const CAT_COLORS: Record<string, string> = {
  'Deep Work': '#06b6d4', 'Learning': '#34d399', 'Meetings': '#facc15',
  'Admin': '#94a3b8', 'Gym': '#ef4444', 'Sleep': '#8b5cf6', 'Chilling': '#f59e0b'
}

const DEFAULT_VITALS: Vitals = { water: 2.1, calories: 1840, steps: 8420, weight: 73, bodyFat: 12, muscleMass: 61, restingHR: 58 }
const DEFAULT_HABITS: Habit[] = [
  { id: 'h1', task: 'Morning meditation (10 min)', cat: 'Mindset', done: false },
  { id: 'h2', task: 'Cold shower', cat: 'Physique', done: false },
  { id: 'h3', task: 'Workout (45 min)', cat: 'Physique', done: false },
  { id: 'h4', task: 'Read (30 min)', cat: 'Growth', done: false },
  { id: 'h5', task: 'No social media before 10am', cat: 'Focus', done: false },
  { id: 'h6', task: 'Journal entry', cat: 'Mindset', done: false },
]

export function PerformanceView() {
  const [data, setData] = useState<PerfData>({ logs: [], vitals: DEFAULT_VITALS, habits: DEFAULT_HABITS })
  const [isAdding, setIsAdding] = useState(false)
  const [newCategory, setNewCategory] = useState('Deep Work')
  const [newHours, setNewHours] = useState('')

  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8787'

  const fetchPerf = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/performance`)
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const json = await res.json()
        setData({
          logs: json.logs || [],
          vitals: { ...DEFAULT_VITALS, ...json.vitals },
          habits: json.habits && json.habits.length > 0 ? json.habits : DEFAULT_HABITS
        })
      }
    } catch (e) { console.error(e) }
  }

  const savePerf = async (newData: PerfData) => {
    setData(newData)
    try {
      await fetch(`${API_BASE}/api/performance`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newData)
      })
    } catch (e) { console.error(e) }
  }

  useEffect(() => {
    fetchPerf()
    const int = setInterval(fetchPerf, 5000)
    return () => clearInterval(int)
  }, [])

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newHours) return
    const newLog: PerfLog = { id: Date.now().toString(), date: new Date().toISOString().split('T')[0], category: newCategory, hours: parseFloat(newHours) }
    savePerf({ ...data, logs: [...data.logs, newLog] })
    setNewHours(''); setIsAdding(false)
  }

  const toggleHabit = (id: string) => {
    const updatedHabits = data.habits.map(h => h.id === id ? { ...h, done: !h.done } : h)
    savePerf({ ...data, habits: updatedHabits })
  }

  const editVital = (metric: keyof Vitals, currentVal: number, promptText: string) => {
    const input = window.prompt(promptText, currentVal.toString())
    if (input && !isNaN(parseFloat(input))) {
      savePerf({ ...data, vitals: { ...data.vitals, [metric]: parseFloat(input) } })
    }
  }

  const todayStr = new Date().toISOString().split('T')[0]
  const todayLogs = data.logs.filter(l => l.date === todayStr)
  const todayWork = todayLogs.filter(l => !['Sleep', 'Chilling'].includes(l.category)).reduce((s, l) => s + l.hours, 0)
  const todayChill = todayLogs.filter(l => l.category === 'Chilling').reduce((s, l) => s + l.hours, 0)
  const todaySleep = todayLogs.filter(l => l.category === 'Sleep').reduce((s, l) => s + l.hours, 0) || data.vitals.sleep || 0
  const prodHours = todayLogs.filter(l => ['Deep Work', 'Learning'].includes(l.category)).reduce((s, l) => s + l.hours, 0)
  const prodScore = todayWork > 0 ? Math.round((prodHours / todayWork) * 100) : 0

  const getHeatmap = () => {
    return Array.from({ length: 18 }, (_, week) =>
      Array.from({ length: 7 }, (_, day) => {
        const d = new Date(); d.setDate(d.getDate() - ( (17 - week) * 7 + (6 - day) ))
        const dStr = d.toISOString().split('T')[0]
        const h = data.logs.filter(l => l.date === dStr).reduce((acc, l) => acc + l.hours, 0)
        return { intensity: Math.min(h / 8, 1) }
      })
    )
  }

  const weeklyData = [...Array(7)].map((_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i))
    const dStr = d.toISOString().split('T')[0]
    const val = data.logs.filter(l => l.date === dStr && l.category !== 'Sleep').reduce((s, l) => s + l.hours, 0)
    return { label: d.toLocaleDateString('en-US', { weekday: 'short' }), value: val }
  })
  const maxH = Math.max(...weeklyData.map(d => d.value), 5)

  const catTotals = data.logs.reduce((acc, l) => {
    acc[l.category] = (acc[l.category] || 0) + l.hours
    return acc
  }, {} as Record<string, number>)
  const categoryList = Object.entries(catTotals).map(([label, hours]) => ({ label, hours, color: CAT_COLORS[label] || '#94a3b8' })).sort((a,b) => b.hours - a.hours)
  const habitsDoneCount = data.habits.filter(h => h.done).length

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto pr-2 custom-scrollbar animate-in fade-in duration-300">
      
      {/* ─── NEW: OS MODULE PAGE HEADER ─── */}
      <div className="flex justify-between items-end border-b border-white/5 pb-4 shrink-0 transition-colors duration-500">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Activity size={22} className="text-[var(--accent-color)] transition-colors duration-500" />
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Vitals Matrix</h2>
          </div>
          <p className="text-[10px] opacity-50 font-bold tracking-widest uppercase ml-9">Biometric & Performance Sync</p>
        </div>
        <div className="flex gap-3">
           <span className="px-3 py-1 bg-[var(--accent-color-transparent)] text-[var(--accent-color)] border border-[var(--accent-color)] rounded text-[9px] font-black uppercase tracking-widest transition-colors duration-500">
             Sensors Active
           </span>
        </div>
      </div>
      {/* ───────────────────────────────── */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-5 rounded-xl shadow-lg border-t-2 border-t-purple-500 group transition-colors duration-500">
          <div className="flex justify-between items-start mb-2">
            <span className="text-2xl font-bold text-purple-400">{todaySleep || 7.2} <span className="text-xs">/ 9 hrs</span></span>
            <Moon size={18} className="opacity-40" />
          </div>
          <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-purple-400" style={{ width: `${Math.min(((todaySleep || 7.2)/9)*100, 100)}%` }} />
          </div>
          <div className="text-[10px] opacity-60 font-bold uppercase tracking-widest flex justify-between items-center">
            <span>Sleep</span>
            <button onClick={() => setIsAdding(true)} className="opacity-0 group-hover:opacity-100 text-purple-400 transition-opacity"><Plus size={12}/></button>
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-5 rounded-xl shadow-lg border-t-2 border-t-blue-500 group relative transition-colors duration-500">
          <div className="flex justify-between items-start mb-2">
            <span className="text-2xl font-bold text-blue-400">{data.vitals.water} <span className="text-xs">/ 4 L</span></span>
            <Zap size={18} className="opacity-40" />
          </div>
          <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-blue-400" style={{ width: `${Math.min((data.vitals.water/4)*100, 100)}%` }} />
          </div>
          <div className="text-[10px] opacity-60 font-bold uppercase tracking-widest flex justify-between items-center">
            <span>Water Intake</span> 
            <button onClick={() => editVital('water', data.vitals.water, "Update Water (Liters):")} className="opacity-0 group-hover:opacity-100 text-blue-400 transition-opacity"><Edit2 size={12}/></button>
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-5 rounded-xl shadow-lg border-t-2 border-t-orange-500 group transition-colors duration-500">
          <div className="flex justify-between items-start mb-2">
            <span className="text-2xl font-bold text-orange-400">{data.vitals.calories} <span className="text-xs">/ 2500 kcal</span></span>
            <Activity size={18} className="opacity-40" />
          </div>
          <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-orange-400" style={{ width: `${Math.min((data.vitals.calories/2500)*100, 100)}%` }} />
          </div>
          <div className="text-[10px] opacity-60 font-bold uppercase tracking-widest flex justify-between items-center">
            <span>Calories</span> 
            <button onClick={() => editVital('calories', data.vitals.calories, "Update Calories:")} className="opacity-0 group-hover:opacity-100 text-orange-400 transition-opacity"><Edit2 size={12}/></button>
          </div>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] p-5 rounded-xl shadow-lg border-t-2 border-t-emerald-500 group transition-colors duration-500">
           <div className="flex justify-between items-start mb-2">
            <span className="text-2xl font-bold text-emerald-400">{data.vitals.steps} <span className="text-xs">steps</span></span>
            <TrendingUp size={18} className="opacity-40" />
          </div>
          <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-emerald-400" style={{ width: `${Math.min((data.vitals.steps/10000)*100, 100)}%` }} />
          </div>
          <div className="text-[10px] opacity-60 font-bold uppercase tracking-widest flex justify-between items-center">
            <span>Movement</span> 
            <button onClick={() => editVital('steps', data.vitals.steps, "Update Steps:")} className="opacity-0 group-hover:opacity-100 text-emerald-400 transition-opacity"><Edit2 size={12}/></button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6 shadow-xl transition-colors duration-500">
           <h3 className="text-xs font-bold opacity-60 uppercase tracking-widest mb-4 flex items-center gap-2"><Target size={14} className="text-[var(--accent-color)]"/> Physique Stats</h3>
           <div className="grid grid-cols-2 gap-4">
             <div className="bg-black/20 p-4 rounded-lg border border-white/5 group relative">
               <div className="text-[10px] opacity-60 uppercase mb-1">Weight</div>
               <div className="text-xl font-bold text-white mb-1">{data.vitals.weight} <span className="text-xs font-normal opacity-50">kg</span></div>
               <button onClick={() => editVital('weight', data.vitals.weight, "Update Weight (kg):")} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"><Edit2 size={12}/></button>
             </div>
             <div className="bg-black/20 p-4 rounded-lg border border-white/5 group relative">
               <div className="text-[10px] opacity-60 uppercase mb-1">Body Fat</div>
               <div className="text-xl font-bold text-white mb-1">{data.vitals.bodyFat} <span className="text-xs font-normal opacity-50">%</span></div>
               <button onClick={() => editVital('bodyFat', data.vitals.bodyFat, "Update Body Fat %:")} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"><Edit2 size={12}/></button>
             </div>
             <div className="bg-black/20 p-4 rounded-lg border border-white/5 group relative">
               <div className="text-[10px] opacity-60 uppercase mb-1">Muscle Mass</div>
               <div className="text-xl font-bold text-white mb-1">{data.vitals.muscleMass} <span className="text-xs font-normal opacity-50">kg</span></div>
               <button onClick={() => editVital('muscleMass', data.vitals.muscleMass, "Update Muscle Mass (kg):")} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"><Edit2 size={12}/></button>
             </div>
             <div className="bg-black/20 p-4 rounded-lg border border-white/5 group relative">
               <div className="text-[10px] opacity-60 uppercase mb-1">Resting HR</div>
               <div className="text-xl font-bold text-white mb-1">{data.vitals.restingHR} <span className="text-xs font-normal opacity-50">bpm</span></div>
               <button onClick={() => editVital('restingHR', data.vitals.restingHR, "Update Resting HR:")} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"><Edit2 size={12}/></button>
             </div>
           </div>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6 shadow-xl transition-colors duration-500">
           <div className="flex justify-between items-center mb-4">
             <h3 className="text-xs font-bold opacity-60 uppercase tracking-widest flex items-center gap-2"><CheckCircle2 size={14} className="text-[var(--accent-color)]"/> Daily Habits</h3>
             <span className="text-[10px] bg-black/30 border border-white/5 px-2 py-1 rounded font-bold">{habitsDoneCount}/{data.habits.length} Completed</span>
           </div>
           <div className="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-2">
             {data.habits.map((h) => (
               <div key={h.id} onClick={() => toggleHabit(h.id)} className="flex items-center gap-3 p-2 hover:bg-black/20 rounded-lg transition-colors border border-transparent hover:border-white/5 cursor-pointer">
                 <div className={`w-4 h-4 rounded flex items-center justify-center border transition-colors duration-300 ${h.done ? 'bg-[var(--accent-color-transparent)] border-[var(--accent-color)] text-[var(--accent-color)]' : 'border-white/20'}`}>
                   {h.done && <CheckCircle2 size={12} />}
                 </div>
                 <div className="flex-1 flex justify-between items-center">
                   <span className={`text-sm transition-all ${h.done ? 'opacity-40 line-through' : 'text-white'}`}>{h.task}</span>
                   <span className="text-[9px] opacity-50 uppercase tracking-widest">{h.cat}</span>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 flex-1">
        <div className="col-span-2 flex flex-col gap-6">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6 shadow-xl relative overflow-hidden transition-colors duration-500">
             <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-bold opacity-80 flex items-center gap-2 uppercase tracking-tighter"><TrendingUp size={16} className="text-[var(--accent-color)]"/> Execution Flow</h3>
              <button onClick={() => setIsAdding(!isAdding)} className="bg-[var(--accent-color-transparent)] border border-[var(--accent-color)] text-[var(--accent-color)] px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-[var(--accent-color)] hover:text-black transition-all">Log Data</button>
            </div>
            {isAdding && (
              <form onSubmit={handleAddLog} className="flex gap-2 mb-8 bg-black/40 p-3 rounded-xl border border-[var(--border-color)] animate-in zoom-in-95">
                <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="bg-transparent text-xs text-white focus:outline-none flex-1">
                  {Object.keys(CAT_COLORS).map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
                </select>
                <input type="number" step="0.5" placeholder="Hours" value={newHours} onChange={e => setNewHours(e.target.value)} className="w-20 bg-transparent text-xs text-white focus:outline-none border-l border-white/10 pl-3" />
                <button type="submit" className="bg-[var(--accent-color)] text-black px-4 py-1.5 rounded-lg text-[10px] font-black uppercase">Execute</button>
              </form>
            )}
            <div className="flex items-end justify-between px-4 h-48 mb-2">
              {weeklyData.map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-3 group relative w-full">
                  <div className="w-12 bg-black/30 rounded-t-lg relative flex items-end justify-center h-40 border border-white/5">
                    <div className="w-full transition-all duration-1000 bg-[var(--accent-color)] opacity-80 rounded-t-sm" style={{ height: `${(d.value / maxH) * 100}%`, boxShadow: '0 0 10px var(--glow)' }} />
                    <div className="absolute -top-6 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-[var(--accent-color)]">{d.value}h</div>
                  </div>
                  <span className="text-[10px] font-bold opacity-50 uppercase">{d.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6 shadow-lg transition-colors duration-500">
            <h3 className="text-sm font-bold opacity-80 flex items-center gap-2 mb-6 uppercase tracking-tighter"><Grid size={16} className="text-[var(--accent-color)]"/> Consistency Map</h3>
            <div className="flex gap-1.5 flex-wrap">
              {getHeatmap().map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1.5">
                  {week.map((cell, di) => (
                    <div key={di} className="w-3.5 h-3.5 rounded-sm transition-colors duration-500" style={{ backgroundColor: cell.intensity > 0 ? 'var(--accent-color)' : 'rgba(255,255,255,0.03)', opacity: cell.intensity > 0 ? 0.2 + cell.intensity * 0.8 : 1 }} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl p-6 shadow-xl flex flex-col items-center h-full transition-colors duration-500">
             <div className="relative w-40 h-40 flex items-center justify-center mb-6 mt-4">
                <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="12" />
                  <circle cx="60" cy="60" r="54" fill="none" stroke="var(--accent-color)" strokeWidth="12" strokeDasharray={`${2 * Math.PI * 54 * (prodScore / 100)} ${2 * Math.PI * 54}`} strokeLinecap="round" className="transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-white">{prodScore}%</span>
                  <span className="text-[8px] opacity-60 font-bold uppercase tracking-[0.2em]">Efficiency</span>
                </div>
             </div>
             <div className="w-full space-y-5 flex-1 mt-4">
                <div className="flex items-center gap-2 text-[10px] font-black opacity-60 uppercase tracking-widest border-b border-white/5 pb-2">Vitals Matrix</div>
                {categoryList.map((c, i) => (
                  <div key={i} className="group">
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="opacity-60 group-hover:opacity-100 transition-opacity">{c.label}</span>
                      <span style={{ color: c.color }}>{c.hours}h</span>
                    </div>
                    <div className="w-full h-1 bg-black/40 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${(c.hours / Math.max(1, categoryList[0].hours)) * 100}%`, backgroundColor: c.color }} />
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}