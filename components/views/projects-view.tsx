'use client'

import { useState } from 'react'
import { Briefcase, User, GripVertical, CheckCircle2, Circle, Plus } from 'lucide-react'

type TaskStatus = 'todo' | 'progress' | 'done'

interface Task {
  id: number
  title: string
  priority: 'high' | 'medium' | 'low'
  assignee: string
  due: string
  tags: string[]
}

const initialTasks: Record<TaskStatus, Task[]> = {
  todo: [
    { id: 1, title: 'Integrate MIKE OS voice recognition engine', priority: 'high', assignee: 'Mike', due: 'May 8', tags: ['AI', 'Voice'] },
    { id: 2, title: 'Design Finance module dark theme', priority: 'medium', assignee: 'Sarah', due: 'May 10', tags: ['Design', 'UI'] },
    { id: 3, title: 'Set up automated testing suite', priority: 'low', assignee: 'Dev', due: 'May 15', tags: ['Testing'] },
    { id: 4, title: 'News feed RSS aggregation pipeline', priority: 'medium', assignee: 'Mike', due: 'May 12', tags: ['Backend', 'News'] },
  ],
  progress: [
    { id: 5, title: 'Trading chart real-time data feed', priority: 'high', assignee: 'Mike', due: 'May 5', tags: ['Trading', 'API'] },
    { id: 6, title: 'Calendar sync with Google/Apple', priority: 'medium', assignee: 'Sarah', due: 'May 6', tags: ['Calendar', 'Sync'] },
    { id: 7, title: 'AI chat streaming response handler', priority: 'high', assignee: 'Mike', due: 'May 4', tags: ['AI', 'Chat'] },
  ],
  done: [
    { id: 8, title: 'Dashboard layout & widget system', priority: 'high', assignee: 'Mike', due: 'Apr 28', tags: ['UI', 'Dashboard'] },
    { id: 9, title: 'Mode switcher system (Normal/Focus/etc)', priority: 'medium', assignee: 'Mike', due: 'Apr 30', tags: ['UI', 'Modes'] },
    { id: 10, title: 'Sidebar navigation component', priority: 'low', assignee: 'Sarah', due: 'Apr 25', tags: ['UI', 'Nav'] },
    { id: 11, title: 'Performance heatmap visualization', priority: 'medium', assignee: 'Dev', due: 'May 1', tags: ['Charts', 'UI'] },
  ],
}

const columns: { id: TaskStatus; label: string; color: string; border: string }[] = [
  { id: 'todo', label: 'To Do', color: 'text-yellow-400', border: 'border-yellow-500/50' },
  { id: 'progress', label: 'In Progress', color: 'text-cyan-400', border: 'border-cyan-500/50' },
  { id: 'done', label: 'Done', color: 'text-emerald-400', border: 'border-emerald-500/50' },
]

export function ProjectsView() {
  const [tasks, setTasks] = useState(initialTasks)
  const [dragging, setDragging] = useState<{ id: number; from: TaskStatus } | null>(null)
  const [dragOver, setDragOver] = useState<TaskStatus | null>(null)

  const handleDragStart = (id: number, from: TaskStatus) => setDragging({ id, from })

  const handleDrop = (to: TaskStatus) => {
    if (!dragging || dragging.from === to) { setDragging(null); setDragOver(null); return }
    const task = tasks[dragging.from].find(t => t.id === dragging.id)
    if (!task) return
    setTasks(prev => ({
      ...prev,
      [dragging.from]: prev[dragging.from].filter(t => t.id !== dragging.id),
      [to]: [...prev[to], task],
    }))
    setDragging(null)
    setDragOver(null)
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl mb-6 shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Briefcase className="text-cyan-400" />
          <h2 className="text-lg font-bold">MIKE OS — Development Board</h2>
          <span className="bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded text-xs font-bold">Sprint 3</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex flex-col items-end"><span className="text-emerald-400 font-bold">{tasks.done.length}</span><span className="text-slate-400 text-xs">Done</span></div>
          <div className="flex flex-col items-end"><span className="text-cyan-400 font-bold">{tasks.progress.length}</span><span className="text-slate-400 text-xs">Progress</span></div>
          <div className="flex flex-col items-end"><span className="text-slate-400 font-bold">{tasks.todo.length}</span><span className="text-slate-400 text-xs">To Do</span></div>
        </div>
      </div>

      <div className="flex gap-6 flex-1 overflow-x-auto overflow-y-hidden pb-4">
        {columns.map(col => (
          <div 
            key={col.id}
            className={`min-w-[320px] flex flex-col bg-slate-950/50 rounded-xl border-2 transition-all ${dragOver === col.id ? col.border : 'border-transparent'}`}
            onDragOver={e => { e.preventDefault(); setDragOver(col.id) }}
            onDragLeave={() => setDragOver(null)}
            onDrop={() => handleDrop(col.id)}
          >
            <div className={`p-4 border-b-2 ${col.border} flex justify-between items-center bg-slate-900/50 rounded-t-xl`}>
              <span className={`font-bold ${col.color}`}>{col.label}</span>
              <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full text-xs font-bold">{tasks[col.id].length}</span>
            </div>
            
            <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
              {tasks[col.id].map(task => (
                <div 
                  key={task.id} 
                  draggable 
                  onDragStart={() => handleDragStart(task.id, col.id)}
                  className={`bg-slate-900 border border-slate-800 p-4 rounded-lg cursor-grab active:cursor-grabbing hover:border-slate-600 transition-colors shadow-lg ${dragging?.id === task.id ? 'opacity-50' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${task.priority === 'high' ? 'bg-red-500/20 text-red-400' : task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-800 text-slate-300'}`}>
                      {task.priority}
                    </span>
                    <span className="text-xs text-slate-500">{task.due}</span>
                  </div>
                  <h4 className={`text-sm font-bold mb-3 ${col.id === 'done' ? 'line-through text-slate-500' : 'text-slate-200'}`}>{task.title}</h4>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {task.tags.map(tag => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded border border-cyan-500/30 text-cyan-400 bg-cyan-500/10">{tag}</span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-800/60 pt-2">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950 px-2 py-1 rounded">
                      <User size={12} /> {task.assignee}
                    </div>
                    {col.id === 'done' ? <CheckCircle2 size={14} className="text-emerald-500" /> : <GripVertical size={14} className="text-slate-600" />}
                  </div>
                </div>
              ))}
              {tasks[col.id].length === 0 && (
                <div className="h-24 border-2 border-dashed border-slate-800 rounded-lg flex flex-col items-center justify-center text-slate-500">
                  <Plus size={24} />
                  <span className="text-xs mt-1">Drop tasks here</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}