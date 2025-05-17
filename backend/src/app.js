const express = require("express");
const app = express();
const port = 8888;

const todoController = require("./controller/task");
const categoryController = require("./controller/taskCategory");

app.use(express.json()); // Podpora JSON
app.use(express.urlencoded({ extended: true })); // Podpora x-www-form-urlencoded

// Základní testovací endpoint
app.get("/", (req, res) => {
  res.send("To-Do List API is running!");
});

// Připojení controllerů
app.use("/todo", todoController);
app.use("/category", categoryController);

// Spuštění serveru
app.listen(port, () => {
  console.log(`To-Do app listening on port ${port}`);
});
