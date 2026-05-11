'use client'

import { useState, useEffect, useRef } from 'react'
import { Mic, Activity, Clock, List, Settings, PlayCircle, Volume2, Sparkles } from 'lucide-react'

type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking'

const stateLabels: Record<VoiceState, string> = {
  idle: 'TAP ORB TO SPEAK',
  listening: 'LISTENING...',
  processing: 'PROCESSING AI...',
  speaking: 'SPEAKING...',
}

interface HistoryItem { q: string; a: string; time: string }
interface VoiceOption { label: string; voice: SpeechSynthesisVoice }

export function VoiceView() {
  const [state, setState] = useState<VoiceState>('idle')
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [waveAmps, setWaveAmps] = useState<number[]>(Array(32).fill(0.15))
  
  // Voice & History State
  const [hasGreeted, setHasGreeted] = useState(false)
  const [voices, setVoices] = useState<VoiceOption[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>('')
  const [recentHistory, setRecentHistory] = useState<HistoryItem[]>([
    { q: 'What is my productivity score?', a: 'Your score is 87% — above your weekly average of 82%.', time: '5m ago' }
  ])

  const recognitionRef = useRef<any>(null)

  // 1. Initialize High-Quality Curated Voices
  useEffect(() => {
    const loadCuratedVoices = () => {
      const allVoices = window.speechSynthesis.getVoices()
      if (allVoices.length === 0) return

      const results: VoiceOption[] = []
      const seen = new Set()

      // Smart Voice Hunter: Prioritizes Google/Neural voices over robotic OS voices
      const addVoice = (label: string, nameKeywords: string[]) => {
        for (const keyword of nameKeywords) {
          const match = allVoices.find(v => v.name.toLowerCase().includes(keyword.toLowerCase()) && !seen.has(v.name))
          if (match) {
            seen.add(match.name)
            // Clean up the name for a sleek UI display
            const cleanName = match.name.replace('Microsoft ', '').replace(' Desktop', '').replace('Google ', '')
            results.push({ label: `${label} (${cleanName})`, voice: match })
            return // Found the highest quality match, stop looking for this category
          }
        }
      }

      // 🇺🇸 American (Prioritize Male for MIKE OS)
      addVoice('🇺🇸 American Male', ['us english male', 'david', 'guy', 'mark'])
      addVoice('🇺🇸 American Female', ['us english', 'zira', 'samantha', 'jenny', 'karen'])
      
      // 🇬🇧 British 
      addVoice('🇬🇧 British Male', ['uk english male', 'ryan', 'daniel', 'arthur', 'george']) 
      addVoice('🇬🇧 British Female', ['uk english female', 'hazel', 'serena', 'sonia'])
      
      // 🇪🇺 European
      addVoice('🇫🇷 French Female', ['français', 'hortense', 'julie'])
      addVoice('🇩🇪 German Male', ['deutsch', 'stefan', 'conrad'])
      
      // 🇮🇹 Italian
      addVoice('🇮🇹 Italian Male', ['italiano', 'cosimo', 'diego', 'elsa'])
      
      // 🇷🇺 Russian
      addVoice('🇷🇺 Russian Female', ['русский', 'irina', 'milena', 'russian'])
      addVoice('🇷🇺 Russian Male', ['pavel', 'dmitry'])
      
      // 🇯🇵 Japanese
      addVoice('🇯🇵 Japanese Female', ['日本語', 'haruka', 'kyoko', 'ayumi'])

      // Fallback just in case OS is super strict
      if (results.length === 0) {
        allVoices.filter(v => v.lang.startsWith('en')).slice(0, 8).forEach(v => {
          results.push({ label: `Default (${v.name})`, voice: v })
        })
      }

      setVoices(results)
      
      // DEFAULT TO A MALE VOICE TO MATCH "MIKE"
      if (!selectedVoice && results.length > 0) {
        // Find an American or British male first, fallback to any male, then fallback to first available
        const defaultVoice = results.find(v => v.label.includes('American Male') || v.label.includes('British Male')) 
                          || results.find(v => v.label.includes('Male')) 
                          || results[0]
        setSelectedVoice(defaultVoice.voice.name)
      }
    }

    loadCuratedVoices()
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadCuratedVoices
    }

    // Setup Speech Recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = true

        recognition.onresult = (event: any) => {
          let currentTranscript = ''
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript
          }
          setTranscript(currentTranscript)

          if (event.results[event.results.length - 1].isFinal) {
            handleCommand(currentTranscript)
          }
        }
        
        recognition.onerror = () => setState('idle')
        recognition.onend = () => { if (state === 'listening') setState('processing') }
        recognitionRef.current = recognition
      }
    }
  }, [])

  // 2. Initial Greeting
  useEffect(() => {
    if (!hasGreeted && voices.length > 0 && selectedVoice) {
      setHasGreeted(true)
      const greeting = "Welcome back, Ankith. MIKE OS Voice Interface initialized. How can I assist you today?"
      setTimeout(() => {
        setResponse(greeting)
        speak(greeting)
      }, 800)
    }
  }, [hasGreeted, voices, selectedVoice])

  // 3. Text-to-Speech Engine
  const speak = (text: string) => {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    
    // Find the exact voice object selected from our curated list
    const selectedOption = voices.find(v => v.voice.name === selectedVoice)
    if (selectedOption) {
      utterance.voice = selectedOption.voice
      utterance.lang = selectedOption.voice.lang 
    }
    
    utterance.rate = 1.0
    utterance.pitch = 1.0

    utterance.onstart = () => setState('speaking')
    utterance.onend = () => {
      setState('idle')
      setTranscript('') 
    }

    window.speechSynthesis.speak(utterance)
  }

  // 4. Send to Node.js Backend
  const handleCommand = async (text: string) => {
    setState('processing')
    try {
      const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8787'
      const res = await fetch(`${API_BASE}/api/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: text, source: 'voice', sessionId: 'mike-voice' }),
      })
      const data = await res.json()
      const reply = data?.response || data?.result?.message || data?.message || 'Done.'
      
      setResponse(reply)
      speak(reply)
      
      setRecentHistory(prev => [{
        q: text, a: reply, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }, ...prev].slice(0, 4))

    } catch (e) {
      const err = "Backend unreachable. Please ensure the node server is running."
      setResponse(err)
      speak(err)
    }
  }

  // 5. Mic Button Handler
  const toggleMic = () => {
    if (state === 'listening' && recognitionRef.current) {
      recognitionRef.current.stop()
      setState('idle')
    } else if (state === 'speaking') {
      window.speechSynthesis.cancel()
      setState('idle')
    } else if (recognitionRef.current) {
      setTranscript('')
      setResponse('')
      window.speechSynthesis.cancel()
      try {
        recognitionRef.current.start()
        setState('listening')
      } catch (e) {
        console.error(e)
      }
    }
  }

  // 6. Waveform Animation Loop
  useEffect(() => {
    if (state === 'idle') {
      setWaveAmps(Array(32).fill(0.15))
      return
    }
    const interval = setInterval(() => {
      setWaveAmps(prev => prev.map(() => {
        if (state === 'listening') return 0.3 + Math.random() * 0.7
        if (state === 'processing') return 0.1 + Math.abs(Math.sin(Date.now() / 300 + Math.random())) * 0.4
        if (state === 'speaking') return 0.2 + Math.random() * 0.8
        return 0.15
      }))
    }, 80)
    return () => clearInterval(interval)
  }, [state])

  // UI Constants
  const orbSize = state === 'idle' ? 'w-40 h-40' : state === 'listening' ? 'w-44 h-44' : state === 'processing' ? 'w-40 h-40' : 'w-48 h-48'
  const orbGlow = state === 'idle' ? 'shadow-[0_0_40px_rgba(6,182,212,0.3)]' : 'shadow-[0_0_80px_rgba(6,182,212,0.6),0_0_120px_rgba(6,182,212,0.3)]'

  return (
    <div className="flex gap-6 h-full animate-in fade-in duration-300">
      {/* Left: Main Voice Interface */}
      <div className="flex-1 flex flex-col gap-6 items-center justify-center bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-xl relative overflow-hidden">
        
        {/* Dynamic Orb */}
        <div className="relative flex items-center justify-center mt-12 mb-16">
          <div className="absolute inset-0 flex items-center justify-center">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className={`absolute border border-cyan-500 rounded-full transition-all duration-1000 ${state !== 'idle' ? 'animate-ping' : ''}`}
                style={{
                  width: `${160 + i * 40}px`, height: `${160 + i * 40}px`,
                  opacity: state !== 'idle' ? 0.15 / i : 0.05 / i,
                  animationDelay: `${i * 0.3}s`
                }}
              />
            ))}
          </div>

          <button
            onClick={toggleMic}
            className={`relative rounded-full z-10 flex items-center justify-center transition-all duration-500 ${orbSize} ${orbGlow} ${state !== 'idle' ? 'bg-cyan-500/20 border-cyan-400' : 'bg-slate-950 border-cyan-900'} border-2`}
          >
            {state === 'idle' ? <Mic size={48} className="text-cyan-400" /> : state === 'speaking' ? <Volume2 size={48} className="text-cyan-400 animate-pulse" /> : <Activity size={48} className="text-cyan-400 animate-pulse" />}
          </button>
        </div>

        <div className="text-cyan-400 font-bold tracking-[0.25em] text-sm animate-pulse">
          {stateLabels[state]}
        </div>

        {/* Dynamic Waveform */}
        <div className="flex items-end justify-center gap-1 h-20 w-full max-w-md">
          {waveAmps.map((amp, i) => (
            <div
              key={i}
              className="w-2 rounded-full bg-cyan-400 transition-all duration-75"
              style={{
                height: `${amp * 100}%`,
                opacity: 0.4 + amp * 0.6,
                boxShadow: amp > 0.6 ? '0 0 8px rgba(6,182,212,0.8)' : 'none'
              }}
            />
          ))}
        </div>

        {/* Real-time Transcripts */}
        <div className="w-full max-w-2xl mt-auto space-y-4">
          {transcript && (
            <div className="bg-slate-950/50 border border-slate-800 p-4 rounded-xl shadow-inner text-right animate-in slide-in-from-right-4">
              <div className="text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-widest">You said</div>
              <p className="text-slate-200">{transcript}</p>
            </div>
          )}
          {response && (
            <div className="bg-cyan-950/30 border border-cyan-500/30 p-4 rounded-xl shadow-lg text-left animate-in slide-in-from-left-4">
              <div className="text-[10px] text-cyan-500 uppercase font-bold mb-1 tracking-widest flex items-center gap-1"><Sparkles size={12}/> MIKE</div>
              <p className="text-cyan-50">{response}</p>
            </div>
          )}
        </div>
      </div>

      {/* Right: Tools & History */}
      <div className="w-80 flex flex-col gap-4">
        
        {/* Voice Selector */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-3 border-b border-slate-800 pb-2"><Settings size={16} className="text-slate-400" /> Output Voice</h3>
          <div className="relative">
            <select 
              value={selectedVoice} 
              onChange={(e) => {
                setSelectedVoice(e.target.value);
                // Preview voice instantly when changed
                window.speechSynthesis.cancel();
                const u = new SpeechSynthesisUtterance("Voice updated.");
                const v = voices.find(voice => voice.voice.name === e.target.value);
                if (v) { u.voice = v.voice; u.lang = v.voice.lang; window.speechSynthesis.speak(u); }
              }}
              className="w-full bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg p-2.5 appearance-none focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              {voices.length > 0 ? voices.map(v => (
                <option key={v.voice.name} value={v.voice.name}>{v.label}</option>
              )) : <option>Loading system voices...</option>}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">▼</div>
          </div>
        </div>

        {/* Quick Commands */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-4 border-b border-slate-800 pb-2"><List size={16} className="text-emerald-400" /> Quick Commands</h3>
          <div className="flex flex-wrap gap-2">
            {[
              "Show my portfolio",
              "What's on my calendar?",
              "Latest crypto news",
              "Analyze Nvidia stock",
              "Productivity today"
            ].map((cmd, i) => (
              <button 
                key={i} 
                onClick={() => { setTranscript(cmd); handleCommand(cmd); }}
                className="text-xs bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 px-3 py-1.5 rounded-full transition-all flex items-center gap-1"
              >
                <PlayCircle size={12} /> {cmd}
              </button>
            ))}
          </div>
        </div>

        {/* History */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex-1 flex flex-col overflow-hidden">
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-300 mb-4 border-b border-slate-800 pb-2"><Clock size={16} className="text-yellow-400" /> Recent Dialogues</h3>
          <div className="flex-1 overflow-y-auto pr-1 space-y-4 custom-scrollbar">
            {recentHistory.map((h, i) => (
              <div key={i} className="border-l-2 border-slate-700 pl-3 py-1">
                <div className="text-xs text-slate-400 mb-1 flex justify-between">
                  <span>{h.q}</span>
                  <span className="text-[9px] text-slate-600">{h.time}</span>
                </div>
                <div className="text-xs font-bold text-cyan-400 line-clamp-2">{h.a}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}