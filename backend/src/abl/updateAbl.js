const Ajv = require("ajv");
const ajv = new Ajv();

const todoDao = require("../dao/dao.js");

const schema = {
  type: "object",
  properties: {
    id: { type: "string" },
    title: { type: "string" },
    description: { type: "string" },
    category: { type: "string" },
    isCompleted: { type: "boolean" },
  },
  required: ["id"],
  additionalProperties: false,
};

async function UpdateAbl(req, res) {
  try {
    let todo = req.body;

    // validate input
    const valid = ajv.validate(schema, todo);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "Input data is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // update todo in persistent storage
    let updatedTodo;
    try {
      updatedTodo = todoDao.update(todo);
    } catch (e) {
      res.status(400).json({
        code: "todoUpdateFailed",
        message: e.message,
      });
      return;
    }

    if (!updatedTodo) {
      res.status(404).json({
        code: "todoNotFound",
        message: `Todo item with id ${todo.id} not found`,
      });
      return;
    }

    // return updated todo
    res.json(updatedTodo);
  } catch (e) {
    res.status(500).json({ code: "serverError", message: e.message });
  }
}

module.exports = UpdateAbl;
