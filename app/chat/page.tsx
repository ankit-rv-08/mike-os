'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Mic2, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  status?: 'typing' | 'complete';
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I&apos;m your AI assistant. How can I help you today?',
      status: 'complete',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      status: 'complete',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response with streaming effect
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content:
          'I understand your request. Based on your current projects and schedule, I can help you prioritize your tasks. Would you like me to create a detailed action plan?',
        status: 'typing',
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Complete the message after a delay
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id ? { ...msg, status: 'complete' } : msg
          )
        );
        setIsLoading(false);
      }, 1500);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-glow mb-2">AI Assistant</h1>
        <p className="text-muted-foreground">Have a conversation with your personal AI</p>
      </div>

      {/* System Status */}
      <div className="glass-panel p-4 mb-6 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-sm text-foreground">
          System <span className="text-accent">Ready</span>
        </span>
        <span className="text-xs text-muted-foreground ml-auto">Model: MIKE-7B</span>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-6 mb-8 pr-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-2xl px-6 py-4 rounded-xl
                ${
                  message.type === 'user'
                    ? 'glass-panel bg-accent/20 border border-accent/50'
                    : 'glass-panel'
                }
              `}
            >
              {message.type === 'assistant' && message.status === 'typing' && (
                <div className="flex items-center gap-2 text-foreground">
                  <span>Thinking</span>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" />
                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce delay-100" />
                    <div className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce delay-200" />
                  </div>
                </div>
              )}
              {message.status === 'complete' && (
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="glass-panel p-6 border border-border/30">
        <div className="flex items-end gap-4">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message... (Ctrl+Enter to send)"
              className="w-full bg-card/40 border border-border/30 rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:border-accent/50 focus:neon-glow resize-none transition-all duration-300"
              rows={3}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                  handleSendMessage(e as any);
                }
              }}
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              className="p-3 rounded-lg bg-card/40 border border-border/30 text-muted-foreground hover:text-accent transition-all duration-300 hover:neon-glow"
              title="Voice input"
            >
              <Mic2 className="w-5 h-5" />
            </button>

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-3 rounded-lg bg-accent/20 border border-accent/50 text-accent hover:bg-accent/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:neon-glow"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
