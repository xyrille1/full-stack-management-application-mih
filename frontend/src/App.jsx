import { useEffect, useState } from 'react';
import * as api from './api/tasks.js';
import ErrorBanner from './components/ErrorBanner.jsx';
import TaskForm from './components/TaskForm.jsx';
import TaskList from './components/TaskList.jsx';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      setTasks(await api.getTasks());
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Each handler returns the saved task on success and null on failure, so the
  // child component knows whether to clear its form or stay in edit mode.
  const handleCreate = async (task) => {
    try {
      const created = await api.createTask(task);
      setTasks((prev) => [created, ...prev]);
      setError('');
      return created;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const handleToggle = async (task) => {
    try {
      const updated = await api.updateTask(task.id, { is_completed: !task.is_completed });
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setError('');
      return updated;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const handleUpdate = async (id, updates) => {
    try {
      const updated = await api.updateTask(id, updates);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setError('');
      return updated;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const remaining = tasks.filter((t) => !t.is_completed).length;

  return (
    <main className="app">
      <header className="app-header">
        <h1>Task Manager</h1>
        <p className="muted">
          {tasks.length} task{tasks.length === 1 ? '' : 's'} &middot; {remaining} remaining
        </p>
      </header>

      <ErrorBanner message={error} onDismiss={() => setError('')} />

      <TaskForm onCreate={handleCreate} />

      <section className="card">
        <h2>Your tasks</h2>
        <TaskList
          tasks={tasks}
          loading={loading}
          onToggle={handleToggle}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </section>
    </main>
  );
}
