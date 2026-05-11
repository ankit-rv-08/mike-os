'use client';

import { useState, useEffect } from 'react';
import { Activity, Droplets, Moon, Dumbbell, Flame, HeartPulse } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function VitalsPage() {
  const [vitals, setVitals] = useState({ water: 0, sleep: 0, workoutDone: false });

  useEffect(() => {
    const saved = localStorage.getItem('mike_vitals');
    if (saved) setVitals(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('mike_vitals', JSON.stringify(vitals));
  }, [vitals]);

  const addWater = () => setVitals(prev => ({ ...prev, water: Math.min(prev.water + 1, 8) }));
  const resetWater = () => setVitals(prev => ({ ...prev, water: 0 }));
  const toggleWorkout = () => setVitals(prev => ({ ...prev, workoutDone: !prev.workoutDone }));
  
  return (
    <div className="p-6 max-w-5xl mx-auto animate-in fade-in duration-700 text-slate-200">
      <div className="mb-8 border-b border-slate-800 pb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-white uppercase tracking-widest">
            <HeartPulse className="text-pink-500 animate-pulse" /> Vitals_Telemetry
          </h1>
          <p className="text-cyan-500 font-mono text-xs mt-2 tracking-widest">BIOMETRIC OPTIMIZATION ENGINE</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Water Tracking */}
        <Card className="bg-black/60 border-slate-800/80 backdrop-blur-xl shadow-lg shadow-black">
          <CardContent className="p-6 text-center space-y-4">
            <Droplets className="w-10 h-10 text-cyan-500 mx-auto" />
            <h2 className="font-mono text-xs tracking-widest text-slate-400">HYDRATION (LITERS)</h2>
            <p className="text-4xl font-bold text-white">{vitals.water} <span className="text-sm text-slate-500">/ 8</span></p>
            
            <div className="w-full bg-slate-900 rounded-full h-2 mb-4 overflow-hidden">
              <div className="bg-cyan-500 h-2 transition-all duration-500" style={{ width: `${(vitals.water / 8) * 100}%` }}></div>
            </div>

            <div className="flex gap-2">
              <button onClick={addWater} className="flex-1 bg-cyan-600/20 border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black py-2 rounded text-xs font-bold transition">+ LOG</button>
              <button onClick={resetWater} className="bg-slate-800 text-slate-400 hover:text-white px-4 rounded text-xs transition">RESET</button>
            </div>
          </CardContent>
        </Card>

        {/* Workout Tracking */}
        <Card className="bg-black/60 border-slate-800/80 backdrop-blur-xl shadow-lg shadow-black">
          <CardContent className="p-6 text-center space-y-4">
            <Dumbbell className={`w-10 h-10 mx-auto transition-colors ${vitals.workoutDone ? 'text-green-500' : 'text-slate-600'}`} />
            <h2 className="font-mono text-xs tracking-widest text-slate-400">PHYSICAL EXERTION</h2>
            <p className={`text-2xl font-bold ${vitals.workoutDone ? 'text-green-500' : 'text-slate-500'}`}>
              {vitals.workoutDone ? 'COMPLETED' : 'PENDING'}
            </p>
            <div className="pt-6">
              <button 
                onClick={toggleWorkout} 
                className={`w-full py-3 rounded text-xs font-bold font-mono tracking-widest transition-all border ${vitals.workoutDone ? 'bg-green-600 border-green-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-green-500'}`}
              >
                {vitals.workoutDone ? 'MARK INCOMPLETE' : 'CONFIRM WORKOUT'}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Sleep Tracking */}
        <Card className="bg-black/60 border-slate-800/80 backdrop-blur-xl shadow-lg shadow-black">
          <CardContent className="p-6 text-center space-y-4">
            <Moon className="w-10 h-10 text-indigo-400 mx-auto" />
            <h2 className="font-mono text-xs tracking-widest text-slate-400">RECOVERY CYCLE (HRS)</h2>
            <div className="flex items-center justify-center gap-4">
              <button onClick={() => setVitals(p => ({ ...p, sleep: Math.max(0, p.sleep - 0.5) }))} className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-indigo-500">-</button>
              <p className="text-4xl font-bold text-white w-16">{vitals.sleep.toFixed(1)}</p>
              <button onClick={() => setVitals(p => ({ ...p, sleep: Math.min(12, p.sleep + 0.5) }))} className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-indigo-500">+</button>
            </div>
            <div className="pt-2">
              <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                {vitals.sleep < 6 ? 'WARNING: SEVERE DEFICIT' : vitals.sleep > 8 ? 'OPTIMAL RECOVERY' : 'ACCEPTABLE RANGE'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}