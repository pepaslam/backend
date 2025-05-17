const express = require("express");
const router = express.Router();

const CreateAbl = require("../abl/createAbl");
const ListAbl = require("../abl/listAbl"); 

router.post("/create", CreateAbl);
router.get("/list", ListAbl); 

module.exports = router;
