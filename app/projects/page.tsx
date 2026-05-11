'use client';

import { useState } from 'react';
import { Plus, MoreVertical } from 'lucide-react';

export default function ProjectsPage() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Fix command-routes Express router', status: 'Done', tag: 'Backend' },
    { id: 2, title: 'Wire Gemini AI to Chat UI', status: 'Done', tag: 'AI' },
    { id: 3, title: 'Implement Redis Persistence', status: 'In Progress', tag: 'Database' },
    { id: 4, title: 'Design Cyberpunk Dashboard UI', status: 'In Progress', tag: 'Frontend' },
    { id: 5, title: 'Prepare DSA for placements', status: 'To Do', tag: 'Career' },
    { id: 6, title: 'Configure Vercel Deployment', status: 'To Do', tag: 'DevOps' },
  ]);

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'To Do').length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    done: tasks.filter(t => t.status === 'Done').length,
  };

  const progress = Math.round((stats.done / stats.total) * 100);

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Execution Board</h1>
          <p className="text-muted-foreground text-sm mt-1">MIKE OS — Sprint 34</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition">
          <Plus size={16} /> New Task
        </button>
      </div>

      {/* Progress Overview */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex items-center justify-between">
        <div className="flex items-center gap-6 w-full max-w-2xl">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{progress}%</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Progress</div>
          </div>
          <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <div className="flex gap-6 text-center">
          <div><div className="text-xl font-bold text-white">{stats.done}</div><div className="text-xs text-gray-500">DONE</div></div>
          <div><div className="text-xl font-bold text-white">{stats.inProgress}</div><div className="text-xs text-gray-500">ACTIVE</div></div>
          <div><div className="text-xl font-bold text-white">{stats.todo}</div><div className="text-xs text-gray-500">QUEUED</div></div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-[500px]">
        {/* TO DO Column */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="font-bold text-gray-300">To Do <span className="bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full text-xs ml-2">{stats.todo}</span></h3>
            <MoreVertical size={16} className="text-gray-500 cursor-pointer hover:text-white" />
          </div>
          <div className="space-y-3">
            {tasks.filter(t => t.status === 'To Do').map(task => (
              <div key={task.id} className="bg-gray-800 border border-gray-700 p-4 rounded-xl hover:border-blue-500/50 cursor-grab transition shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-400/10 px-2 py-1 rounded mb-2 inline-block">{task.tag}</span>
                <p className="text-sm text-gray-200 font-medium">{task.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* IN PROGRESS Column */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="font-bold text-blue-400">In Progress <span className="bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded-full text-xs ml-2">{stats.inProgress}</span></h3>
            <MoreVertical size={16} className="text-gray-500 cursor-pointer hover:text-white" />
          </div>
          <div className="space-y-3">
            {tasks.filter(t => t.status === 'In Progress').map(task => (
              <div key={task.id} className="bg-gray-800 border border-blue-500/30 p-4 rounded-xl cursor-grab shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-400/10 px-2 py-1 rounded mb-2 inline-block">{task.tag}</span>
                <p className="text-sm text-gray-200 font-medium">{task.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* DONE Column */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-4 flex flex-col h-full">
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="font-bold text-green-400">Done <span className="bg-green-900/30 text-green-400 px-2 py-0.5 rounded-full text-xs ml-2">{stats.done}</span></h3>
            <MoreVertical size={16} className="text-gray-500 cursor-pointer hover:text-white" />
          </div>
          <div className="space-y-3 opacity-60">
            {tasks.filter(t => t.status === 'Done').map(task => (
              <div key={task.id} className="bg-gray-800 border border-gray-700 p-4 rounded-xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-700 px-2 py-1 rounded mb-2 inline-block">{task.tag}</span>
                <p className="text-sm text-gray-400 line-through">{task.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}