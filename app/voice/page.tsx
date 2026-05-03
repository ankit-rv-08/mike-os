'use client';

import { useState } from 'react';
import { Mic2, StopCircle, Volume2 } from 'lucide-react';

type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

export default function VoicePage() {
  const [state, setState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState('');

  const handleMicClick = () => {
    if (state === 'idle') {
      setState('listening');
      // Simulate listening
      setTimeout(() => {
        setState('processing');
        setTranscript(
          'What is the weather in New York tomorrow?'
        );
        // Simulate processing and speaking
        setTimeout(() => {
          setState('speaking');
          setTimeout(() => {
            setState('idle');
          }, 3000);
        }, 1500);
      }, 2000);
    } else {
      setState('idle');
      setTranscript('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] max-w-2xl mx-auto">
      {/* Title */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-glow mb-2">Voice Assistant</h1>
        <p className="text-muted-foreground">
          {state === 'idle' && 'Click the microphone to start speaking'}
          {state === 'listening' && 'Listening to your voice...'}
          {state === 'processing' && 'Processing your request...'}
          {state === 'speaking' && 'Speaking response...'}
        </p>
      </div>

      {/* Central Waveform / Orb */}
      <div className="relative w-96 h-96 mb-12 flex items-center justify-center">
        {/* Background gradient orb */}
        <div
          className={`
            absolute inset-0 rounded-full
            ${
              state === 'idle'
                ? 'bg-gradient-to-br from-accent/10 to-primary/10'
                : 'bg-gradient-to-br from-accent/30 to-primary/30 animate-neon-pulse'
            }
          `}
        />

        {/* Animated waveform bars */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 px-12">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`
                w-2 rounded-full transition-all duration-200
                ${
                  state === 'listening' || state === 'speaking'
                    ? 'bg-accent animate-waveform'
                    : 'bg-border/50 h-2'
                }
              `}
              style={{
                height: state === 'idle' ? '8px' : `${Math.random() * 80 + 20}px`,
                animationDelay: `${i * 0.1}s`,
                opacity: state === 'idle' ? 0.5 : 1,
              }}
            />
          ))}
        </div>

        {/* Center indicator */}
        <div
          className={`
            absolute w-4 h-4 rounded-full
            ${
              state === 'idle'
                ? 'bg-border'
                : state === 'listening'
                  ? 'bg-accent animate-pulse'
                  : state === 'processing'
                    ? 'bg-primary animate-spin'
                    : 'bg-green-500 animate-pulse'
            }
          `}
        />
      </div>

      {/* Status Display */}
      <div className="glass-panel p-8 w-full mb-8">
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Status</p>
            <p className="text-lg font-semibold text-foreground capitalize">
              {state === 'idle' && '🎤 Ready'}
              {state === 'listening' && '🎧 Listening'}
              {state === 'processing' && '⚙️ Processing'}
              {state === 'speaking' && '🔊 Speaking'}
            </p>
          </div>

          {transcript && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                Transcript
              </p>
              <p className="text-foreground italic">&quot;{transcript}&quot;</p>
            </div>
          )}

          {state === 'speaking' && (
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                Response
              </p>
              <p className="text-foreground">
                The weather in New York tomorrow will be partly cloudy with a high of 72°F and a
                low of 58°F. There&apos;s a 20% chance of rain in the evening.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-6">
        <button
          onClick={handleMicClick}
          className={`
            flex items-center justify-center w-20 h-20 rounded-full transition-all duration-300
            ${
              state === 'idle'
                ? 'bg-accent/20 border-2 border-accent hover:bg-accent/30 hover:neon-glow cursor-pointer'
                : state === 'listening'
                  ? 'bg-accent/40 border-2 border-accent neon-glow-intense animate-neon-pulse'
                  : state === 'processing'
                    ? 'bg-primary/40 border-2 border-primary neon-glow-intense'
                    : 'bg-green-500/40 border-2 border-green-500 neon-glow-green-intense'
            }
          `}
        >
          {state === 'idle' || state === 'processing' ? (
            <Mic2 className={`w-8 h-8 ${state === 'idle' ? 'text-accent' : 'text-primary'}`} />
          ) : (
            <StopCircle className="w-8 h-8 text-accent" />
          )}
        </button>

        {state !== 'idle' && (
          <button
            onClick={handleMicClick}
            className="px-6 py-3 rounded-lg bg-card/40 border border-border/30 text-foreground hover:text-accent transition-all duration-300 hover:neon-glow text-sm font-medium"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-16 glass-panel p-6 w-full text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Volume2 className="w-4 h-4 text-accent" />
          <h3 className="font-semibold text-foreground">Voice Commands</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Try saying commands like:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
          {[
            '"What is my schedule today?"',
            '"Create a task for tomorrow"',
            '"Show me market updates"',
            '"Schedule a meeting"',
          ].map((cmd) => (
            <p key={cmd} className="text-sm text-foreground/70 font-mono">
              {cmd}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
