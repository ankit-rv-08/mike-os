'use client';

import { useState } from 'react';
import { Mic2, StopCircle, Volume2, Radio } from 'lucide-react';

type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

export default function VoicePage() {
  const [state, setState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');

  const handleMicClick = () => {
    if (state === 'idle') {
      setState('listening');
      setTranscript('');
      setResponse('');
      // Simulate listening
      setTimeout(() => {
        setState('processing');
        setTranscript('What is the weather in New York tomorrow?');
        // Simulate processing and speaking
        setTimeout(() => {
          setState('speaking');
          setResponse('The weather in New York tomorrow will be partly cloudy with a high of 72°F and a low of 58°F. There\'s a 20% chance of rain in the evening.');
          setTimeout(() => {
            setState('idle');
          }, 4000);
        }, 1500);
      }, 2000);
    } else {
      setState('idle');
      setTranscript('');
      setResponse('');
    }
  };

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
