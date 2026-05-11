'use client'

import { useState, useEffect } from 'react'
import { Plus, Clock, CheckCircle2, ChevronRight, Trash2, Layout, AlertCircle, RefreshCw } from 'lucide-react'

interface Task { 
  id: string; 
  title: string; 
  desc: string; 
  status: 'To Do' | 'In Progress' | 'Completed'; 
  priority: 'High' | 'Medium' | 'Low' 
}

export function ProjectsView() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8787'

  const fetchTasks = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/projects`)
      const contentType = res.headers.get("content-type")
      
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json()
        setTasks(data.tasks || [])
      } else {
        console.error("Backend returned non-JSON response. Check if server is running.")
      }
    } catch (e) {
      console.error("Connection failed to backend.")
    } finally {
      setIsLoading(false)
    }
  }

  const saveTasks = async (newTasks: Task[]) => {
    setTasks(newTasks) // Optimistic UI update
    try {
      await fetch(`${API_BASE}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: newTasks })
      })
    } catch (e) {
      console.error("Failed to save to backend")
    }
  }

  useEffect(() => {
    fetchTasks()
    const interval = setInterval(fetchTasks, 10000) // Auto-sync every 10s
    return () => clearInterval(interval)
  }, [])

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    
    const newTask: Task = { 
      id: Date.now().toString(), 
      title: newTitle.trim(), 
      desc: 'Manual system entry.', 
      status: 'To Do', 
      priority: 'Medium' 
    }
    
    saveTasks([...tasks, newTask])
    setNewTitle('')
    setIsAdding(false)
  }

  const moveTask = (id: string) => {
    const cycle: Record<string, any> = { 'To Do': 'In Progress', 'In Progress': 'Completed', 'Completed': 'To Do' }
    const updated = tasks.map(t => t.id === id ? { ...t, status: cycle[t.status] } : t)
    saveTasks(updated)
  }

  const deleteTask = (id: string) => {
    saveTasks(tasks.filter(t => t.id !== id))
  }

  const Column = ({ title, status }: { title: string, status: Task['status'] }) => {
    const filtered = tasks.filter(t => t.status === status)
    return (
      <div className="flex-1 flex flex-col gap-4 bg-slate-900/40 border border-slate-800/60 rounded-2xl p-4 min-h-[550px] backdrop-blur-sm">
        <div className="flex justify-between items-center mb-2 px-2">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${status === 'In Progress' ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]' : status === 'Completed' ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-slate-600'}`} />
            {title}
          </h3>
          <span className="text-[10px] font-mono text-slate-600 bg-slate-800/50 px-2 py-0.5 rounded border border-slate-700/50">
            {filtered.length.toString().padStart(2, '0')}
          </span>
        </div>

        <div className="space-y-3 flex-1">
          {filtered.map(task => (
            <div key={task.id} className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-xl group hover:border-cyan-500/50 transition-all duration-300 relative overflow-hidden">
              <div className="flex justify-between items-start mb-3">
                <div className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded border ${
                  task.priority === 'High' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                }`}>
                  {task.priority}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => moveTask(task.id)} className="p-1 hover:text-cyan-400 text-slate-500 transition-colors"><ChevronRight size={14}/></button>
                  <button onClick={() => deleteTask(task.id)} className="p-1 hover:text-red-400 text-slate-500 transition-colors"><Trash2 size={14}/></button>
                </div>
              </div>
              <h4 className="text-sm font-bold text-slate-100 mb-2 leading-tight">{task.title}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 font-medium">{task.desc}</p>
              
              {/* Decorative progress line for 'In Progress' tasks */}
              {status === 'In Progress' && <div className="absolute bottom-0 left-0 h-0.5 bg-cyan-500 w-1/3 animate-pulse" />}
            </div>
          ))}
          {filtered.length === 0 && !isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-xl py-10 opacity-30">
              <AlertCircle size={20} className="mb-2" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Queue Empty</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full gap-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Layout size={18} className="text-cyan-400" />
            <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Execution Board</h2>
          </div>
          <p className="text-[10px] text-slate-500 font-bold tracking-widest uppercase ml-7">Sprint v2.1 // System Active</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={fetchTasks} 
            className={`p-2 rounded-lg border border-slate-800 text-slate-500 hover:text-cyan-400 transition-all ${isLoading ? 'animate-spin' : ''}`}
          >
            <RefreshCw size={16} />
          </button>
          <button 
            onClick={() => setIsAdding(true)} 
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] active:scale-95"
          >
            Initiate Task
          </button>
        </div>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-slate-900 border border-cyan-500/30 p-6 rounded-2xl animate-in zoom-in-95 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500" />
          <h3 className="text-[10px] font-black text-cyan-500 uppercase tracking-widest mb-4">New Task Definition</h3>
          <input 
            autoFocus
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Enter Task Name..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-cyan-500 transition-colors mb-4 font-medium"
          />
          <div className="flex justify-end gap-4">
            <button type="button" onClick={() => setIsAdding(false)} className="text-[10px] text-slate-500 font-black uppercase hover:text-white transition-colors">Abort</button>
            <button type="submit" className="text-[10px] text-cyan-400 font-black uppercase hover:text-cyan-300 transition-colors">Commit to Board</button>
          </div>
        </form>
      )}

      <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar">
        <Column title="Backlog" status="To Do" />
        <Column title="In Execution" status="In Progress" />
        <Column title="Verified" status="Completed" />
      </div>
    </div>
  )
}