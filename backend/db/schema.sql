CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  due_date TEXT,
  domain TEXT DEFAULT 'work',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  completed_at TEXT
);

CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT,
  event_type TEXT DEFAULT 'meeting',
  linked_task_id INTEGER,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS habits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  domain TEXT NOT NULL,
  target_per_day INTEGER DEFAULT 1,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS performance_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  focus_minutes INTEGER DEFAULT 0,
  learning_minutes INTEGER DEFAULT 0,
  workouts_completed INTEGER DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  habits_completed INTEGER DEFAULT 0,
  steps INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS health_metrics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  water_liters REAL DEFAULT 0,
  sleep_hours REAL DEFAULT 0,
  weight_kg REAL,
  calories INTEGER DEFAULT 0,
  posture_minutes INTEGER DEFAULT 0,
  neck_training_minutes INTEGER DEFAULT 0,
  eye_discipline_score REAL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS user_preferences (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
