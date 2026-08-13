const BASE_URL = '/api/tasks';

const CONNECTION_MESSAGE = 'Cannot reach the server. Check that the backend is running.';

/**
 * Single fetch wrapper for every API call.
 *
 * On a non-2xx response it throws an Error carrying the server's own message,
 * so callers can surface a meaningful reason instead of a generic failure.
 */
const request = async (url, options = {}) => {
  let response;

  try {
    response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    // fetch only rejects on a genuine network failure (server down, DNS, CORS).
    throw new Error(CONNECTION_MESSAGE);
  }

  // The body may be empty, or HTML from a proxy, so never parse unguarded.
  const text = await response.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }

  if (!response.ok) {
    // The API always answers with { error }. A 5xx without one means the
    // request never got there - typically the dev proxy reporting it is down.
    if (!body?.error && response.status >= 500) {
      throw new Error(CONNECTION_MESSAGE);
    }
    throw new Error(body?.error || `Request failed (${response.status})`);
  }

  return body;
};

export const getTasks = () => request(BASE_URL);

export const getTask = (id) => request(`${BASE_URL}/${id}`);

export const createTask = (task) =>
  request(BASE_URL, { method: 'POST', body: JSON.stringify(task) });

export const updateTask = (id, updates) =>
  request(`${BASE_URL}/${id}`, { method: 'PUT', body: JSON.stringify(updates) });

export const deleteTask = (id) => request(`${BASE_URL}/${id}`, { method: 'DELETE' });
