Task: Full-Stack Task Management Application (CRUD)
Build a simple full-stack web application that allows users to manage a list of tasks. The application must support Create, Read, Update, and Delete (CRUD) operations.
Requirements:

1. Tech Stack: MERN stack
2. Database:
   Set up a database to store tasks.
   A "Task" entity should have at least the following fields:
   • id (Unique identifier)
   • title (String, required)
   • description (String, optional)
   • is_completed (Boolean, default: false)
3. Backend (API):
   Create a RESTful API with the following endpoints:
   • GET /api/tasks - Retrieve a list of all tasks.
   • GET /api/tasks/:id - Retrieve a single task by ID.
   • POST /api/tasks - Create a new task.
   • PUT /api/tasks/:id - Update an existing task (e.g., mark as completed, edit title).
   • DELETE /api/tasks/:id - Delete a task.
4. Frontend (Ul):
   Create a user interface to interact with the API.
   The Ul should allow users to:
   • View all tasks in a list.
   • Add a new task (form with title and description).
   • Mark a task as complete/incomplete (e.g., a checkbox or button).
   • Edit an existing task's details.
   • Delete a task.
   Basic styling is expected, but complex design is not required. Focus on functionality.
5. Error Handling: Implement basic error handling on both the frontend (e.g., showing a message if the API request fails) and backend (e.g., returning appropriate HTTP status codes like 404 Not Found or 400 Bad Request).

Submission.

1. Initialize a Git repository for your project (monorepo or separate repositories for frontend/backend are both acceptable).
2. Commit your code.
3. Create a comprehensive READMEmd file explaining:
   • How to set up and run your application locally (including database setup, backend start, and frontend start commands).
   • A brief description of the tech stack chosen.
   Any environment variables required.
   • Briefly mention how you utilized Al to assist you in this task.
