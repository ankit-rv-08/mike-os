'use client';

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Plus, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';

interface Meeting {
  id: number;
  title: string;
  type: string;
  status: string;
  start_time: string;
}

export default function CalendarPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Meeting[]>([]); 
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const API_BASE = 'http://localhost:8787';
      const response = await fetch(`${API_BASE}/api/calendar`); 
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      const responseData = await response.json();
      let finalEvents: Meeting[] = [];

      if (Array.isArray(responseData)) {
        finalEvents = responseData;
      } else if (responseData?.data?.days) {
        finalEvents = responseData.data.days.flatMap((day: any) => 
          Array.isArray(day.events) ? day.events : []
        );
      } else if (responseData?.events) {
        finalEvents = responseData.events;
      }

      const validEvents = finalEvents.filter(event => 
        event && typeof event === 'object' && event.start_time
      );

      setEvents(validEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setEvents([]); 
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // 👉 ADDED: Function to handle manual button clicks
  const handleAddEvent = async (type: 'task' | 'event') => {
    const title = prompt(`Enter ${type} details (e.g., "Workout at 6PM"):`);
    if (!title) return;

    try {
      const API_BASE = 'http://localhost:8787';
      // Sending it to MIKE's brain so he saves it
      await fetch(`${API_BASE}/api/command`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: `Schedule a ${type}: ${title}`,
          sessionId: 'default'
        }),
      });
      
      // Refresh events immediately
      fetchEvents();
    } catch (error) {
      console.error('Failed to add event', error);
      alert("MIKE backend is unreachable.");
    }
  };

  if (!isMounted) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <span className="text-slate-500 font-mono text-sm flex items-center gap-2">
          <Loader2 className="animate-spin w-4 h-4" /> INITIALIZING CALENDAR...
        </span>
      </div>
    );
  }

  const filteredEvents = Array.isArray(events) 
    ? events.filter((event) => {
        if (!date) return false;
        const eventDate = new Date(event.start_time);
        return (
          eventDate.getDate() === date.getDate() &&
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getFullYear() === date.getFullYear()
        );
      })
    : [];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-6">
        
        <Card className="md:w-[400px] bg-black/40 border-slate-800 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2 text-blue-400">
              <CalendarIcon className="w-5 h-5" />
              Schedule Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border border-slate-800"
            />
          </CardContent>
        </Card>

        <Card className="flex-1 bg-black/40 border-slate-800 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-white">
                {date ? date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Select a date'}
              </CardTitle>
              <p className="text-slate-400 text-sm mt-1">Events and tasks for this timeline</p>
            </div>
            <div className="flex gap-2">
              {/* 👉 ADDED onClick behaviors */}
              <Button size="sm" variant="outline" className="border-slate-700 hover:bg-slate-800 text-white" onClick={() => handleAddEvent('task')}>
                <Plus className="w-4 h-4 mr-1" /> Add Task
              </Button>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white border-none" onClick={() => handleAddEvent('event')}>
                <Plus className="w-4 h-4 mr-1" /> Add Event
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <span className="text-slate-500 font-mono text-sm flex items-center gap-2">
                     <Loader2 className="animate-spin w-4 h-4" /> ACCESSING MIKE MEMORY...
                  </span>
                </div>
              ) : filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-blue-500/50 transition-all group"
                  >
                    <div className="flex gap-4 items-center">
                      <div className="text-sm font-mono text-blue-400 w-16 text-right">
                        {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                      </div>
                      <div className="w-px h-8 bg-slate-800 mx-2" />
                      <div>
                        <h4 className="font-semibold text-slate-100 group-hover:text-white">{event.title}</h4>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="secondary" className="bg-slate-800 text-[10px] uppercase tracking-wider text-slate-300 border-slate-700">
                            {event.type}
                          </Badge>
                          <Badge className="bg-blue-500/10 text-blue-400 border-none text-[10px] uppercase">
                            {event.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white hover:bg-blue-600/20">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/10">
                  <CalendarIcon className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">No events scheduled for this date.</p>
                  <p className="text-slate-600 text-sm mt-1 font-mono">STATUS: IDLE</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}