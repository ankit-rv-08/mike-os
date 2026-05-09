'use client';

import { useEffect, useState, useRef } from 'react';
import { Mic, Activity, Radio, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function VoicePage() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const voicesLoaded = useRef(false);

  // Jarvis-style personalized greetings
  const greetings = [
    "Voice protocols initialized. Awaiting your command, Ankith.",
    "Neural link active. What is our primary objective today?",
    "Systems online. How can I assist you, sir?",
    "I'm listening, Ankith. What's on your mind?",
    "Audio interface secure. Ready when you are."
  ];

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Tweak to make it sound more like an AI/Jarvis
    utterance.pitch = 0.9; 
    utterance.rate = 1.0;

    // Fetch available voices
    const voices = window.speechSynthesis.getVoices();
    
    // Try to find a British Male voice (e.g., 'Google UK English Male', 'Daniel', etc.)
    const britishVoice = 
      voices.find(v => v.lang === 'en-GB' && v.name.toLowerCase().includes('male')) || 
      voices.find(v => v.name.toLowerCase().includes('google uk english male')) ||
      voices.find(v => v.lang === 'en-GB') || 
      voices[0]; // Fallback to whatever is default

    if (britishVoice) {
      utterance.voice = britishVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    // Browsers load voices asynchronously. We need to wait for them.
    const loadVoicesAndGreet = () => {
      if (!hasGreeted) {
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        speak(randomGreeting);
        setHasGreeted(true);
      }
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      loadVoicesAndGreet();
    } else {
      window.speechSynthesis.onvoiceschanged = loadVoicesAndGreet;
    }

    // Cleanup on unmount
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [hasGreeted]);

  const handleManualTrigger = () => {
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    speak(randomGreeting);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 items-center justify-center relative overflow-hidden">
      
      {/* Background glow when speaking */}
      <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.15)_0%,_transparent_50%)] transition-opacity duration-700 ${isSpeaking ? 'opacity-100' : 'opacity-0'}`} />

      <div className="relative z-10 flex flex-col items-center">
        
        {/* Status Header */}
        <div className="mb-12 flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
          {isSpeaking ? (
            <Volume2 size={16} className="text-purple-400 animate-pulse" />
          ) : (
            <Radio size={16} className="text-cyan-400" />
          )}
          <span className="text-xs font-mono tracking-[0.2em] uppercase text-zinc-300">
            {isSpeaking ? "MIKE is transmitting..." : "Awaiting Audio Input"}
          </span>
        </div>

        {/* Central Voice UI */}
        <div className="relative flex items-center justify-center w-64 h-64 mb-12">
          {/* Ripple effects when speaking */}
          {isSpeaking && (
            <>
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full border border-purple-500/50"
              />
              <motion.div 
                animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                className="absolute inset-0 rounded-full border border-purple-400/30"
              />
            </>
          )}

          {/* Main Button */}
          <button 
            onClick={handleManualTrigger}
            className={`relative z-10 flex items-center justify-center w-32 h-32 rounded-full backdrop-blur-md transition-all duration-500 shadow-2xl ${
              isSpeaking 
                ? 'bg-purple-500/20 border-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.4)]' 
                : 'bg-black/60 border-white/10 hover:border-cyan-500/50 hover:bg-cyan-500/10 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]'
            } border-2`}
          >
            <Mic 
              size={40} 
              className={`transition-colors duration-500 ${isSpeaking ? 'text-purple-400' : 'text-zinc-400'}`} 
            />
          </button>
        </div>

        {/* Visualizer bars (aesthetic) */}
        <div className="flex items-center gap-1 h-12">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              animate={isSpeaking ? {
                height: ["10%", "100%", "30%", "80%", "10%"],
              } : {
                height: "10%"
              }}
              transition={isSpeaking ? {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.1
              } : {}}
              className={`w-1.5 rounded-full ${isSpeaking ? 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]' : 'bg-zinc-800'}`}
              style={{ height: '10%' }}
            />
          ))}
        </div>

        <p className="mt-12 text-sm text-zinc-500 font-mono text-center max-w-md">
          {isSpeaking ? "Analyzing environmental parameters..." : "Click the central node to re-initialize voice handshake."}
        </p>
      </div>
    </div>
  );
}