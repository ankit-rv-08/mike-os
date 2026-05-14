'use client'

import { motion } from 'framer-motion'
import { Send, Bot, Zap } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

export function MikeSidebar() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: "Hey Ankith. You're 3 days behind on DSA. Want a 25-min sprint plan?",
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const quickActions = [
    { icon: '🎯', text: "What's my next move?" },
    { icon: '💼', text: 'Critique my LinkedIn' },
    { icon: '🎤', text: 'Mock interview me' },
    { icon: '⚙️', text: 'Explain caching tradeoffs' },
  ]

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage = input
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        'Great question! Let me break that down for you...',
        'That\'s an excellent point. Here\'s my analysis...',
        'I\'d recommend focusing on System Design next. Here\'s why...',
        'Your progress is solid. Consider pivoting to interview prep...',
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setMessages((prev) => [...prev, { role: 'assistant', content: randomResponse }])
      setIsLoading(false)
    }, 800)
  }

  const handleQuickAction = (action: string) => {
    setMessages((prev) => [...prev, { role: 'user', content: action }])
    setIsLoading(true)

    setTimeout(() => {
      const responses = [
        'Based on your current progress, I recommend: Focus on the next DSA sprint for 2 weeks, then transition to System Design.',
        'Your LinkedIn looks strong. I\'d suggest adding more technical projects and impact metrics.',
        "Sure! Let's start with a classic question: How would you design a URL shortening service like bit.ly?",
        'Caching is crucial for performance. You have write-through, write-back, and write-around strategies...',
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setMessages((prev) => [...prev, { role: 'assistant', content: randomResponse }])
      setIsLoading(false)
    }, 800)
  }

  const containerVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { delay: 0.2 },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-80 border-l border-white/10 backdrop-blur-xl bg-slate-900/40 flex flex-col"
    >
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Bot size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">MIKE</p>
            <p className="text-xs text-slate-500">AI Strategist · online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs rounded-lg px-3 py-2 text-sm ${
                msg.role === 'user'
                  ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-500/50'
                  : 'bg-slate-800/50 text-slate-300 border border-slate-700/50'
              }`}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-slate-800/50 text-slate-400 rounded-lg px-3 py-2 text-sm border border-slate-700/50">
              <div className="flex gap-1">
                <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, delay: 0.1 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
                <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-slate-400 rounded-full" />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="border-t border-white/10 px-4 py-4 space-y-2">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-mono mb-3">Quick Actions</p>
          <div className="space-y-2">
            {quickActions.map((action, idx) => (
              <motion.button
                key={idx}
                whileHover={{ backgroundColor: 'rgb(30, 41, 59, 0.8)' }}
                onClick={() => handleQuickAction(action.text)}
                className="w-full text-left px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs text-slate-400 hover:text-slate-300 transition-all flex items-center gap-2"
              >
                <span>{action.icon}</span>
                <span>{action.text}</span>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-white/10 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask MIKE…"
            className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="p-2 rounded-lg bg-indigo-500/20 border border-indigo-500/50 hover:bg-indigo-500/30 disabled:opacity-50 transition-all"
          >
            <Send size={14} className="text-indigo-400" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
