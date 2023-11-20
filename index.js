/**
 * Tres formas de almacenar valores en memoria en javascript:
 *      let: se puede modificar
 *      var: se puede modificar
 *      const: es constante y no se puede modificar
 */

// Importamos las bibliotecas necesarias.
// Concretamente el framework express.
const express = require("express");

// Inicializamos la aplicación
const app = express();

// Indicamos que la aplicación puede recibir JSON (API Rest)
app.use(express.json());

// Indicamos el puerto en el que vamos a desplegar la aplicación
const port = process.env.PORT || 8080;

// Arrancamos la aplicación
app.listen(port, () => {
  console.log(`Servidor desplegado en puerto: ${port}`);
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

// Lista todos los coches
app.get("/coches", (request, response) => {
  response.json(coches);
});

// Añadir un nuevo coche
app.post("/coches", (request, response) => {
  coches.push(request.body);
  response.json({ message: "ok" });
});

// Obtener un solo coche
app.get("/coches/:id", (request, response) => {
  const id = request.params.id;
  const result = coches[id];
  response.json({ result });
});

// Actualizar un solo coche
app.put("/coches/:id", (request, response) => {
  const id = request.params.id;
  coches[id] = request.body;
  response.json({ message: "ok" });
});

// Borrar un elemento del array
app.delete("/coches/:id", (request, response) => {
  const id = request.params.id;
  coches = coches.filter((item) => coches.indexOf(item) !== id);

  response.json({ message: "ok" });
});
