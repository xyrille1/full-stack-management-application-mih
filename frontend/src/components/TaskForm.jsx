import { useState } from 'react';

export default function TaskForm({ onCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [validationError, setValidationError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Mirrors the API's own 400 so the user gets feedback without a round trip.
    if (title.trim() === '') {
      setValidationError('Title is required.');
      return;
    }

    setValidationError('');
    setSubmitting(true);

    const created = await onCreate({ title: title.trim(), description: description.trim() });

    setSubmitting(false);

    // Only clear the form if the task actually saved.
    if (created) {
      setTitle('');
      setDescription('');
    }
  };

  return (
    <form className="task-form card" onSubmit={handleSubmit}>
      <h2>Add a task</h2>

      <label htmlFor="title">Title</label>
      <input
        id="title"
        type="text"
        value={title}
        placeholder="What needs doing?"
        onChange={(e) => setTitle(e.target.value)}
      />

      <label htmlFor="description">Description <span className="hint">(optional)</span></label>
      <textarea
        id="description"
        rows="2"
        value={description}
        placeholder="Any extra detail"
        onChange={(e) => setDescription(e.target.value)}
      />

      {validationError && <p className="field-error">{validationError}</p>}

      <button type="submit" className="primary" disabled={submitting}>
        {submitting ? 'Adding...' : 'Add task'}
      </button>
    </form>
  );
}
