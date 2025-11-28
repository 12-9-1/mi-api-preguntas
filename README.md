# 📚 Mi API de Preguntas

API sencilla en Node.js + Express para manejar un banco de preguntas de trivia/quiz. Permite:

- 🔎 Obtener todas las preguntas
- 🎲 Obtener una pregunta aleatoria
- 🗂️ Filtrar preguntas por categoría
- ➕ Agregar nuevas preguntas personalizadas (se guardan en `preguntas_custom.json`)

---

## 🚀 Tecnologías usadas

- 🟢 Node.js
- ⚙️ Express
- 🔄 CORS
- 💾 Módulo nativo `fs` (lectura/escritura de archivos JSON)

---

## 📁 Estructura básica del proyecto

```text
mi-api-preguntas/
├─ index.js
├─ package.json
├─ preguntas_entretenimiento.json
├─ preguntas_historia.json
├─ preguntas_ciencia.json
├─ preguntas_cultura_general.json
├─ preguntas_deportes.json
├─ preguntas_tecnologia_y_internet.json
├─ preguntas_sociedad_y_salud.json
└─ preguntas_custom.json   (se crea/actualiza automáticamente al agregar nuevas preguntas)
```

> ℹ️ Los archivos `preguntas_*.json` contienen los bancos de preguntas por categoría. El archivo `preguntas_custom.json` almacena solo las preguntas agregadas mediante la API.

---

## 🔧 Instalación

1. 📥 Clonar o descargar el repositorio
2. 📂 Entrar a la carpeta del proyecto
3. 📦 Instalar dependencias:

```bash
npm install
```

Esto instalará:

- `express`
- `cors`

---

## ▶️ Cómo ejecutar la API

```bash
npm start
```

Por defecto, la API se levanta en el puerto `3000` (o el que se defina en la variable de entorno `PORT`).

- URL base local: `http://localhost:3000`

En consola deberías ver algo como:

```bash
API lista en puerto 3000
```

---

## 📡 Endpoints disponibles

### 1️⃣ Obtener todas las preguntas

- **Método:** `GET`
- **Endpoint:** `/preguntas`
- **Descripción:** Devuelve un arreglo con todas las preguntas cargadas desde los archivos JSON.

**Ejemplo de request:**

```bash
curl http://localhost:3000/preguntas
```

**Ejemplo de respuesta (simplificado):**

```json
[
  {
    "id": 1,
    "pregunta": "¿Cuál es la capital de Francia?",
    "categoria": "cultura_general",
    "opciones": ["París", "Londres", "Roma", "Berlín"],
    "respuesta": "París"
  },
  {
    "id": 2,
    "pregunta": "¿Quién formuló la teoría de la relatividad?",
    "categoria": "ciencia",
    "opciones": ["Newton", "Einstein", "Tesla", "Bohr"],
    "respuesta": "Einstein"
  }
]
```

---

### 2️⃣ Obtener una pregunta aleatoria

- **Método:** `GET`
- **Endpoint:** `/pregunta/random`
- **Descripción:** Devuelve una única pregunta seleccionada al azar de todas las disponibles.

**Ejemplo de request:**

```bash
curl http://localhost:3000/pregunta/random
```

**Ejemplo de respuesta (simplificado):**

```json
{
  "id": 15,
  "pregunta": "¿En qué año llegó el hombre a la Luna?",
  "categoria": "historia",
  "opciones": ["1965", "1969", "1972", "1959"],
  "respuesta": "1969"
}
```

---

### 3️⃣ Obtener preguntas por categoría

- **Método:** `GET`
- **Endpoint:** `/preguntas/:categoria`
- **Descripción:** Devuelve todas las preguntas cuya propiedad `categoria` coincida con el parámetro enviado.
- **Parámetro de ruta:** `categoria` (texto, se compara en minúsculas)

**Ejemplo de request:**

```bash
curl http://localhost:3000/preguntas/ciencia
```

**Comportamiento:**

- La categoría se convierte a minúsculas internamente: `req.params.categoria.toLowerCase()`
- Se filtran solo las preguntas donde `p.categoria.toLowerCase() === categoria`.

**Ejemplo de respuesta (simplificado):**

```json
[
  {
    "id": 5,
    "pregunta": "¿Cuál es el planeta más grande del sistema solar?",
    "categoria": "ciencia",
    "opciones": ["Tierra", "Júpiter", "Saturno", "Marte"],
    "respuesta": "Júpiter"
  }
]
```

---

### 4️⃣ Agregar una nueva pregunta personalizada

- **Método:** `POST`
- **Endpoint:** `/agregar`
- **Descripción:** Agrega una nueva pregunta al banco general en memoria y la persiste en el archivo `preguntas_custom.json`.

#### 🔁 Flujo interno del endpoint

1. Calcula el `id` máximo actual en `preguntas` y le suma 1.
2. Crea un objeto `nueva` combinando el `id` generado y el cuerpo del request (`req.body`).
3. Inserta la pregunta en el arreglo global `preguntas`.
4. Lee (si existe) el archivo `preguntas_custom.json` y lo parsea.
5. Agrega la nueva pregunta a ese arreglo de personalizadas.
6. Sobrescribe `preguntas_custom.json` con el nuevo contenido.
7. Responde con un mensaje de confirmación y la pregunta agregada.

#### 🧾 Estructura recomendada del body

```json
{
  "pregunta": "Aquí va el texto de la pregunta",
  "categoria": "categoria_ejemplo",
  "opciones": [
    "Opción A",
    "Opción B",
    "Opción C",
    "Opción D"
  ],
  "respuesta": "Opción correcta"
}
```

> ⚠️ El `id` **no** se envía en el body: se genera automáticamente.

#### 🔍 Ejemplo con `curl`

```bash
curl -X POST http://localhost:3000/agregar \
  -H "Content-Type: application/json" \
  -d '{
    "pregunta": "¿Cuál es tu lenguaje de programación favorito?",
    "categoria": "tecnologia_y_internet",
    "opciones": ["JavaScript", "Python", "Java", "C#"],
    "respuesta": "JavaScript"
  }'
```

**Ejemplo de respuesta:**

```json
{
  "mensaje": "Pregunta agregada",
  "pregunta": {
    "id": 101,
    "pregunta": "¿Cuál es tu lenguaje de programación favorito?",
    "categoria": "tecnologia_y_internet",
    "opciones": [
      "JavaScript",
      "Python",
      "Java",
      "C#"
    ],
    "respuesta": "JavaScript"
  }
}
```

---

## 🧠 Cómo se cargan las preguntas

Al iniciar la API (`index.js`):

- Se define un arreglo `archivosPreguntas` con todos los nombres de archivos JSON:
  - `preguntas_entretenimiento.json`
  - `preguntas_historia.json`
  - `preguntas_ciencia.json`
  - `preguntas_cultura_general.json`
  - `preguntas_deportes.json`
  - `preguntas_tecnologia_y_internet.json`
  - `preguntas_sociedad_y_salud.json`
  - `preguntas_custom.json`
- Para cada archivo:
  - ✅ Si existe (`fs.existsSync(archivo)`) y no está vacío, se lee y se hace `JSON.parse`.
  - 🔗 Todas las preguntas se van concatenando en el arreglo global `preguntas`.

De esta forma, la API siempre tiene en memoria todas las preguntas disponibles (incluyendo las personalizadas).

---

## 🌐 CORS

La API tiene habilitado CORS globalmente:

```js
app.use(cors());
```

Esto permite consumir los endpoints desde aplicaciones frontend (por ejemplo, una SPA en React, Vue, etc.) sin problemas de orígenes cruzados.

---

## ✅ Notas y buenas prácticas

- **Respaldo:** haz copia de seguridad de los archivos `preguntas_*.json` antes de hacer cambios masivos.
- **Formato JSON:** asegúrate de que los archivos JSON sean válidos (puedes usar un validador online).
- **IDs únicos:** la API se encarga de generar IDs incrementales; evita agregarlos a mano en los JSON para no provocar colisiones.
- **Producción:** para entornos productivos, considera:
  - Usar una base de datos en lugar de archivos JSON.
  - Manejar logs y errores de forma más robusta.

---

## 💡 Ideas de uso

- Aplicaciones de trivia/quizzes en la web o móvil 🎮
- Juegos de preguntas para streams o directos 🎥
- Dinámicas de equipo, icebreakers y actividades en clases u oficinas 🧊

---

## 🙌 Autoría

Proyecto basado en Node.js y Express. Ajusta libremente las preguntas, categorías y lógica según tus necesidades. ✨
