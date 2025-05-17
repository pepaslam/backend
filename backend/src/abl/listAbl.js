const categoryDao = require("../dao/categorydao");

function ListAbl(req, res) {
    try {
        const categoryList = categoryDao.list(); // použij tvou metodu
        res.json(categoryList);
    } catch (error) {
        res.status(500).json({ message: "Chyba při načítání kategorií", error });
    }
}

module.exports = ListAbl;
