'use client';

import { useEffect, useMemo, useState } from 'react';
import { Mic2, StopCircle, Volume2, Radio } from 'lucide-react';

type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

export default function VoicePage() {
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8787';
  const [state, setState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState('');

  const SpeechRecognitionApi = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
  }, []);

  const pickBritishMaleVoice = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices();
    const british = voices.filter((voice) => voice.lang.toLowerCase().startsWith('en-gb'));
    if (!british.length) return null;
    if (selectedVoiceName) {
      const selected = british.find((voice) => voice.name === selectedVoiceName);
      if (selected) return selected;
    }
    const maleHint = british.find((voice) =>
      /male|daniel|george|arthur|ryan|oliver/i.test(voice.name)
    );
    return maleHint || british[0];
  };

  const loadVoices = async () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const voices = window.speechSynthesis
      .getVoices()
      .filter((voice) => voice.lang.toLowerCase().startsWith('en-gb'));
    setAvailableVoices(voices);

    try {
      const res = await fetch(`${API_BASE}/api/voice-settings`);
      const json = await res.json();
      const saved = json?.voiceName || '';
      if (saved && voices.some((voice) => voice.name === saved)) {
        setSelectedVoiceName(saved);
      } else if (voices.length) {
        setSelectedVoiceName(voices[0].name);
      }
    } catch (_error) {
      if (voices.length) setSelectedVoiceName(voices[0].name);
    }
  };

  const persistVoiceSettings = async (voiceName: string) => {
    try {
      await fetch(`${API_BASE}/api/voice-settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voiceName,
          locale: 'en-GB',
          style: 'british-male',
        }),
      });
    } catch (_error) {
      // Keep local selection even if persistence fails.
    }
  };

  const speakResponse = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !text) {
      setState('idle');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB';
    utterance.pitch = 0.95;
    utterance.rate = 0.95;
    const voice = pickBritishMaleVoice();
    if (voice) utterance.voice = voice;

    utterance.onend = () => setState('idle');
    utterance.onerror = () => {
      setError('Text-to-speech failed. Please check browser voice permissions.');
      setState('idle');
    };
    window.speechSynthesis.speak(utterance);
  };

  const processCommand = async (input: string) => {
    setState('processing');
    try {
      const res = await fetch(`${API_BASE}/api/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, source: 'voice' }),
      });
      const data = await res.json();
      const reply =
        data?.result?.message || data?.response || data?.message || 'Command received.';
      setResponse(reply);
      setState('speaking');
      speakResponse(reply);
    } catch (_err) {
      setResponse('I could not reach the backend service right now.');
      setState('speaking');
      speakResponse('I could not reach the backend service right now.');
    }
  };

  const handleMicClick = () => {
    if (state === 'idle') {
      setError('');
      setState('listening');
      setTranscript('');
      setResponse('');

      if (!SpeechRecognitionApi) {
        setError('Speech recognition is not supported in this browser.');
        setState('idle');
        return;
      }

      const recognition = new SpeechRecognitionApi();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        const spokenText = event.results?.[0]?.[0]?.transcript?.trim() || '';
        if (!spokenText) {
          setError('No speech detected. Please try again.');
          setState('idle');
          return;
        }
        setTranscript(spokenText);
        void processCommand(spokenText);
      };

      recognition.onerror = () => {
        setError('Microphone input failed. Please allow microphone access.');
        setState('idle');
      };

      recognition.onend = () => {
        if (state === 'listening') setState('processing');
      };

      recognition.start();
    } else {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setState('idle');
      setTranscript('');
      setResponse('');
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const handleVoices = () => {
      void loadVoices();
    };
    window.speechSynthesis.onvoiceschanged = handleVoices;
    void loadVoices();
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] max-w-3xl mx-auto">
      {/* Title */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-glow mb-2">Voice Assistant</h1>
        <p className="text-muted-foreground text-lg transition-all duration-300">
          {state === 'idle' && 'Click the microphone to start speaking'}
          {state === 'listening' && 'Listening to your voice...'}
          {state === 'processing' && 'Processing your request...'}
          {state === 'speaking' && 'Responding...'}
        </p>
        {error && <p className="text-sm text-red-400 mt-3">{error}</p>}
      </div>

      {/* Central Siri-style Orb with Animated Rings */}
      <div className="relative w-80 h-80 mb-16 flex items-center justify-center">
        {/* Animated outer rings */}
        <div className={`absolute inset-0 rounded-full border-2 ${state !== 'idle' ? 'border-accent/40 animate-pulse' : 'border-border/20'} transition-all duration-300`} />
        <div className={`absolute inset-4 rounded-full border-2 ${state === 'listening' || state === 'speaking' ? 'border-accent/60' : 'border-border/20'} transition-all duration-300`} style={{ animationDelay: '0.1s' }} />
        <div className={`absolute inset-8 rounded-full border-2 ${state === 'listening' || state === 'speaking' ? 'border-accent/80' : 'border-border/20'} transition-all duration-300`} style={{ animationDelay: '0.2s' }} />

        {/* Background gradient orb */}
        <div
          className={`
            absolute inset-0 rounded-full transition-all duration-300
            ${
              state === 'idle'
                ? 'bg-gradient-to-br from-accent/10 to-primary/10'
                : state === 'listening'
                  ? 'bg-gradient-to-br from-accent/40 to-primary/30 animate-neon-pulse'
                  : state === 'processing'
                    ? 'bg-gradient-to-br from-primary/40 to-accent/30 animate-neon-pulse'
                    : 'bg-gradient-to-br from-green-500/40 to-primary/30 animate-neon-pulse'
            }
          `}
        />

        {/* Siri-style waveform bars */}
        <div className="absolute inset-0 flex items-center justify-center gap-1.5 px-16">
          {[...Array(15)].map((_, i) => {
            const isCenter = i === 7;
            return (
              <div
                key={i}
                className={`w-1.5 rounded-full transition-all duration-200 ${
                  state === 'listening' || state === 'speaking'
                    ? 'bg-gradient-to-t from-accent to-primary'
                    : state === 'processing'
                      ? 'bg-gradient-to-t from-primary to-accent'
                      : 'bg-border/50'
                }`}
                style={{
                  height: state === 'idle' ? '6px' : state === 'processing' ? `${Math.abs(Math.sin(i * 0.5) * 60 + 20)}px` : `${Math.abs(Math.sin(i * 0.3) * 70 + 25)}px`,
                  animationDelay: `${i * 0.08}s`,
                  opacity: state === 'idle' ? 0.4 : isCenter ? 1 : 0.8,
                }}
              />
            );
          })}
        </div>

        {/* Center pulsing dot */}
        <div
          className={`
            absolute w-5 h-5 rounded-full transition-all duration-300
            ${
              state === 'idle'
                ? 'bg-border/50'
                : state === 'listening'
                  ? 'bg-accent animate-pulse shadow-lg shadow-accent/50'
                  : state === 'processing'
                    ? 'bg-primary animate-spin shadow-lg shadow-primary/50'
                    : 'bg-green-500 animate-pulse shadow-lg shadow-green-500/50'
            }
          `}
        />
      </div>

      {/* Transcript Display - Siri-style */}
      {transcript && (
        <div className="glass-panel p-8 w-full mb-8 border border-accent/30 animate-fade-in">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-semibold">You Said</p>
          <p className="text-xl text-accent font-medium">&quot;{transcript}&quot;</p>
        </div>
      )}

      {/* Response Display */}
      {state === 'speaking' && response && (
        <div className="glass-panel p-8 w-full mb-8 border border-green-500/30 animate-fade-in">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-semibold">Response</p>
          <p className="text-lg text-foreground leading-relaxed">{response}</p>
          <div className="flex gap-1 mt-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-1 flex-1 bg-gradient-to-r from-green-500 to-accent rounded-full" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex items-center gap-6 mt-12">
        <button
          onClick={handleMicClick}
          className={`
            flex items-center justify-center w-24 h-24 rounded-full transition-all duration-300 
            shadow-lg hover:scale-110 active:scale-95
            ${
              state === 'idle'
                ? 'bg-gradient-to-br from-accent/30 to-primary/20 border-2 border-accent hover:from-accent/40 hover:to-primary/30 neon-glow cursor-pointer'
                : state === 'listening'
                  ? 'bg-gradient-to-br from-accent/50 to-accent/30 border-2 border-accent neon-glow-intense animate-neon-pulse'
                  : state === 'processing'
                    ? 'bg-gradient-to-br from-primary/50 to-primary/30 border-2 border-primary neon-glow-intense'
                    : 'bg-gradient-to-br from-green-500/50 to-green-500/30 border-2 border-green-500 neon-glow-green-intense'
            }
          `}
        >
          {state === 'idle' || state === 'processing' ? (
            <Mic2 className={`w-10 h-10 transition-all ${state === 'idle' ? 'text-accent' : 'text-primary'}`} />
          ) : (
            <StopCircle className="w-10 h-10 text-accent" />
          )}
        </button>

        {state !== 'idle' && (
          <button
            onClick={handleMicClick}
            className="px-8 py-3 rounded-lg glass-panel border border-border/50 text-foreground hover:text-accent transition-all duration-300 hover:neon-glow text-sm font-medium hover:scale-105 active:scale-95"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Voice Commands Suggestions */}
      <div className="mt-8 glass-panel p-5 w-full border border-border/30">
        <div className="flex items-center gap-2 mb-3">
          <Volume2 className="w-4 h-4 text-accent" />
          <p className="text-sm font-semibold text-foreground">Voice Output</p>
        </div>
        <label className="text-xs text-muted-foreground block mb-2">British Voice (Male Preferred)</label>
        <select
          className="w-full bg-card/40 border border-border/30 rounded-lg px-3 py-2 text-sm text-foreground"
          value={selectedVoiceName}
          onChange={(event) => {
            const voiceName = event.target.value;
            setSelectedVoiceName(voiceName);
            void persistVoiceSettings(voiceName);
          }}
        >
          {availableVoices.length === 0 && <option value="">No UK voices found on this device</option>}
          {availableVoices.map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
      </div>

      <div className="mt-16 glass-panel p-8 w-full border border-border/30">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Radio className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-foreground text-lg">Try Voice Commands</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6 text-center">
          Say any of these to get started:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { cmd: 'What is my schedule today?', icon: '📅' },
            { cmd: 'Create a task for tomorrow', icon: '✓' },
            { cmd: 'Show me market updates', icon: '📈' },
            { cmd: 'Schedule a meeting', icon: '🗓️' },
          ].map((item) => (
            <div key={item.cmd} className="p-3 rounded-lg bg-card/40 border border-border/30 hover:border-accent/50 transition-all hover:bg-card/60 cursor-pointer group">
              <p className="text-sm text-foreground/70 font-mono group-hover:text-accent transition-colors">
                {item.icon} {item.cmd}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
