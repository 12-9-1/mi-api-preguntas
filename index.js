const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const archivosPreguntas = [
  "preguntas_entretenimiento.json",
  "preguntas_historia.json",
  "preguntas_ciencia.json",
  "preguntas_cultura_general.json",
  "preguntas_deportes.json",
  "preguntas_tecnologia_y_internet.json",
  "preguntas_sociedad_y_salud.json",
  "preguntas_custom.json"
];

let preguntas = [];

for (const archivo of archivosPreguntas) {
  if (fs.existsSync(archivo)) {
    const contenido = fs.readFileSync(archivo, "utf8");
    if (contenido.trim()) {
      preguntas = preguntas.concat(JSON.parse(contenido));
    }
  }
}

// Obtener todas las preguntas
app.get("/preguntas", (req, res) => {
  res.json(preguntas);
});

// Obtener una pregunta random
app.get("/pregunta/random", (req, res) => {
  const random = preguntas[Math.floor(Math.random() * preguntas.length)];
  res.json(random);
});

// Obtener preguntas por categoría
app.get("/preguntas/:categoria", (req, res) => {
  const categoria = req.params.categoria.toLowerCase();
  const filtradas = preguntas.filter(
    p => p.categoria.toLowerCase() === categoria
  );
  res.json(filtradas);
});

// Agregar pregunta nueva
app.post("/agregar", (req, res) => {
  const maxId = preguntas.reduce((max, p) => (p.id > max ? p.id : max), 0);

  const nueva = {
    id: maxId + 1,
    ...req.body
  };

  preguntas.push(nueva);

  let personalizadas = [];

  if (fs.existsSync("preguntas_custom.json")) {
    const contenido = fs.readFileSync("preguntas_custom.json", "utf8");
    if (contenido.trim()) {
      personalizadas = JSON.parse(contenido);
    }
  }

  personalizadas.push(nueva);

  fs.writeFileSync("preguntas_custom.json", JSON.stringify(personalizadas, null, 2));

  res.json({ mensaje: "Pregunta agregada", pregunta: nueva });
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("API lista en puerto " + PORT);
});
