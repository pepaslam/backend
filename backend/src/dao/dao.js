const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const todoFolderPath = path.join(__dirname, "storage", "todoList");

// Method to get a single todo by ID
function get(todoId) {
  try {
    const filePath = path.join(todoFolderPath, `${todoId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadTodo", message: error.message };
  }
}

// Method to create a new todo
function create(todo) {
  try {
    todo.id = crypto.randomBytes(16).toString("hex");
    todo.createdAt = new Date().toISOString();
    todo.isCompleted = false; // default value
    const filePath = path.join(todoFolderPath, `${todo.id}.json`);
    const fileData = JSON.stringify(todo, null, 2);
    fs.writeFileSync(filePath, fileData, "utf8");
    return todo;
  } catch (error) {
    throw { code: "failedToCreateTodo", message: error.message };
  }
}

// Method to update an existing todo
function update(todo) {
  try {
    const currentTodo = get(todo.id);
    if (!currentTodo) return null;
    const newTodo = { ...currentTodo, ...todo };
    const filePath = path.join(todoFolderPath, `${todo.id}.json`);
    const fileData = JSON.stringify(newTodo, null, 2);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newTodo;
  } catch (error) {
    throw { code: "failedToUpdateTodo", message: error.message };
  }
}

// Method to delete a todo by ID
function remove(todoId) {
  try {
    const filePath = path.join(todoFolderPath, `${todoId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw { code: "failedToRemoveTodo", message: error.message };
  }
}

// Method to list all todos
function list(filter = {}) {
  try {
    const files = fs.readdirSync(todoFolderPath);
    let todoList = files.map((file) => {
      const fileData = fs.readFileSync(path.join(todoFolderPath, file), "utf8");
      return JSON.parse(fileData);
    });

    // Optional filtering by completion status
    if (typeof filter.isCompleted === "boolean") {
      todoList = todoList.filter((todo) => todo.isCompleted === filter.isCompleted);
    }

    // Optional filtering by category
    if (filter.category) {
      todoList = todoList.filter((todo) => todo.category === filter.category);
    }

    // Optional sorting by creation date
    todoList.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    return todoList;
  } catch (error) {
    throw { code: "failedToListTodos", message: error.message };
  }
}

module.exports = {
  get,
  create,
  update,
  remove,
  list,
};
