'use client';

import { useState } from 'react';
import { Plus, Calendar, User } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: string;
}

interface Column {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
}

const initialColumns: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    color: 'border-red-500/50 bg-red-500/10',
    tasks: [
      {
        id: '1',
        title: 'Design system updates',
        description: 'Update component library with new patterns',
        priority: 'high',
        assignee: 'Sarah',
        dueDate: '2024-05-15',
      },
      {
        id: '2',
        title: 'API documentation',
        description: 'Write comprehensive API docs',
        priority: 'medium',
        assignee: 'John',
        dueDate: '2024-05-20',
      },
    ],
  },
  {
    id: 'progress',
    title: 'In Progress',
    color: 'border-yellow-500/50 bg-yellow-500/10',
    tasks: [
      {
        id: '3',
        title: 'Database migration',
        description: 'Migrate to new PostgreSQL schema',
        priority: 'high',
        assignee: 'Alex',
        dueDate: '2024-05-12',
      },
      {
        id: '4',
        title: 'Performance optimization',
        description: 'Improve load times by 40%',
        priority: 'medium',
        assignee: 'Mike',
        dueDate: '2024-05-18',
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    color: 'border-green-500/50 bg-green-500/10',
    tasks: [
      {
        id: '5',
        title: 'Authentication system',
        description: 'Implement OAuth integration',
        priority: 'high',
        assignee: 'Lisa',
        dueDate: '2024-05-05',
      },
      {
        id: '6',
        title: 'Unit tests',
        description: 'Achieve 80% code coverage',
        priority: 'medium',
        assignee: 'Tom',
        dueDate: '2024-05-10',
      },
    ],
  },
];

const priorityColors = {
  low: 'border-blue-500/50 bg-blue-500/10 text-blue-300',
  medium: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-300',
  high: 'border-red-500/50 bg-red-500/10 text-red-300',
};

export default function ProjectsPage() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);

  const handleDragStart = (e: React.DragEvent, taskId: string, fromColumnId: string) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.setData('fromColumnId', fromColumnId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, toColumnId: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const fromColumnId = e.dataTransfer.getData('fromColumnId');

    if (fromColumnId !== toColumnId) {
      setColumns((prevColumns) => {
        const newColumns = prevColumns.map((col) => ({ ...col }));
        const fromCol = newColumns.find((c) => c.id === fromColumnId);
        const toCol = newColumns.find((c) => c.id === toColumnId);

        if (fromCol && toCol) {
          const task = fromCol.tasks.find((t) => t.id === taskId);
          if (task) {
            fromCol.tasks = fromCol.tasks.filter((t) => t.id !== taskId);
            toCol.tasks.push(task);
          }
        }

        return newColumns;
      });
    }
  };

  const totalTasks = columns.reduce((sum, col) => sum + col.tasks.length, 0);
  const completedTasks = columns.find((c) => c.id === 'done')?.tasks.length || 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-glow mb-2">Projects</h1>
          <p className="text-muted-foreground">Manage your tasks and project workflows</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 rounded-lg bg-card/40 border border-border/30 text-foreground hover:text-accent transition-colors duration-200 text-sm font-medium">
            Filters
          </button>
          <button className="px-4 py-2 rounded-lg bg-accent/20 border border-accent/50 text-accent hover:bg-accent/30 transition-colors duration-200 text-sm font-medium flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>
      </div>

      {/* Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Tasks', value: totalTasks, color: 'text-accent' },
          { label: 'In Progress', value: columns.find((c) => c.id === 'progress')?.tasks.length || 0, color: 'text-yellow-400' },
          { label: 'Completed', value: completedTasks, color: 'text-green-400' },
        ].map((stat, idx) => (
          <div key={idx} className="glass-panel p-6">
            <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div
            key={column.id}
            className={`glass-panel p-6 border-t-2 ${column.color} min-h-[600px] flex flex-col`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/30">
              <h2 className="text-lg font-semibold text-foreground">{column.title}</h2>
              <span className="text-sm px-2 py-1 rounded-full bg-card/50 text-muted-foreground">
                {column.tasks.length}
              </span>
            </div>

            {/* Tasks */}
            <div className="space-y-3 flex-1">
              {column.tasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id, column.id)}
                  className="p-4 bg-card/40 border border-border/30 rounded-lg hover:border-border/50 hover:neon-glow transition-all duration-300 cursor-move group"
                >
                  {/* Priority Badge */}
                  <div className="flex items-start justify-between mb-3">
                    <span className={`text-xs px-2 py-1 rounded font-medium ${priorityColors[task.priority]}`}>
                      {task.priority.toUpperCase()}
                    </span>
                  </div>

                  {/* Task Title */}
                  <h4 className="font-semibold text-foreground mb-2 group-hover:text-accent transition-colors duration-200">
                    {task.title}
                  </h4>

                  {/* Task Description */}
                  <p className="text-xs text-muted-foreground mb-3">{task.description}</p>

                  {/* Task Meta */}
                  <div className="space-y-2 pt-3 border-t border-border/20">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{task.dueDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <User className="w-3 h-3 text-muted-foreground" />
                      <span className="text-foreground">{task.assignee}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {column.tasks.length === 0 && (
                <div className="flex-1 flex items-center justify-center text-center">
                  <p className="text-sm text-muted-foreground opacity-50">Drag tasks here</p>
                </div>
              )}
            </div>

            {/* Add Task Button */}
            <button className="mt-4 w-full py-2 px-3 rounded-lg bg-card/30 border border-dashed border-border/30 text-muted-foreground hover:text-accent hover:border-accent/50 transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              Add
            </button>
          </div>
        ))}
      </div>

      {/* Project Details */}
      <div className="glass-panel-lg p-8 hover-glow">
        <h2 className="text-xl font-semibold text-foreground mb-6">Project Summary</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Progress */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Overall Progress</h4>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Completion</span>
                  <span className="text-sm font-semibold text-accent">
                    {Math.round((completedTasks / totalTasks) * 100)}%
                  </span>
                </div>
                <div className="w-full h-3 bg-card/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent to-primary"
                    style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Team */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Team Members</h4>
            <div className="flex items-center gap-3">
              {['Sarah', 'John', 'Alex', 'Mike'].map((member) => (
                <div
                  key={member}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-sm font-bold text-background"
                  title={member}
                >
                  {member.charAt(0)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
