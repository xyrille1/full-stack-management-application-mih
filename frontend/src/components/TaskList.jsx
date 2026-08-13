import TaskItem from './TaskItem.jsx';

export default function TaskList({ tasks, loading, onToggle, onUpdate, onDelete }) {
  if (loading) return <p className="muted">Loading tasks...</p>;

  if (tasks.length === 0) {
    return <p className="muted">No tasks yet. Add one above to get started.</p>;
  }

  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
