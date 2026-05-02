import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'habits.db';

export interface Habit {
  id: number;
  name: string;
  reminder_time: string | null;
  created_at: string;
}

export interface Completion {
  habit_id: number;
  date: string;
  completed: boolean;
}

let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async () => {
  if (db) return db;
  
  db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      reminder_time TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS completions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habit_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      completed INTEGER DEFAULT 1,
      UNIQUE(habit_id, date),
      FOREIGN KEY (habit_id) REFERENCES habits (id) ON DELETE CASCADE
    );
  `);
  
  return db;
};

export const getHabits = async (): Promise<Habit[]> => {
  const database = await initDatabase();
  return await database.getAllAsync<Habit>('SELECT * FROM habits ORDER BY created_at DESC');
};

export const addHabit = async (name: string, reminderTime: string | null): Promise<number> => {
  const database = await initDatabase();
  const result = await database.runAsync(
    'INSERT INTO habits (name, reminder_time) VALUES (?, ?)',
    name,
    reminderTime
  );
  return result.lastInsertRowId;
};

export const deleteHabit = async (id: number) => {
  const database = await initDatabase();
  await database.runAsync('DELETE FROM habits WHERE id = ?', id);
};

export const toggleCompletion = async (habitId: number, date: string, completed: boolean) => {
  const database = await initDatabase();
  if (completed) {
    await database.runAsync(
      'INSERT OR REPLACE INTO completions (habit_id, date, completed) VALUES (?, ?, 1)',
      habitId,
      date
    );
  } else {
    await database.runAsync(
      'DELETE FROM completions WHERE habit_id = ? AND date = ?',
      habitId,
      date
    );
  }
};

export const getCompletionsForDate = async (date: string): Promise<number[]> => {
  const database = await initDatabase();
  const rows = await database.getAllAsync<{ habit_id: number }>(
    'SELECT habit_id FROM completions WHERE date = ? AND completed = 1',
    date
  );
  return rows.map(row => row.habit_id);
};

export const getHeatmapData = async (days: number): Promise<{ date: string; count: number }[]> => {
  const database = await initDatabase();
  const rows = await database.getAllAsync<{ date: string; count: number }>(
    `SELECT date, COUNT(*) as count 
     FROM completions 
     WHERE date >= date('now', '-' || ? || ' days')
     GROUP BY date`,
    days
  );
  return rows;
};

export const getHabitsCount = async (): Promise<number> => {
  const database = await initDatabase();
  const result = await database.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM habits');
  return result?.count || 0;
};
