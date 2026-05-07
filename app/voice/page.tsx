'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { Mic2, StopCircle, Volume2, Radio, ChevronDown, Check } from 'lucide-react';

type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';
type AccentStyle = 'british-male' | 'british-female' | 'american-male' | 'american-female' | 'indian-british' | 'european-male';

interface VoiceOption {
  id: AccentStyle;
  name: string;
  accent: string;
  description: string;
  lang: string;
  pitch: number;
  rate: number;
}

const VOICE_OPTIONS: VoiceOption[] = [
  { id: 'british-male', name: 'British Male', accent: '🇬🇧', description: 'James - Clear & Sophisticated', lang: 'en-GB', pitch: 1.0, rate: 0.9 },
  { id: 'british-female', name: 'British Female', accent: '🇬🇧', description: 'Emma - Elegant & Warm', lang: 'en-GB', pitch: 1.1, rate: 0.95 },
  { id: 'american-male', name: 'American Male', accent: '🇺🇸', description: 'Michael - Confident & Direct', lang: 'en-US', pitch: 1.0, rate: 0.95 },
  { id: 'american-female', name: 'American Female', accent: '🇺🇸', description: 'Sarah - Friendly & Professional', lang: 'en-US', pitch: 1.1, rate: 0.95 },
  { id: 'indian-british', name: 'Indo-British', accent: '🇮🇳🇬🇧', description: 'Rajan - Cultured & Warm', lang: 'en-GB', pitch: 0.95, rate: 0.85 },
  { id: 'european-male', name: 'European Male', accent: '🇪🇺', description: 'Lars - Continental & Precise', lang: 'en-US', pitch: 0.9, rate: 0.85 },
];

export default function VoicePage() {
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8787';
  const [state, setState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [selectedAccent, setSelectedAccent] = useState<AccentStyle>('indian-british');
  const [showDropdown, setShowDropdown] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState('');

  const currentVoice = VOICE_OPTIONS.find(v => v.id === selectedAccent)!;

  const SpeechRecognitionApi = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
  }, []);

  // Load voices
  const loadVoices = useCallback(async () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    const allVoices = window.speechSynthesis.getVoices();
    const matchingVoices = allVoices.filter(v => v.lang.startsWith(currentVoice.lang));
    setAvailableVoices(matchingVoices);

    // Try to load saved voice
    try {
      const res = await fetch(`${API_BASE}/api/voice-settings`);
      const json = await res.json();
      const saved = json?.data?.voiceName || '';
      if (saved && allVoices.some(v => v.name === saved)) {
        setSelectedVoiceName(saved);
      }
    } catch {
      // Use first matching voice
      if (matchingVoices.length > 0) {
        setSelectedVoiceName(matchingVoices[0].name);
      }
    }
  }, [API_BASE, currentVoice.lang]);

  // Get best voice for accent
  const getBestVoice = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const voices = window.speechSynthesis.getVoices();
    const matchingVoices = voices.filter(v => v.lang.toLowerCase().startsWith(currentVoice.lang.split('-')[0]));
    
    if (selectedVoiceName) {
      const found = matchingVoices.find(v => v.name === selectedVoiceName);
      if (found) return found;
    }

    // Smart voice selection based on accent
    const accentHints: Record<string, RegExp> = {
      'british-male': /male|daniel|george|arthur|ryan|oliver/i,
      'british-female': /female|emma|kate|sarah|lucy|olivia/i,
      'american-male': /male|tom|mike|david|james/i,
      'american-female': /female|samantha|susan|lisa|mary/i,
      'indian-british': /male|daniel|george|ryan/i,
      'european-male': /male|mike|tom|david/i,
    };

    const hint = accentHints[selectedAccent];
    if (hint) {
      return matchingVoices.find(v => hint.test(v.name.toLowerCase())) || matchingVoices[0] || null;
    }
    
    return matchingVoices[0] || null;
  }, [currentVoice.lang, selectedAccent, selectedVoiceName]);

  // JARVIS-style greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    const dayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    
    const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : hour < 21 ? 'Good evening' : 'Late night';
    
    const greetings = [
      `${timeGreeting}, Ankith. I am MIKE, your personal operating system. It's ${dayOfWeek}. All systems are operational. How may I assist you today?`,
      `${timeGreeting}, Ankith. MIKE online and ready. ${dayOfWeek} looks promising. What shall we accomplish?`,
      `${timeGreeting}. I've been expecting you. It's ${dayOfWeek}. What's our mission today?`,
    ];
    
    return greetings[Math.floor(Math.random() * greetings.length)];
  };

  // Speak with selected accent
  const speak = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentVoice.lang;
    utterance.pitch = currentVoice.pitch;
    utterance.rate = currentVoice.rate;
    utterance.volume = 1;
    
    const voice = getBestVoice();
    if (voice) utterance.voice = voice;
    
    utterance.onstart = () => setState('speaking');
    utterance.onend = () => setState('idle');
    utterance.onerror = () => {
      setError('Speech playback failed');
      setState('idle');
    };
    
    window.speechSynthesis.speak(utterance);
  };

  // Process voice command
  const processCommand = async (input: string) => {
    setState('processing');
    try {
      const res = await fetch(`${API_BASE}/api/voice-command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: input, voice: selectedAccent }),
      });
      const data = await res.json();
      const reply = data?.data?.response || data?.data?.result || 'Command received, Ankith.';
      setResponse(reply);
      speak(reply);
    } catch {
      const fallback = 'I could not reach the backend service. Please check your connection.';
      setResponse(fallback);
      speak(fallback);
    }
  };

  // Handle microphone
  const handleMicClick = () => {
    if (state === 'listening' || state === 'speaking' || state === 'processing') {
      window.speechSynthesis?.cancel();
      setState('idle');
      return;
    }

    setError('');
    setTranscript('');
    setResponse('');

    if (!SpeechRecognitionApi) {
      setError('Speech recognition not supported in this browser.');
      return;
    }

    setState('listening');
    const recognition = new SpeechRecognitionApi();
    recognition.lang = currentVoice.lang;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const spoken = event.results?.[0]?.[0]?.transcript?.trim();
      if (spoken) {
        setTranscript(spoken);
        processCommand(spoken);
      } else {
        setError('No speech detected. Try again.');
        setState('idle');
      }
    };

    recognition.onerror = () => {
      setError('Microphone access denied. Please allow microphone permissions.');
      setState('idle');
    };

    recognition.onend = () => {
      if (state === 'listening') setState('processing');
    };

    recognition.start();
  };

  // Persist accent selection
  const selectAccent = async (accent: AccentStyle) => {
    setSelectedAccent(accent);
    setShowDropdown(false);
    localStorage.setItem('mike-voice-accent', accent);
    
    try {
      await fetch(`${API_BASE}/api/voice-settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voiceName: selectedVoiceName || '',
          locale: VOICE_OPTIONS.find(v => v.id === accent)!.lang,
          style: accent,
        }),
      });
    } catch {}
  };

  // Load saved accent
  useEffect(() => {
    const saved = localStorage.getItem('mike-voice-accent') as AccentStyle;
    if (saved && VOICE_OPTIONS.some(v => v.id === saved)) {
      setSelectedAccent(saved);
    }
  }, []);

  // Load voices on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, [loadVoices]);

  // Auto-greet on mount
  useEffect(() => {
    const timer = setTimeout(() => speak(getGreeting()), 800);
    return () => clearTimeout(timer);
  }, []);

  const tips = [
    { cmd: 'What is my schedule today?', icon: '📅' },
    { cmd: 'Create a task for tomorrow', icon: '✅' },
    { cmd: 'Show me stock market updates', icon: '📈' },
    { cmd: 'Read my package.json file', icon: '📁' },
    { cmd: 'Show my GitHub info', icon: '🔗' },
    { cmd: 'What is machine learning?', icon: '🧠' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] max-w-3xl mx-auto px-4">
      {/* Title Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">
          <span className="text-gradient">MIKE</span>
          <span className="text-foreground"> Voice Interface</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          {state === 'idle' && 'Click the microphone or say "Hey MIKE"'}
          {state === 'listening' && (
            <span className="text-accent animate-pulse">🎤 Listening to you...</span>
          )}
          {state === 'processing' && (
            <span className="text-primary animate-pulse">⚡ Processing request...</span>
          )}
          {state === 'speaking' && (
            <span className="text-green-400 animate-pulse">🔊 Responding...</span>
          )}
        </p>
        {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
      </div>

      {/* JARVIS Core Animation */}
      <div className="relative w-72 h-72 mb-12 flex items-center justify-center">
        {/* Outer glow rings */}
        <div className={`absolute inset-[-20px] rounded-full opacity-20 blur-xl transition-all duration-700 ${
          state === 'idle' ? 'bg-accent/20 scale-100' :
          state === 'listening' ? 'bg-accent/40 scale-110 animate-pulse' :
          state === 'processing' ? 'bg-primary/40 scale-105 animate-spin-slow' :
          'bg-green-500/40 scale-110 animate-pulse'
        }`} />

        {/* Ring 1 - Outer */}
        <div className={`absolute inset-0 rounded-full border-2 transition-all duration-500 ${
          state === 'idle' ? 'border-accent/30' : 'border-accent/60'
        }`} style={{
          animation: state !== 'idle' ? 'ringPulse 2s infinite' : 'none',
          animationDelay: '0s'
        }} />

        {/* Ring 2 - Middle */}
        <div className={`absolute inset-4 rounded-full border-2 transition-all duration-500 ${
          state === 'idle' ? 'border-accent/20' : 'border-accent/50'
        }`} style={{
          animation: state !== 'idle' ? 'ringPulse 2s infinite' : 'none',
          animationDelay: '0.3s'
        }} />

        {/* Ring 3 - Inner */}
        <div className={`absolute inset-8 rounded-full border transition-all duration-500 ${
          state === 'idle' ? 'border-accent/15' : 'border-accent/40'
        }`} style={{
          animation: state !== 'idle' ? 'ringPulse 2s infinite' : 'none',
          animationDelay: '0.6s'
        }} />

        {/* Core circle */}
        <div className={`absolute inset-12 rounded-full transition-all duration-500 ${
          state === 'idle' 
            ? 'bg-gradient-to-br from-accent/20 to-primary/10'
            : state === 'listening'
              ? 'bg-gradient-to-br from-accent/50 to-accent/20 animate-corePulse'
              : state === 'processing'
                ? 'bg-gradient-to-br from-primary/50 to-accent/30 animate-coreSpin'
                : 'bg-gradient-to-br from-green-500/50 to-accent/30 animate-corePulse'
        }`} />

        {/* Center dot */}
        <div className={`absolute w-4 h-4 rounded-full transition-all duration-300 ${
          state === 'idle'
            ? 'bg-accent/50'
            : state === 'listening'
              ? 'bg-accent shadow-lg shadow-accent/50 animate-pulse'
              : state === 'processing'
                ? 'bg-white shadow-lg shadow-white/50 animate-spin'
                : 'bg-green-400 shadow-lg shadow-green-500/50 animate-pulse'
        }`} />

        {/* Waveform bars */}
        <div className="absolute inset-0 flex items-center justify-center gap-1 px-20">
          {[...Array(19)].map((_, i) => (
            <div
              key={i}
              className="w-1 rounded-full transition-all duration-200"
              style={{
                height: state === 'idle' ? '4px' : `${Math.abs(Math.sin(i * 0.4) * 30 + 15)}px`,
                backgroundColor: state === 'idle' ? 'rgba(0,200,255,0.3)' : 
                  state === 'speaking' ? `hsl(${160 + i * 5}, 80%, 60%)` : `hsl(${200 + i * 3}, 80%, 55%)`,
                animationDelay: `${i * 0.05}s`,
                opacity: state === 'idle' ? 0.5 : 0.9,
              }}
            />
          ))}
        </div>
      </div>

      {/* Transcript */}
      {transcript && (
        <div className="glass-panel p-6 w-full mb-6 border border-accent/30 animate-fade-in">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">You Said</p>
          <p className="text-lg text-accent font-medium">&ldquo;{transcript}&rdquo;</p>
        </div>
      )}

      {/* Response */}
      {state === 'speaking' && response && (
        <div className="glass-panel p-6 w-full mb-6 border border-green-500/30 animate-fade-in">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">MIKE Response</p>
          <p className="text-foreground leading-relaxed">{response}</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-8 mb-12">
        {/* Mic Button */}
        <button
          onClick={handleMicClick}
          className={`relative w-20 h-20 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${
            state === 'idle'
              ? 'bg-gradient-to-br from-accent/30 to-primary/20 border-2 border-accent shadow-lg shadow-accent/20'
              : state === 'listening'
                ? 'bg-gradient-to-br from-accent/60 to-accent/40 border-2 border-accent shadow-xl shadow-accent/40 animate-pulse'
                : state === 'processing'
                  ? 'bg-gradient-to-br from-primary/60 to-primary/40 border-2 border-primary shadow-xl shadow-primary/40'
                  : 'bg-gradient-to-br from-green-500/60 to-green-500/40 border-2 border-green-500 shadow-xl shadow-green-500/40'
          } flex items-center justify-center cursor-pointer`}
        >
          {state === 'idle' || state === 'processing' ? (
            <Mic2 className="w-8 h-8 text-accent" />
          ) : (
            <StopCircle className="w-8 h-8 text-white" />
          )}
        </button>

        {/* Cancel button */}
        {state !== 'idle' && (
          <button
            onClick={() => { window.speechSynthesis?.cancel(); setState('idle'); }}
            className="px-6 py-2.5 rounded-lg glass-panel border border-border/50 text-foreground hover:text-accent transition-all duration-300 text-sm"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Voice Selector Dropdown */}
      <div className="w-full mb-6">
        <div className="glass-panel p-4 border border-border/30">
          <div className="flex items-center gap-2 mb-3">
            <Volume2 className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold">Voice Profile</span>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full flex items-center justify-between bg-card/40 border border-border/30 rounded-lg px-4 py-3 hover:border-accent/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{currentVoice.accent}</span>
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">{currentVoice.name}</p>
                  <p className="text-xs text-muted-foreground">{currentVoice.description}</p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-xl border border-border/50 rounded-xl overflow-hidden z-50 shadow-2xl">
                {VOICE_OPTIONS.map(voice => (
                  <button
                    key={voice.id}
                    onClick={() => selectAccent(voice.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/10 transition-all ${
                      selectedAccent === voice.id ? 'bg-accent/10 border-l-2 border-accent' : ''
                    }`}
                  >
                    <span className="text-xl">{voice.accent}</span>
                    <div className="text-left flex-1">
                      <p className="text-sm font-medium text-foreground">{voice.name}</p>
                      <p className="text-xs text-muted-foreground">{voice.description}</p>
                    </div>
                    {selectedAccent === voice.id && (
                      <Check className="w-4 h-4 text-accent" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Voice Commands Tips */}
      <div className="glass-panel p-6 w-full border border-border/30">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Radio className="w-4 h-4 text-accent" />
          <h3 className="font-semibold text-foreground">Try Saying...</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tips.map((tip) => (
            <div
              key={tip.cmd}
              onClick={() => {
                speak(tip.cmd);
              }}
              className="p-3 rounded-lg bg-card/30 border border-border/30 hover:border-accent/50 hover:bg-card/50 cursor-pointer transition-all group"
            >
              <p className="text-sm text-foreground/70 group-hover:text-accent transition-colors">
                {tip.icon} {tip.cmd}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes ringPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        @keyframes corePulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes coreSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-corePulse {
          animation: corePulse 1.5s ease-in-out infinite;
        }
        .animate-coreSpin {
          animation: coreSpin 4s linear infinite;
        }
        .animate-spin-slow {
          animation: coreSpin 8s linear infinite;
        }
        .text-gradient {
          background: linear-gradient(135deg, #00c8ff, #0066ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
