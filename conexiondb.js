const mongoose = require("mongoose");
const db = async () => {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect("mongodb://127.0.0.1:27017/concesionariosDB", {});
    console.log("Conexión a MongoDB exitosa!");
  } catch (err) {
    console.error(`Error al conectarse a MongoDB ${err}`);
  }
};

module.exports = db;
