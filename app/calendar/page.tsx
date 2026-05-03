'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, AlertCircle } from 'lucide-react';

const getDaysInMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

const getFirstDayOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

interface DayEvent {
  time: string;
  title: string;
  type: 'task' | 'meeting' | 'reminder';
  completed?: boolean;
  completion?: number;
}

const dayEvents: Record<number, DayEvent[]> = {
  15: [
    { time: '9:00 AM', title: 'Team Standup', type: 'meeting' },
    { time: '11:00 AM', title: 'Review PR #1234', type: 'task', completion: 60 },
    { time: '2:00 PM', title: 'Client Call', type: 'meeting' },
  ],
  16: [
    { time: '10:00 AM', title: 'Design Review', type: 'meeting' },
    { time: '3:00 PM', title: 'Project Planning', type: 'task', completion: 30 },
  ],
  20: [
    { time: '9:30 AM', title: 'Presentation', type: 'meeting' },
    { time: '4:00 PM', title: 'Finish report', type: 'task', completion: 100, completed: true },
  ],
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(16);

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const getCompletionPercentage = (day: number) => {
    const events = dayEvents[day] || [];
    if (events.length === 0) return 0;
    const completed = events.filter((e) => e.completed).length;
    return Math.round((completed / events.length) * 100);
  };

  const getDayColor = (day: number) => {
    const percentage = getCompletionPercentage(day);
    if (percentage === 100) return 'bg-green-500/20 border-green-500/50';
    if (percentage >= 50) return 'bg-yellow-500/20 border-yellow-500/50';
    if (dayEvents[day]?.length > 0) return 'bg-red-500/20 border-red-500/50';
    return '';
  };

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-glow mb-2">Calendar</h1>
        <p className="text-muted-foreground">Manage your schedule and tasks</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 glass-panel-lg p-8">
          {/* Month Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-foreground">{monthName}</h2>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
                  )
                }
                className="p-2 rounded-lg bg-card/40 border border-border/30 hover:bg-card/50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
              <button
                onClick={() =>
                  setCurrentDate(
                    new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
                  )
                }
                className="p-2 rounded-lg bg-card/40 border border-border/30 hover:bg-card/50 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </button>
            </div>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-semibold text-muted-foreground py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {emptyDays.map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}

            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`
                  aspect-square flex flex-col items-center justify-center rounded-lg
                  border transition-all duration-300 relative
                  ${
                    selectedDay === day
                      ? 'bg-accent/30 border-accent/50 neon-glow'
                      : dayEvents[day]?.length > 0
                        ? `${getDayColor(day)} border cursor-pointer hover:neon-glow`
                        : 'bg-card/30 border-border/20 hover:border-border/40'
                  }
                `}
              >
                <span className="text-sm font-semibold text-foreground">{day}</span>
                {dayEvents[day]?.length > 0 && (
                  <span className="text-xs text-muted-foreground mt-0.5">
                    {dayEvents[day].length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-8 pt-6 border-t border-border/30 grid grid-cols-3 gap-4">
            {[
              { color: 'bg-green-500/20', text: 'Complete' },
              { color: 'bg-yellow-500/20', text: '50%+' },
              { color: 'bg-red-500/20', text: '<50%' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded ${item.color}`} />
                <span className="text-xs text-muted-foreground">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Day Details Panel */}
        <div className="glass-panel p-8 h-fit">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-foreground mb-1">
              {currentDate.toLocaleString('default', { month: 'long' })} {selectedDay}
            </h3>
            <p className="text-sm text-muted-foreground">
              {currentDate.toLocaleString('default', { weekday: 'long' })}
            </p>
          </div>

          {/* Progress Bar */}
          {dayEvents[selectedDay] && dayEvents[selectedDay].length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">Progress</span>
                <span className="text-sm font-semibold text-accent">
                  {getCompletionPercentage(selectedDay)}%
                </span>
              </div>
              <div className="w-full h-2 bg-card/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-accent to-primary transition-all duration-500"
                  style={{ width: `${getCompletionPercentage(selectedDay)}%` }}
                />
              </div>
            </div>
          )}

          {/* Events List */}
          <div className="space-y-3 mb-6">
            {dayEvents[selectedDay]?.map((event, idx) => (
              <div
                key={idx}
                className={`
                  p-4 rounded-lg border transition-all duration-300
                  ${
                    event.type === 'meeting'
                      ? 'bg-blue-500/10 border-blue-500/30'
                      : event.type === 'task'
                        ? 'bg-purple-500/10 border-purple-500/30'
                        : 'bg-yellow-500/10 border-yellow-500/30'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">{event.time}</p>
                    <p className="text-sm font-medium text-foreground">{event.title}</p>
                    {event.completion !== undefined && (
                      <div className="mt-2 h-1.5 bg-card/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent"
                          style={{ width: `${event.completion}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {dayEvents[selectedDay]?.length === 0 && (
            <div className="text-center py-8">
              <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">No events scheduled</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            <button className="w-full py-2 px-4 rounded-lg bg-accent/20 text-accent border border-accent/50 hover:bg-accent/30 transition-colors duration-200 text-sm font-medium flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              Add Event
            </button>
            <button className="w-full py-2 px-4 rounded-lg bg-card/40 border border-border/30 text-foreground hover:text-accent transition-colors duration-200 text-sm font-medium">
              Add Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
