const express = require("express");
const router = express.Router();

// Import ABL funkcí
const CreateAbl = require("../abl/createAbl");
const MarkAsCompletedAbl = require("../abl/markAsCompletedAbl");
const UpdateAbl = require("../abl/updateAbl");

// Definice endpointů
router.post("/create", CreateAbl);
router.post("/markAsCompleted", MarkAsCompletedAbl);
router.post("/update", UpdateAbl);

module.exports = router;
