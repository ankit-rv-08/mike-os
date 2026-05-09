'use client';

import { useEffect, useState, useRef } from 'react';
import { Mic, Radio, Volume2, ChevronDown, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VOICE_PROFILES = [
  { id: 'british-male', label: 'British Male' },
  { id: 'british-female', label: 'British Female' },
  { id: 'american-male', label: 'American Male' },
  { id: 'american-female', label: 'American Female' },
  { id: 'european-male', label: 'European Male' },
  { id: 'european-female', label: 'European Female' },
  { id: 'russian-male', label: 'Russian Male' },
  { id: 'japanese-male', label: 'Japanese Male' },
];

export default function VoicePage() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [voiceProfile, setVoiceProfile] = useState('british-male');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const greetings = [
    "Voice protocols initialized. Awaiting your command, Ankith.",
    "Neural link active. What is our primary objective today?",
    "Systems online. How can I assist you, sir?",
    "I'm listening, Ankith. What's on your mind?",
    "Audio interface secure. Ready when you are."
  ];

  // Helper function to smartly find the right voice based on OS
  const getSelectedVoice = (voices: SpeechSynthesisVoice[], profile: string) => {
    const isMale = (v: SpeechSynthesisVoice) => 
      v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('mark') || v.name.toLowerCase().includes('arthur');
    const isFemale = (v: SpeechSynthesisVoice) => 
      v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('victoria');

    let match;
    switch(profile) {
      case 'british-male':
        match = voices.find(v => v.lang.includes('en-GB') && isMale(v)) || voices.find(v => v.lang.includes('en-GB'));
        break;
      case 'british-female':
        match = voices.find(v => v.lang.includes('en-GB') && isFemale(v)) || voices.find(v => v.lang.includes('en-GB'));
        break;
      case 'american-male':
        match = voices.find(v => v.lang.includes('en-US') && isMale(v)) || voices.find(v => v.lang.includes('en-US'));
        break;
      case 'american-female':
        match = voices.find(v => v.lang.includes('en-US') && isFemale(v)) || voices.find(v => v.lang.includes('en-US'));
        break;
      case 'european-male': // Using French/German for European accent
        match = voices.find(v => (v.lang.includes('fr-') || v.lang.includes('de-')) && isMale(v)) || voices.find(v => v.lang.includes('fr-') || v.lang.includes('de-'));
        break;
      case 'european-female':
        match = voices.find(v => (v.lang.includes('fr-') || v.lang.includes('de-')) && isFemale(v)) || voices.find(v => v.lang.includes('fr-') || v.lang.includes('de-'));
        break;
      case 'russian-male':
        match = voices.find(v => v.lang.includes('ru-') && isMale(v)) || voices.find(v => v.lang.includes('ru-'));
        break;
      case 'japanese-male':
        match = voices.find(v => v.lang.includes('ja-') && isMale(v)) || voices.find(v => v.lang.includes('ja-'));
        break;
    }
    return match || voices[0]; // Fallback to system default if not found
  };

  const speak = (text: string, forceProfile?: string) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 0.9; 
    utterance.rate = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const voiceToUse = getSelectedVoice(voices, forceProfile || voiceProfile);
    
    if (voiceToUse) {
      utterance.voice = voiceToUse;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
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

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [hasGreeted]); // Removed 'greetings' from dependency array

  const handleManualTrigger = () => {
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    speak(randomGreeting);
  };

  const handleVoiceChange = (id: string) => {
    setVoiceProfile(id);
    setIsDropdownOpen(false);
    // Give immediate feedback in the new voice
    speak("Voice profile updated. Systems nominal.", id);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 items-center justify-center relative overflow-hidden">
      
      {/* Background glow when speaking */}
      <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(168,85,247,0.15)_0%,_transparent_50%)] transition-opacity duration-700 ${isSpeaking ? 'opacity-100' : 'opacity-0'}`} />

      {/* Settings Dropdown (Top Right) */}
      <div className="absolute top-6 right-6 z-50">
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/10 hover:border-white/20 rounded-lg text-xs font-mono text-zinc-300 transition-colors backdrop-blur-md"
          >
            <Settings2 size={14} className="text-cyan-400" />
            {VOICE_PROFILES.find(v => v.id === voiceProfile)?.label}
            <ChevronDown size={14} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-[#09090b] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1"
              >
                {VOICE_PROFILES.map((profile) => (
                  <button
                    key={profile.id}
                    onClick={() => handleVoiceChange(profile.id)}
                    className={`w-full text-left px-4 py-2 text-xs font-mono hover:bg-white/5 transition-colors ${
                      voiceProfile === profile.id ? 'text-cyan-400 bg-white/5' : 'text-zinc-400'
                    }`}
                  >
                    {profile.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

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

        {/* Visualizer bars */}
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