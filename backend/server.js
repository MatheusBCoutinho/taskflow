import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const app = express();
const folder = dirname(fileURLToPath(import.meta.url));
const db = new Database(process.env.DB_FILE || join(folder, 'tasks.db'));
db.pragma('journal_mode = WAL');
db.exec(`CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'todo' CHECK(status IN ('todo','doing','done')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)`);
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '20kb' }));

app.get('/api/health', (_, res) => res.json({ ok: true }));
app.get('/api/tasks', (_, res) => res.json(db.prepare('SELECT * FROM tasks ORDER BY id DESC').all()));
app.post('/api/tasks', (req, res) => {
  const { title, description = '' } = req.body || {};
  if (typeof title !== 'string' || !title.trim() || title.length > 120 || typeof description !== 'string' || description.length > 1000)
    return res.status(400).json({ error: 'Título ou descrição inválidos.' });
  const result = db.prepare('INSERT INTO tasks (title, description) VALUES (?, ?)').run(title.trim(), description);
  return res.status(201).json(db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid));
});
app.patch('/api/tasks/:id', (req, res) => {
  const { status } = req.body || {};
  if (!['todo', 'doing', 'done'].includes(status)) return res.status(400).json({ error: 'Status inválido.' });
  const result = db.prepare('UPDATE tasks SET status = ? WHERE id = ?').run(status, req.params.id);
  if (!result.changes) return res.status(404).json({ error: 'Tarefa não encontrada.' });
  return res.json(db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id));
});
app.delete('/api/tasks/:id', (req, res) => {
  const result = db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
  return res.status(result.changes ? 204 : 404).end();
});
app.use((err, req, res, next) => { console.error(err); res.status(500).json({ error: 'Erro interno' }); });
if (process.env.NODE_ENV !== 'test') app.listen(process.env.PORT || 3001, () => console.log('TaskFlow API em http://localhost:3001'));
export { app, db };
