const pg = require("pg")
const { Client } = pg
const uuid = require("uuid/v4")
const client = new Client("postgres://localhost/book_shelf")
const faker = require("faker")

client.connect()

const sync = async () => {
  const SQL = `    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  DROP TABLE IF EXISTS description;
  DROP TABLE IF EXISTS books;
  DROP TABLE IF EXISTS authors;
  CREATE TABLE authors
  (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,
    date_create TIMESTAMP default CURRENT_TIMESTAMP
  );

  CREATE TABLE books
  (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,

    date_create TIMESTAMP default CURRENT_TIMESTAMP
  );
  CREATE TABLE description
  (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR NOT NULL,

    date_create TIMESTAMP default CURRENT_TIMESTAMP
  );

  INSERT INTO authors (name) VALUES ('Colleen author name');
  INSERT INTO books (name) VALUES ('book name');
  INSERT INTO description (name) VALUES ('description');
  `
  await client.query(SQL)
}

//Authors
getAuthors = async () => {
  const SQL = `SELECT * FROM authors`
  const response = await client.query(SQL)
  return response.rows
}

getAuthor = async id => {
  const SQL = `SELECT * FROM authors WHERE id=$1`
  const response = await client.query(SQL)
  return response.rows[0]
}

createAuthor = async name => {
  const SQL = `INSERT INTO authors(name) VALUES ($1)
  returning *`
  const response = await client.query(SQL, [name])
  return response.rows[0]
}

//Books
getBooks = async () => {
  const SQL = `SELECT * FROM books`
  const response = await client.query(SQL)
  console.log(response.rows)
  return response.rows
}
createBook = async (name, author) => {
  const SQL = `INSERT INTO books(name, id) VALUES ($1, $2 )
  returning *`
  const response = await client.query(SQL, [name, author])
  return response.rows[0]
}

//Description
getDescription = async () => {
  const SQL = `SELECT * FROM description`
  const response = await client.query(SQL)
  return response.rows
}

createDescription = async name => {
  const SQL = `INSERT INTO description(name) VALUES ($1)
  returning *`
  const response = await client.query(SQL, [name])
  return response.rows[0]
}

module.exports = {
  sync,
  getAuthors,
  getBooks,
  getDescription,
  createAuthor
}
