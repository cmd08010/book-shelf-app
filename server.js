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
app.get("/", (req, res) => {
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

app.get("/api/authors/:name", async (req, res, next) => {
  await db
    .getAuthor(req.params.name)
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

app.post("/api/books/:author/:name/:description", async (req, res, next) => {
  await db
    .getAuthor(req.params.author)
    .then(async authorExists => {
      console.log(
        authorExists,
        "first response to see if there is an author already"
      )
      if (!authorExists) {
        console.log("in if statement")
        db.createAuthor(req.params.author).then(async authorResponse => {
          await db
            .createBook(
              req.params.author,
              req.params.name,
              req.params.description
            )
            .then(bookResponse => {
              res.send({ authorResponse, bookResponse })
            })
        })

        // .then(responses => console.log(responses))
        // .catch(next)
      } else {
        console.log("in else statement")
        await db
          .createBook(
            req.params.author,
            req.params.name,
            req.params.description
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

db.sync()
  .then(() => {
    console.log("db synced")
    app.listen(port, () => console.log(`listening on port ${port}`))
  })
  .catch(ex => console.log(ex))
