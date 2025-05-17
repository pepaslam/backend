const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const categoryFolderPath = path.join(__dirname, "storage", "categoryList");

// Získání jedné kategorie podle ID
function get(categoryId) {
  try {
    const filePath = path.join(categoryFolderPath, `${categoryId}.json`);
    const fileData = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileData);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw { code: "failedToReadCategory", message: error.message };
  }
}

// Vytvoření nové kategorie
function create(category) {
  try {
    category.id = crypto.randomBytes(16).toString("hex");
    category.createdAt = new Date().toISOString();
    const filePath = path.join(categoryFolderPath, `${category.id}.json`);
    const fileData = JSON.stringify(category, null, 2);
    fs.writeFileSync(filePath, fileData, "utf8");
    return category;
  } catch (error) {
    throw { code: "failedToCreateCategory", message: error.message };
  }
}

// Aktualizace existující kategorie
function update(category) {
  try {
    const currentCategory = get(category.id);
    if (!currentCategory) return null;
    const newCategory = { ...currentCategory, ...category };
    const filePath = path.join(categoryFolderPath, `${category.id}.json`);
    const fileData = JSON.stringify(newCategory, null, 2);
    fs.writeFileSync(filePath, fileData, "utf8");
    return newCategory;
  } catch (error) {
    throw { code: "failedToUpdateCategory", message: error.message };
  }
}

// Odstranění kategorie podle ID
function remove(categoryId) {
  try {
    const filePath = path.join(categoryFolderPath, `${categoryId}.json`);
    fs.unlinkSync(filePath);
    return {};
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw { code: "failedToRemoveCategory", message: error.message };
  }
}

// Výpis všech kategorií
function list() {
  try {
    const files = fs.readdirSync(categoryFolderPath);
    const categoryList = files.map((file) => {
      const fileData = fs.readFileSync(path.join(categoryFolderPath, file), "utf8");
      return JSON.parse(fileData);
    });
    categoryList.sort((a, b) => a.name.localeCompare(b.name));
    return categoryList;
  } catch (error) {
    throw { code: "failedToListCategories", message: error.message };
  }
}

module.exports = {
  get,
  create,
  update,
  remove,
  list,
};


const categoryListPath = path.join(__dirname, "./storage/categoryList");

function list() {
    const files = fs.readdirSync(categoryListPath);
    const categories = files.map(file => {
        const content = fs.readFileSync(path.join(categoryListPath, file), "utf-8");
        return JSON.parse(content);
    });
    return categories;
}

module.exports = {
    list
};
