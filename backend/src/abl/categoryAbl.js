const Ajv = require("ajv");
const ajv = new Ajv();

const todoDao = require("../dao/dao.js");
const categoryDao = require("../dao/categorydao.js");

const schema = {
  type: "object",
  properties: {
    todoId: { type: "string" },
    category: { type: "string" }, // nebo třeba categoryId, záleží na implementaci
  },
  required: ["todoId", "category"],
  additionalProperties: false,
};

async function AssignCategoryAbl(req, res) {
  try {
    const dtoIn = req.body;

    // validate input
    const valid = ajv.validate(schema, dtoIn);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "Input data is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // check if todo exists
    const todo = todoDao.get(dtoIn.todoId);
    if (!todo) {
      res.status(404).json({
        code: "todoNotFound",
        message: `Todo item with id ${dtoIn.todoId} not found`,
      });
      return;
    }

    // check if category exists
    const categoryList = categoryDao.list();
    const categoryExists = categoryList.some(
      (cat) => cat.id === dtoIn.category || cat.name === dtoIn.category
    );

    if (!categoryExists) {
      res.status(404).json({
        code: "categoryNotFound",
        message: `Category "${dtoIn.category}" not found`,
      });
      return;
    }

    // assign category
    const updatedTodo = todoDao.update({
      ...todo,
      category: dtoIn.category,
    });

    res.json(updatedTodo);
  } catch (e) {
    res.status(500).json({
      code: "assignCategoryFailed",
      message: e.message,
    });
  }
}

module.exports = AssignCategoryAbl;
