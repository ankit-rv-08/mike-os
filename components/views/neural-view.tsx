'use client'

import { useState, useRef, useEffect, FormEvent } from 'react'
import { Send, Loader2, Brain, Zap, Cpu, CheckCircle2, Server, Database } from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'ai'
  text: string
  ts: string
  brain?: string
}

export function NeuralView() {
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8787'
  
  // Persist Session ID so Backend remembers history
  const [sessionId] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mike_session')
      if (stored) return stored
      const newId = `session_${Date.now()}`
      localStorage.setItem('mike_session', newId)
      return newId
    }
    return `session_${Date.now()}`
  })
  
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mike_chat_history')
      if (stored) return JSON.parse(stored)
    }
    return [{ role: 'ai', text: 'MIKE OS initialized. Dual-brain active. How can I assist you today?', ts: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), id: '1' }]
  })

  const [input, setInput] = useState('')
  const [status, setStatus] = useState<'idle' | 'processing'>('idle')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Save to local storage whenever messages update
  useEffect(() => {
    localStorage.setItem('mike_chat_history', JSON.stringify(messages))
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, status])

  const handleSendMessage = async (e?: FormEvent) => {
    e?.preventDefault()
    if (!input.trim() || status === 'processing') return

    const userText = input.trim()
    setInput('')
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', text: userText, ts: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }])
    setStatus('processing')

    try {
      const res = await fetch(`${API_BASE}/api/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: userText, source: 'text', sessionId }),
      })
      const data = await res.json()
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: data?.response || 'Done.',
        ts: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        brain: data?.brain || 'groq'
      }])
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: '⚠️ Backend unreachable.',
        ts: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }])
    }
    setStatus('idle')
  }

  // Clear memory button
  const clearMemory = () => {
    localStorage.removeItem('mike_chat_history')
    localStorage.removeItem('mike_session')
    window.location.reload()
  }

  return (
    <div className="flex gap-6 h-full animate-in fade-in duration-300 pb-4">
      {/* Left Sidebar - System Status */}
      <div className="w-80 flex flex-col gap-4">
        {/* System Logs */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative">
          <button onClick={clearMemory} className="absolute top-4 right-4 text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded hover:text-red-400">Clear Cache</button>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-4 border-b border-slate-800 pb-2">
            <Server size={16} className="text-cyan-400" /> System
          </div>
          <div className="space-y-3 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" /> MIKE OS v2.1 — Initialized</div>
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" /> Neural Engine: ACTIVE</div>
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" /> Memory: Persistent</div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-3">
            <div className="relative">
              <div className={`w-3 h-3 rounded-full ${status === 'processing' ? 'bg-yellow-400 animate-ping absolute' : 'hidden'}`} />
              <div className={`w-3 h-3 rounded-full relative z-10 ${status === 'processing' ? 'bg-yellow-400' : 'bg-cyan-400'}`} />
            </div>
            <div>
              <div className={`text-xs font-bold ${status === 'processing' ? 'text-yellow-400' : 'text-cyan-400'} tracking-widest`}>
                {status === 'processing' ? 'PROCESSING...' : 'READY'}
              </div>
              <div className="text-[10px] text-slate-500 uppercase">Dual-Brain Engine</div>
            </div>
          </div>
        </div>

        {/* Context */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-4 border-b border-slate-800 pb-2">
            <Database size={16} className="text-emerald-400" /> DB Connection Active
          </div>
          <div className="space-y-3">
            {['Local Memory File: OK', 'Calendar DB: Read/Write', 'Stock APIs: Connected'].map((c, i) => (
              <div key={i} className="flex items-center gap-3 text-xs text-slate-300">
                <CheckCircle2 size={14} className="text-emerald-400" />
                <span>{c}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl shadow-lg flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Avatar */}
                <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center border ${msg.role === 'user' ? 'bg-slate-800 border-slate-600' : 'bg-cyan-950 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.3)]'}`}>
                  {msg.role === 'user' ? <span className="text-xs font-bold text-slate-300">AR</span> : <Cpu size={14} className="text-cyan-400" />}
                </div>

                {/* Message Bubble */}
                <div className="flex flex-col gap-1">
                  <div className={`flex items-center gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <span className="text-[10px] text-slate-500 font-bold">{msg.role === 'user' ? 'Ankith RV' : 'MIKE'}</span>
                    <span className="text-[10px] text-slate-600">{msg.ts}</span>
                  </div>
                  
                  <div className={`p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user' ? 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tr-sm' : 'bg-slate-950 border border-slate-800 text-cyan-50 rounded-tl-sm'}`}>
                    {msg.text}
                  </div>
                  
                  {msg.role === 'ai' && msg.brain && (
                    <div className="flex items-center gap-1 mt-1 opacity-70">
                      {msg.brain.includes('gemini') 
                        ? <><Brain size={12} className="text-purple-400" /><span className="text-[10px] font-bold text-purple-400 uppercase">Gemini</span></>
                        : <><Zap size={12} className="text-yellow-400" /><span className="text-[10px] font-bold text-yellow-400 uppercase">Groq</span></>
                      }
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {status === 'processing' && (
            <div className="flex justify-start">
              <div className="flex gap-4 max-w-[80%]">
                <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center bg-cyan-950 border border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                  <Cpu size={14} className="text-cyan-400" />
                </div>
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl rounded-tl-sm flex items-center gap-3">
                  <Loader2 size={16} className="text-cyan-400 animate-spin" />
                  <span className="text-sm text-cyan-400 animate-pulse">Processing...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <form onSubmit={handleSendMessage} className="flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-xl p-2 pl-4 focus-within:border-cyan-500 transition-colors">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Message MIKE..."
              className="flex-1 bg-transparent border-none focus:outline-none text-sm text-white placeholder-slate-500"
              disabled={status === 'processing'}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || status === 'processing'}
              className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:hover:bg-cyan-600 text-white p-2 rounded-lg transition-colors"
            >
              {status === 'processing' ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}