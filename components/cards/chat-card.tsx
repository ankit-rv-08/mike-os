'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Mic, Zap, Loader2 } from 'lucide-react'

interface Message {
  id: string
  author: string
  text: string
  timestamp: string
  isUser: boolean
  brain?: string
}

export function ChatCard() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      author: 'MIKE',
      text: 'System online. Dual-brain initialized. Ready for commands, Ankith.',
      timestamp: 'now',
      isUser: false,
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userText = inputValue.trim()
    setInputValue('')
    
    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      author: 'Ankith RV',
      text: userText,
      timestamp: 'now',
      isUser: true,
    }])
    
    setIsLoading(true)

    try {
      const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8787'
      const res = await fetch(`${API_BASE}/api/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: userText,
          source: 'neural-hub',
          sessionId: 'mike-os-main'
        }),
      })
      
      const data = await res.json()
      const reply = data?.response || data?.result?.message || data?.message || 'Done.'
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        author: 'MIKE',
        text: reply,
        timestamp: 'now',
        isUser: false,
        brain: data?.brain
      }])
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        author: 'SYSTEM',
        text: '⚠️ Backend unreachable. Is node server.js running?',
        timestamp: 'now',
        isUser: false,
      }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 p-4 flex flex-col flex-1 h-full min-h-[400px]">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-bold text-slate-300 flex items-center gap-2">
            <span className="text-cyan-400">💬</span>
            Neural Chat (MIKE OS)
          </h2>
          <p className="text-xs text-slate-500 mt-1">Live Connection</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-4 py-3 rounded-lg ${
                message.isUser
                  ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-100'
                  : 'bg-slate-700 text-slate-200'
              }`}
            >
              {!message.isUser && (
                <p className="text-[10px] text-cyan-400 font-bold mb-1">
                  {message.author} {message.brain && `[${message.brain.toUpperCase()}]`}
                </p>
              )}
              <p className="text-sm whitespace-pre-wrap">{message.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 text-slate-400 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
              <Loader2 size={14} className="animate-spin text-cyan-400" /> Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-slate-700 pt-4">
        <div className="flex items-center gap-2 mb-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage() }}
            placeholder="Ask MIKE anything..."
            disabled={isLoading}
            className="flex-1 bg-slate-700/50 border border-slate-600 rounded px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-slate-500">[Gemini 1.5 Pro + Groq LLaMA]</p>
          <div className="flex items-center gap-2">
            <button onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()} className="p-2 hover:bg-slate-700 rounded transition-all text-cyan-400 disabled:opacity-50">
              <Send size={18} />
            </button>
            <button className="p-2 hover:bg-slate-700 rounded transition-all text-slate-400"><Mic size={18} /></button>
            <button className="p-2 hover:bg-slate-700 rounded transition-all text-yellow-400"><Zap size={18} /></button>
          </div>
        </div>
      </div>
    </div>
  )
}