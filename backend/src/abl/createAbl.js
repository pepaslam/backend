const Ajv = require("ajv");
const ajv = new Ajv();

const todoDao = require("../dao/dao.js");

const schema = {
  type: "object",
  properties: {
    title: { type: "string" },
    description: { type: "string" },
    category: { type: "string" },
    isCompleted: { type: "boolean" },
  },
  required: ["title"],
  additionalProperties: false,
};

async function CreateAbl(req, res) {
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

    // store todo to persistent storage
    try {
      todo = todoDao.create(todo);
    } catch (e) {
      res.status(400).json({
        code: "todoCreateFailed",
        message: e.message,
      });
      return;
    }

    // return properly filled dtoOut
    res.json(todo);
  } catch (e) {
    res.status(500).json({ code: "serverError", message: e.message });
  }
}

module.exports = CreateAbl;
