const express = require("express")
const app = express()
const router = express.Router()
const path = require("path")
const morgan = require("morgan")
const fs = require("fs")
const db = require("./db")
const bodyParser = require("body-parser")

const port = 3000

app.use(morgan(":method :url :status :res[content-length] - :response-time ms"))
app.use(bodyParser.json())

app.use(express.static("assets"))
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"))
})

app.get("/api/authors", async (req, res, next) => {
  await db
    .getAuthors()
    .then(response => res.send(response))
    .catch(next)
})

app.get("/api/books", async (req, res, next) => {
  await db
    .getBooks()
    .then(response => res.send(response))
    .catch(next)
})

app.post("/api/authors/:name", async (req, res, next) => {
  await db
    .createAuthor(req.params.name)
    .then(response => res.send(response))
    .catch(next)
})

app.post("/api/books/:author/:name/:description", async (req, res, next) => {
  console.log(req.params)
  await db
    .createBook(req.params.author, req.params.name, req.params.description)
    .then(response => res.send(response))
    .catch(next)
})

db.sync()
  .then(() => {
    console.log("db synced")
    app.listen(port, () => console.log(`listening on port ${port}`))
  })
  .catch(ex => console.log(ex))
