const Ajv = require("ajv");
const ajv = new Ajv();

const todoDao = require("../dao/dao.js");
const categoryDao = require("../dao/categorydao.js");

const schema = {
  type: "object",
  properties: {
    category: { type: "string" }, // název nebo ID kategorie
  },
  required: ["category"],
  additionalProperties: false,
};

async function MarkCategoryCompletedAbl(req, res) {
  try {
    const dtoIn = req.body;

    // Validate input
    const valid = ajv.validate(schema, dtoIn);
    if (!valid) {
      res.status(400).json({
        code: "dtoInIsNotValid",
        message: "Input data is not valid",
        validationError: ajv.errors,
      });
      return;
    }

    // Check if category exists
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

    // Find todos in the category
    const allTodos = todoDao.list();
    const todosInCategory = allTodos.filter(
      (todo) => todo.category === dtoIn.category
    );

    if (todosInCategory.length === 0) {
      res.status(200).json({
        message: `No todos found in category "${dtoIn.category}".`,
        updated: [],
      });
      return;
    }

    // Mark all as completed
    const updatedTodos = todosInCategory.map((todo) => {
      const updated = { ...todo, isCompleted: true };
      return todoDao.update(updated);
    });

    res.json({
      message: `Marked ${updatedTodos.length} todos as completed in category "${dtoIn.category}".`,
      updated: updatedTodos,
    });
  } catch (e) {
    res.status(500).json({
      code: "markCategoryCompletedFailed",
      message: e.message,
    });
  }
}

module.exports = MarkCategoryCompletedAbl;
