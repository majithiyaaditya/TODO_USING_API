const API_URL = "https://api.freeapi.app/api/v1/todos";

const form = document.querySelector("#todo-form");
const titleInput = document.querySelector("#title");
const descriptionInput = document.querySelector("#description");
const todoList = document.querySelector("#todo-list");
const submitButton = document.querySelector("#submit-button");
const emptyMessage = document.querySelector("#empty-message");
const statusMessage = document.querySelector("#status-message");

let todos = [];
let editingId = null;

// Show a message
function setStatus(message) {
  statusMessage.textContent = message;
}

// Send API requests
async function sendRequest(url, options = {}) {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  if (options.method === "DELETE" || response.status === 204) {
    return null;
  }

  return response.json();
}

// Get and display tasks
async function refreshTodos() {
  const result = await sendRequest(API_URL);

  if (!Array.isArray(result.data)) {
    throw new Error("Invalid task list.");
  }

  todos = result.data;
  renderTodos();
}

// Display tasks
function renderTodos() {
  todoList.replaceChildren();
  emptyMessage.hidden = todos.length > 0;

  todos.forEach((todo) => {
    const item = document.createElement("li");
    const title = document.createElement("h3");
    const description = document.createElement("p");
    const editButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    title.textContent = todo.title;
    description.textContent = todo.description || "";

    editButton.textContent = "Edit";
    deleteButton.textContent = "Delete";
    editButton.type = deleteButton.type = "button";

    // Edit task
    editButton.addEventListener("click", () => {
      titleInput.value = todo.title;
      descriptionInput.value = todo.description || "";
      editingId = todo._id;
      submitButton.textContent = "Save Changes";
      titleInput.focus();
      setStatus(`Editing "${todo.title}".`);
    });

    // Delete task
    deleteButton.addEventListener("click", async () => {
      try {
        await sendRequest(`${API_URL}/${todo._id}`, {
          method: "DELETE",
        });

        if (editingId === todo._id) resetForm();

        await refreshTodos();
        setStatus("To-do deleted.");
      } catch (error) {
        setStatus(`Delete failed: ${error.message}`);
      }
    });

    item.append(title, description, editButton, deleteButton);
    todoList.appendChild(item);
  });
}

// Clear the form
function resetForm() {
  form.reset();
  editingId = null;
  submitButton.textContent = "Add To-Do";
}

// Add or update a task
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!title) {
    setStatus("Please enter a title.");
    titleInput.focus();
    return;
  }

  // Editing Logic
  const isEditing = editingId !== null;
  const url = isEditing ? `${API_URL}/${editingId}` : `${API_URL}/`;

  try {
    await sendRequest(url, {
      method: isEditing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    await refreshTodos();
    resetForm();

    setStatus(isEditing ? "To-do updated." : "To-do added.");
  } catch (error) {
    setStatus(`Request failed: ${error.message}`);
  }
});

// Load tasks when the page opens
refreshTodos().catch((error) => {
  setStatus(`Could not load tasks: ${error.message}`);
});
