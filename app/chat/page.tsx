'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
}

export default function ChatPage() {
  const API_BASE =
    process.env.NEXT_PUBLIC_BACKEND_URL ??
    'https://mike-os-backend.vercel.app';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm MIKE. Ready when you are.",
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
    if (!input.trim()) return;

    const userText = input.trim();

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        type: 'user',
        content: userText,
      },
    ]);

    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: userText, source: 'text' }),
      });

      const data = await res.json();

      const reply =
        data?.result?.message ||
        data?.response ||
        data?.message ||
        'Command executed.';

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: reply,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: '⚠️ Backend unreachable',
        },
      ]);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">MIKE AI</h1>
        <p className="text-muted-foreground">
          Command-based assistant
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.type === 'user'
                ? 'justify-end'
                : 'justify-start'
            }`}
          >
            <div className="px-4 py-2 rounded-lg bg-gray-800 text-white max-w-xl">
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-3 rounded bg-gray-900 text-white"
          placeholder="Type command..."
        />

        <button
          type="submit"
          disabled={isLoading}
          className="p-3 bg-blue-600 rounded"
        >
          {isLoading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Send />
          )}
        </button>
      </form>
    </div>
  );
}