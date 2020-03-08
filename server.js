const express = require("express")
const app = express()

const path = require("path")
const morgan = require("morgan")
const fs = require("fs")
const db = require("./db")
const bodyParser = require("body-parser")

const port = 3000

app.use(morgan(":method :url :status :res[content-length] - :response-time ms"))
app.use(bodyParser.json())

app.use(express.static("assets"))
app.get("", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"))
})

/*

Get requests


*/
app.get("/api/authors", async (req, res, next) => {
  await db
    .getAuthors()
    .then(response => res.send(response))
    .catch(next)
})

app.get("/api/authors/:name", (req, res, next) => {
  db.getAuthor(req.params.name)
    .then(response => res.send(response))
    .catch(next)
})

app.get("/api/authorID/:id", (req, res, next) => {
  db.getAuthorById(req.params.id)
    .then(response => res.send(response))
    .catch(next)
})

app.get("/api/bookByAuthorID/:id", (req, res, next) => {
  console.log(req.params.id, "request params")
  db.getBookByAuthorID(req.params.id)
    .then(response => res.send(response))
    .catch(next)
})

app.get("/api/books", async (req, res, next) => {
  await db
    .getBooks()
    .then(response => res.send(response))
    .catch(next)
})

app.get("/api/books/:authorName", async (req, res, next) => {
  await db.getBook(req.params.authorName).then(response => res.send(response))
})

app.get("/api/bookTitle/:title", async (req, res, next) => {
  await db.getBookTitle(req.params.title).then(response => res.send(response))
})

/*

Post requests


*/

app.post("/api/authors/:name", async (req, res, next) => {
  await db
    .createAuthor(req.params.name)
    .then(response => res.send(response))
    .catch(next)
})

app.post("/api/books", async (req, res, next) => {
  await db
    .getAuthor(req.body.authorName)
    .then(async authorExists => {
      if (!authorExists) {
        db.createAuthor(req.body.authorName).then(async authorResponse => {
          await db
            .createBook(
              req.body.authorName,
              req.body.bookName,
              req.body.description
            )
            .then(bookResponse => {
              res.send({ authorResponse, bookResponse })
            })
        })
      } else {
        await db
          .createBook(
            req.body.authorName,
            req.body.bookName,
            req.body.description
          )
          .then(response => res.send(response))
          .catch(next)
      }
    })
    .catch(next)
})

/*

Delete requests


*/

app.delete("/api/authors/:id", (req, res, next) => {
  db.deleteAuthor(req.params.id)
    .then(() => res.status(200))
    .catch(next)
})

app.delete("/api/books/:id", (req, res, next) => {
  db.deleteBook(req.params.id)
    .then(response => res.send(response))
    .catch(next)
})

db.sync()
  .then(() => {
    console.log("db synced")
    app.listen(port, () => console.log(`listening on port ${port}`))
  })
  .catch(ex => console.log(ex))
