'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { Send, Loader2, Zap, Brain } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  brain?: string;
}

export default function ChatPage() {
  const API_BASE =
    process.env.NEXT_PUBLIC_BACKEND_URL ??
    'https://mike-os-backend.vercel.app';

  const sessionId = useRef(`session_${Date.now()}`);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hey Ankith. I'm MIKE — your personal AI system. Ask me anything. Stocks, tasks, advice, planning. What do you need?",
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { id: Date.now().toString(), type: 'user', content: userText }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: userText,
          source: 'text',
          sessionId: sessionId.current
        }),
      });

      const data = await res.json();
      const reply = data?.response || data?.result?.message || data?.message || 'Done.';
      const brain = data?.brain || 'groq';

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: reply,
        brain,
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: '⚠️ Backend unreachable. Make sure the backend is running.',
      }]);
    }

    setIsLoading(false);
  };

  const suggestions = [
    "What should I know about investing in index funds?",
    "Create a task: review DSA for 1 hour",
    "Analyze Nvidia stock for a beginner",
    "How do I improve my focus score?",
  ];

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-1">MIKE Neural</h1>
        <p className="text-muted-foreground text-sm">
          Dual-brain AI · Gemini 1.5 for deep research · Groq LLaMA for fast tasks
        </p>
      </div>

      {/* Quick suggestions */}
      {messages.length <= 1 && (
        <div className="grid grid-cols-2 gap-2 mb-6">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => setInput(s)}
              className="text-left text-sm p-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-2xl">
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.type === 'user'
                  ? 'bg-blue-600 text-white rounded-br-sm'
                  : 'bg-gray-800 text-white rounded-bl-sm'
              }`}>
                {msg.content}
              </div>
              {msg.type === 'assistant' && msg.brain && (
                <div className="flex items-center gap-1 mt-1 ml-1">
                  {msg.brain === 'gemini'
                    ? <><Brain size={10} className="text-purple-400" /><span className="text-xs text-purple-400">Gemini</span></>
                    : <><Zap size={10} className="text-yellow-400" /><span className="text-xs text-yellow-400">Groq</span></>
                  }
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl bg-gray-800 text-gray-400 flex items-center gap-2 text-sm">
              <Loader2 size={14} className="animate-spin" />
              MIKE is thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-3 rounded-xl bg-gray-900 text-white border border-gray-700 focus:border-blue-500 focus:outline-none text-sm"
          placeholder="Ask MIKE anything..."
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="p-3 bg-blue-600 rounded-xl hover:bg-blue-500 transition disabled:opacity-40"
        >
          {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </form>
    </div>
  );
}