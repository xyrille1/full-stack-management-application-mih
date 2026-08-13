import { useState } from 'react';

export default function TaskItem({ task, onToggle, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? '');
  const [validationError, setValidationError] = useState('');

  const startEditing = () => {
    // Reset the draft from the task each time, so a previous Cancel cannot leak.
    setTitle(task.title);
    setDescription(task.description ?? '');
    setValidationError('');
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (title.trim() === '') {
      setValidationError('Title is required.');
      return;
    }

    const updated = await onUpdate(task.id, {
      title: title.trim(),
      description: description.trim(),
    });

    if (updated) setIsEditing(false);
  };

  if (isEditing) {
    return (
      <li className="task-item editing">
        <input
          type="text"
          value={title}
          aria-label="Edit title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          rows="2"
          value={description}
          aria-label="Edit description"
          placeholder="Description (optional)"
          onChange={(e) => setDescription(e.target.value)}
        />
        {validationError && <p className="field-error">{validationError}</p>}
        <div className="task-actions">
          <button type="button" className="primary" onClick={handleSave}>Save</button>
          <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      </li>
    );
  }

  return (
    <li className={`task-item${task.is_completed ? ' completed' : ''}`}>
      <label className="task-check">
        <input
          type="checkbox"
          checked={task.is_completed}
          onChange={() => onToggle(task)}
        />
        <span className="task-text">
          <span className="task-title">{task.title}</span>
          {task.description && <span className="task-description">{task.description}</span>}
        </span>
      </label>

      <div className="task-actions">
        <button type="button" onClick={startEditing}>Edit</button>
        <button type="button" className="danger" onClick={() => onDelete(task.id)}>Delete</button>
      </div>
    </li>
  );
}
