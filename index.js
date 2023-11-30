/**
 * Tres formas de almacenar valores en memoria en javascript:
 *      let: se puede modificar
 *      var: se puede modificar
 *      const: es constante y no se puede modificar
 */

// Importamos las bibliotecas necesarias.
// Concretamente el framework express.
const express = require("express");
//Importamos la biblioteca mongoose
const mongoose = require("mongoose");
//Importamos helmet
const helmet = require("helmet");

// Inicializamos la aplicación
const app = express();

// Indicamos que la aplicación puede recibir JSON (API Rest)
app.use(express.json());
// Utilizamos helmet para proteger nuestra API contra ataques CSRF, XSS, etc...
app.use(helmet());

//Conectamos con la base de datos
mongoose.connect("mongodb://localhost:27017/concesionariosDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// Indicamos el puerto en el que vamos a desplegar la aplicación
const port = process.env.PORT || 8080;

// Arrancamos la aplicación
app.listen(port, () => {
  console.log(`Servidor desplegado en puerto: ${port}`);
});

// definimos una estructura para los concesionarios
const concesionarioSchema = new mongoose.Schema({
  nombre: String,
  direccion: String,
  coches: [
    {
      modelo: String,
      cv: Number,
      precio: Number,
    },
  ],
});

//Definimos un modelo del esquema
const ConcesionarioModelo = mongoose.model("Concesionario", concesionarioSchema);

// Obtener todos los concesionarios
app.get("/concesionarios", async (req, res) => {
  try {
    const concesionarios = await Concesionario.find();
    res.json(concesionario);
  } catch (error) {
    res.status(500).send("Error al obtener los concesionarios");
  }
});

// Crear un nuevo concesionario
app.post("/concesionarios", async (req, res) => {
  try {
    const nuevoConcesionario = new Concesionario(req.body);
    await nuevoConcesionario.save();
    res.json({ message: "Concesionario añadido correctamente", concesionario: nuevoConcesionario });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el concesionario" });
  }
});

// Definimos una estructura de datos
// (temporal hasta incorporar una base de datos)
let concesionarios = [
  {
    id: 1,
    nombre: "Premium car",
    direccion: "Calle Rumania 4",
    coches: [
      { id: 1, modelo: "Audi A3", cv: 110, precio: 29000 },
      { id: 2, modelo: "Fiat 500", cv: 90, precio: 15000 },
    ],
  },
  {
    id: 2,
    nombre: "RM Motor",
    direccion: "Ronda de Toledo 14",
    coches: [
      { id: 1, modelo: "Honda Civic", cv: 95, precio: 12500 },
      { id: 2, modelo: "BMW Serie 3", cv: 180, precio: 40000 },
    ],
  },
  {
    id: 3,
    nombre: "INNIAUTO",
    direccion: "Calle Roble 5",
    coches: [
      { id: 1, modelo: "Seat Ibiza", cv: 80, precio: 8500 },
      { id: 2, modelo: "Ford Focus", cv: 140, precio: 19000 },
    ],
  },
];

// Obtener todos los concesionarios
app.get("/concesionarios", (req, res) => {
  res.json(concesionarios);
});

// Crea un nuevo concesionario
app.post("/concesionarios", (req, res) => {
  const nuevoConcesionario = req.body;
  nuevoConcesionario.id = concesionarios.length + 1;
  concesionarios.push(nuevoConcesionario);
  res.json({ message: "Concesionario añadido correctamente", concesionario: nuevoConcesionario });
});

// Obtener un concesionario
app.get("/concesionarios/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const concesionario = concesionarios.find((c) => c.id === id);

  if (concesionario) {
    res.json(concesionario);
  } else {
    res.status(404).json({ message: "Concesionario no encontrado" });
  }
});

// Actualiza un concesionario
app.put("/concesionarios/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const concesionarioIndex = concesionarios.findIndex((c) => c.id === id);

  if (concesionarioIndex !== -1) {
    concesionarios[concesionarioIndex] = { ...concesionarios[concesionarioIndex], ...req.body };
    res.json({
      message: "Concesionario actualizado correctamente",
      concesionario: concesionarios[concesionarioIndex],
    });
  } else {
    res.status(404).json({ message: "Concesionario no encontrado" });
  }
});

// Borra un concesionario
app.delete("/concesionarios/:id", (req, res) => {
  const id = parseInt(req.params.id);
  concesionarios = concesionarios.filter((c) => c.id !== id);
  res.json({ message: "Concesionario eliminado correctamente" });
});

// Devuelve todos los coches del concesionario pasados por id
app.get("/concesionarios/:id/coches", (req, res) => {
  const id = parseInt(req.params.id);
  const concesionario = concesionarios.find((c) => c.id === id);

  if (concesionario) {
    res.json(concesionario.coches);
  } else {
    res.status(404).json({ message: "Concesionario no encontrado" });
  }
});

// Añade un nuevo coche a un concesionario para por id
app.post("/concesionarios/:id/coches", (req, res) => {
  const id = parseInt(req.params.id);
  const concesionario = concesionarios.find((c) => c.id === id);

  if (concesionario) {
    const nuevoCoche = req.body;
    nuevoCoche.id = concesionario.coches.length + 1;
    concesionario.coches.push(nuevoCoche);
    res.json({ message: "Coche añadido correctamente", coche: nuevoCoche });
  } else {
    res.status(404).json({ message: "Concesionario no encontrado" });
  }
});

// Obtiene el coche cuyo id sea cocheid, del concesionario pasado por id
app.get("/concesionarios/:id/coches/:cocheId", (req, res) => {
  const id = parseInt(req.params.id);
  const cocheId = parseInt(req.params.cocheId);
  const concesionario = concesionarios.find((c) => c.id === id);

  if (concesionario) {
    const coche = concesionario.coches.find((c) => c.id === cocheId);
    if (coche) {
      res.json(coche);
    } else {
      res.status(404).json({ message: "Coche no encontrado" });
    }
  } else {
    res.status(404).json({ message: "Concesionario no encontrado" });
  }
});

// Actualiza el coche cuyo id sea cocheid, del concesionario pasado por id
app.put("/concesionarios/:id/coches/:cocheId", (req, res) => {
  const id = parseInt(req.params.id);
  const cocheId = parseInt(req.params.cocheId);
  const concesionario = concesionarios.find((c) => c.id === id);

  if (concesionario) {
    const cocheIndex = concesionario.coches.findIndex((c) => c.id === cocheId);
    if (cocheIndex !== -1) {
      concesionario.coches[cocheIndex] = { ...concesionario.coches[cocheIndex], ...req.body };
      res.json({
        message: "Coche actualizado correctamente",
        coche: concesionario.coches[cocheIndex],
      });
    } else {
      res.status(404).json({ message: "Coche no encontrado" });
    }
  } else {
    res.status(404).json({ message: "Concesionario no encontrado" });
  }
});

// Borra el coche cuyo id sea coche id, del concesionario pasado por id
app.delete("/concesionarios/:id/coches/:cocheId", (req, res) => {
  const id = parseInt(req.params.id);
  const cocheId = parseInt(req.params.cocheId);
  const concesionario = concesionarios.find((c) => c.id === id);

  if (concesionario) {
    concesionario.coches = concesionario.coches.filter((c) => c.id !== cocheId);
    res.json({ message: "Coche eliminado correctamente" });
  } else {
    res.status(404).json({ message: "Concesionario no encontrado" });
  }
});
