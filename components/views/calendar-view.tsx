'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CheckCircle2, Clock, Plus, Bell, Circle, XCircle } from 'lucide-react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

interface CalItem { id: string; title: string; status: 'pending' | 'completed' | 'missed' }
interface DayData { tasks: CalItem[]; meetings: CalItem[]; notes: string; progress: number }

export function CalendarView() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate())
  const [activeTab, setActiveTab] = useState<'tasks'|'meetings'|'notes'>('tasks')
  const [dayDataMap, setDayDataMap] = useState<Record<number, DayData>>({})
  
  // States for manual entry
  const [addingType, setAddingType] = useState<'tasks'|'meetings'|null>(null)
  const [addInput, setAddInput] = useState('')

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8787'

  
  // 1. Fetch Calendar from Backend (With Error Shield)
  const fetchCalendar = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/calendar`)
      const data = await res.json()
      
      // SHIELD: Only update state if it is ACTUAL calendar data, not an error object
      if (!data.error && !data.data) {
        setDayDataMap(data)
      }
    } catch (e) {
      console.error("Failed to fetch calendar data")
    }
  }
  // 2. Save Calendar to Backend
  const saveCalendar = async (newMap: Record<number, DayData>) => {
    setDayDataMap(newMap) // Optimistic UI update
    try {
      await fetch(`${API_BASE}/api/calendar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMap)
      })
    } catch (e) {
      console.error("Failed to save calendar data")
    }
  }

  useEffect(() => {
    fetchCalendar()
    const interval = setInterval(fetchCalendar, 5000) 
    return () => clearInterval(interval)
  }, [])

  // --- ACTIONS ---

  const calculateProgress = (dayData: DayData) => {
    const total = dayData.tasks.length + dayData.meetings.length
    if (total === 0) return 0
    const completed = [...dayData.tasks, ...dayData.meetings].filter(i => i.status === 'completed').length
    return Math.round((completed / total) * 100)
  }

  const toggleStatus = (type: 'tasks'|'meetings', itemId: string) => {
    if (!selectedDay) return
    const currentDayData = dayDataMap[selectedDay] || { tasks: [], meetings: [], notes: '', progress: 0 }
    
    // Cycle: pending -> completed -> missed -> pending
    const newItems = currentDayData[type].map(item => {
      if (item.id !== itemId) return item
      const nextStatus = item.status === 'pending' ? 'completed' : item.status === 'completed' ? 'missed' : 'pending'
      return { ...item, status: nextStatus as any }
    })

    const newDayData = { ...currentDayData, [type]: newItems }
    newDayData.progress = calculateProgress(newDayData)

    saveCalendar({ ...dayDataMap, [selectedDay]: newDayData })
  }

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDay || !addingType || !addInput.trim()) return

    const currentDayData = dayDataMap[selectedDay] || { tasks: [], meetings: [], notes: '', progress: 0 }
    const newItem: CalItem = { id: Date.now().toString(), title: addInput.trim(), status: 'pending' }
    
    const newDayData = { ...currentDayData, [addingType]: [...currentDayData[addingType], newItem] }
    newDayData.progress = calculateProgress(newDayData)

    saveCalendar({ ...dayDataMap, [selectedDay]: newDayData })
    setAddInput('')
    setAddingType(null)
  }

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }

  const selectedData = selectedDay ? dayDataMap[selectedDay] : null

  function getDayStatus(d: number) {
    const data = dayDataMap[d]
    if (!data || (data.tasks.length === 0 && data.meetings.length === 0)) return 'none'
    if (data.progress >= 80) return 'green'
    if (data.progress >= 50) return 'yellow'
    return 'red'
  }

  // --- DYNAMIC LIST RENDERER ---
  const renderList = (type: 'tasks' | 'meetings', items: CalItem[]) => {
    if (!items || items.length === 0) return <p className="text-sm text-slate-500 italic">No {type} scheduled.</p>
    
    return items.map((item) => {
      // Dynamic Theme Mapping
      let borderTheme = 'border-cyan-500' // Pending (Blue/Cyan)
      let textTheme = 'text-slate-200'
      let icon = <Circle size={18} className="text-cyan-400" />
      let bgTheme = 'bg-slate-950 hover:bg-slate-900'

      if (item.status === 'completed') {
        borderTheme = 'border-emerald-500' // Completed (Green)
        textTheme = 'text-slate-500 line-through'
        icon = <CheckCircle2 size={18} className="text-emerald-400" />
        bgTheme = 'bg-slate-950/50 hover:bg-slate-900/50 opacity-70'
      } else if (item.status === 'missed') {
        borderTheme = 'border-red-500' // Missed (Red)
        textTheme = 'text-slate-500 line-through'
        icon = <XCircle size={18} className="text-red-400" />
        bgTheme = 'bg-slate-950/50 hover:bg-slate-900/50'
      }

      return (
        <div 
          key={item.id} 
          onClick={() => toggleStatus(type, item.id)}
          className={`flex items-center gap-3 p-3 border-l-2 rounded cursor-pointer transition-all ${borderTheme} ${bgTheme}`}
        >
          <div className="shrink-0">{icon}</div>
          <span className={`text-sm ${textTheme}`}>{item.title}</span>
        </div>
      )
    })
  }

  return (
    <div className="flex gap-6 h-full animate-in fade-in duration-300">
      {/* Left: Monthly Grid */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button onClick={prevMonth} className="p-2 border border-slate-700 rounded hover:bg-slate-800 transition-all"><ChevronLeft size={18} /></button>
            <h2 className="text-xl font-bold text-cyan-400 w-40 text-center">{MONTHS[month]} {year}</h2>
            <button onClick={nextMonth} className="p-2 border border-slate-700 rounded hover:bg-slate-800 transition-all"><ChevronRight size={18} /></button>
          </div>
          <div className="flex gap-4 text-xs font-bold text-slate-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" /> ≥80% Done</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_#facc15]" /> ≥50%</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 shadow-[0_0_8px_#f87171]" /> &lt;50%</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2">
          {DAYS.map(d => <div key={d} className="text-center text-xs font-bold text-slate-500 py-2">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-2 flex-1">
          {[...Array(firstDay)].map((_, i) => <div key={`e-${i}`} className="rounded-lg bg-slate-950/30" />)}
          {[...Array(daysInMonth)].map((_, i) => {
            const d = i + 1; const status = getDayStatus(d); 
            const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear()
            const isSelected = d === selectedDay
            
            const statusColor = status === 'green' ? 'bg-emerald-400' : status === 'yellow' ? 'bg-yellow-400' : status === 'red' ? 'bg-red-400' : 'bg-transparent'
            const shadowColor = status === 'green' ? 'shadow-[0_0_8px_#34d399]' : status === 'yellow' ? 'shadow-[0_0_8px_#facc15]' : status === 'red' ? 'shadow-[0_0_8px_#f87171]' : ''

            return (
              <button key={d} onClick={() => {setSelectedDay(d); setAddingType(null)}} className={`relative flex flex-col items-center justify-center rounded-lg border transition-all ${isSelected ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.2)]' : isToday ? 'border-slate-500 bg-slate-800' : 'border-slate-800/50 bg-slate-900 hover:border-slate-600'}`}>
                <span className={`text-lg font-bold ${isSelected ? 'text-cyan-400' : 'text-slate-300'}`}>{d}</span>
                {status !== 'none' && <div className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${statusColor} ${shadowColor}`} />}
                {status !== 'none' && <div className="absolute bottom-0 left-0 h-1 bg-slate-800 w-full overflow-hidden rounded-b-lg"><div className={`h-full ${statusColor} opacity-50`} style={{ width: `${dayDataMap[d].progress}%` }} /></div>}
              </button>
            )
          })}
        </div>
      </div>

      {/* Right: Daily Detail Sidebar */}
      <div className="w-80 flex flex-col gap-4">
        {selectedDay && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex-1 shadow-lg flex flex-col">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 text-cyan-400 font-bold"><CalendarIcon size={18} /> {MONTHS[month]} {selectedDay}</div>
              {selectedData && <span className={`text-xs px-2 py-1 rounded font-bold ${selectedData.progress >= 80 ? 'bg-emerald-500/20 text-emerald-400' : selectedData.progress >= 50 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>{selectedData.progress}%</span>}
            </div>

            <div className="flex-1 flex flex-col">
              <div className="flex gap-2 mb-4 bg-slate-950 p-1 rounded-lg">
                {['tasks', 'meetings', 'notes'].map(tab => (
                  <button key={tab} onClick={() => {setActiveTab(tab as any); setAddingType(null)}} className={`flex-1 text-xs py-1.5 rounded capitalize font-bold transition-all ${activeTab === tab ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}>{tab}</button>
                ))}
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                {/* Render Lists with New Themes */}
                {activeTab === 'tasks' && renderList('tasks', selectedData?.tasks || [])}
                {activeTab === 'meetings' && renderList('meetings', selectedData?.meetings || [])}
                {activeTab === 'notes' && (
                  <p className="text-sm text-slate-400 leading-relaxed bg-slate-950 p-4 rounded border border-slate-800">{selectedData?.notes || 'No notes for this day.'}</p>
                )}

                {/* Inline Add Input */}
                {addingType === activeTab && activeTab !== 'notes' && (
                  <form onSubmit={handleAddNew} className="mt-2">
                    <input 
                      autoFocus
                      type="text" 
                      value={addInput} 
                      onChange={e => setAddInput(e.target.value)}
                      onBlur={() => setAddingType(null)}
                      placeholder={`Add new ${activeTab.replace('s', '')}... (Press Enter)`} 
                      className="w-full bg-slate-950 border border-cyan-500 rounded p-3 text-sm text-white focus:outline-none placeholder-slate-600"
                    />
                  </form>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800">
              <button onClick={() => {setActiveTab('tasks'); setAddingType('tasks')}} className="flex flex-col items-center gap-1 p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-cyan-400 transition-colors"><Plus size={16} /><span className="text-[10px] uppercase font-bold">Task</span></button>
              <button onClick={() => {setActiveTab('meetings'); setAddingType('meetings')}} className="flex flex-col items-center gap-1 p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-cyan-400 transition-colors"><Plus size={16} /><span className="text-[10px] uppercase font-bold">Meet</span></button>
              <button onClick={() => {setActiveTab('tasks'); setAddingType('tasks')}} className="flex flex-col items-center gap-1 p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded text-cyan-400 transition-colors"><Bell size={16} /><span className="text-[10px] uppercase font-bold">Remind</span></button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}