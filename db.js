const pg = require("pg")
const { Client } = pg
const uuid = require("uuid/v4")
const client = new Client("postgres://localhost/book_shelf")
const faker = require("faker")

client.connect()

const sync = async () => {
  const SQL = `
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
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
    title VARCHAR NOT NULL,
    author_id UUID references authors(id),
    description VARCHAR DEFAULT 'mystery story about a ghost and his friends',
    read VARCHAR DEFAULT 'false',
    date_create TIMESTAMP default CURRENT_TIMESTAMP
  );
  INSERT INTO authors (name) VALUES ('JK Rowling');
  INSERT INTO books (title, author_id, description) VALUES ('Harry Potter and the Philosophers Stone', (SELECT id FROM authors WHERE name = 'JK Rowling'), 'The first novel in the fantasy series, Harry Potter. It follows Harry Potter, a young wizard who discovers his magical heritage on his eleventh birthday, when he receives a letter of acceptance to Hogwarts School of Witchcraft and Wizardry.');
  INSERT INTO authors (name) VALUES ('Brandon Sanderson');
  INSERT INTO books (title, author_id, description) VALUES ('The Way of Kings', (SELECT id FROM authors WHERE name = 'Brandon Sanderson'), 'Shallan, a minor lighteyes woman whose family and lands are in danger, hatches a daring plot to switch a broken Soulcaster (a device that allows people to change objects to other things) with a working one belonging to Jasnah Kholin, sister of the Alethi King.');



  INSERT INTO books (title, author_id, description) VALUES ('Harry Potter and the Order of the Phoenix', (SELECT id FROM authors WHERE name = 'JK Rowling'), 'Description for HP');


  INSERT INTO authors (name) VALUES ('Harper Lee');

  INSERT INTO books (title, author_id, description) VALUES ('To kill a mockingbird', (SELECT id FROM authors WHERE name = 'Harper Lee'), 'Description for TKAM');

  INSERT INTO authors (name) VALUES ('J.R.R. Tolkien');

  INSERT INTO books (title, author_id, description) VALUES ('The Lord of the Rings', (SELECT id FROM authors WHERE name = 'J.R.R. Tolkien'), 'Description for LOTR');

  INSERT INTO authors (name) VALUES ('George R.R. Martin');

  INSERT INTO books (title, author_id, description) VALUES ('Game of thrones', (SELECT id FROM authors WHERE name = 'George R.R. Martin'), 'Description for GOT');



  INSERT INTO books (title, author_id, description) VALUES ('Harry Potter and the Chamber of Secrets', (SELECT id FROM authors WHERE name = 'JK Rowling'), 'Description for HP');

  INSERT INTO authors (name) VALUES ('Antoine de Saint-Exupery');

  INSERT INTO books (title, author_id, description) VALUES ('Little Prince', (SELECT id FROM authors WHERE name = 'Antoine de Saint-Exupery'), 'Description for LP');



  INSERT INTO books (title, author_id, description) VALUES ('Harry Potter and the Prisoner of Azkaban', (SELECT id FROM authors WHERE name = 'JK Rowling'), 'Description for HP');


  `
  await client.query(SQL)
}

//Authors
const getAuthors = async () => {
  const SQL = `
  SELECT * FROM authors
  `
  const response = await client.query(SQL)
  return response.rows
}

const getAuthor = async name => {
  const SQL = `
  SELECT * FROM authors WHERE name=$1
  `
  const response = await client.query(SQL, [name])
  return response.rows[0]
}

const getAuthorById = async id => {
  const SQL = `
  SELECT * FROM authors where id = $1
  `
  const response = await client.query(SQL, [id])
  console.log(response.rows)
  return response.rows
}

const createAuthor = async name => {
  const SQL = `
  INSERT INTO authors (name) VALUES ($1)
  returning *
  `
  const response = await client.query(SQL, [name])

  return response.rows[0]
}

const deleteAuthor = async id => {
  console.log(id, "my id for authorx")
  const SQL = `
  DELETE FROM books WHERE author_id = $1;
  `

  const SQL_Two = `
  DELETE FROM authors WHERE id = $1`
  const response = await client.query(SQL, [id])
  await client.query(SQL_Two, [id])
  console.log(response, "my response")
  return response.rows
}

//Books
const getBooks = async () => {
  const SQL = `
  SELECT * FROM books
  `
  const response = await client.query(SQL)

  return response.rows
}

const getBookTitle = async title => {
  const SQL = `
  SELECT * FROM books WHERE title = $1
  `
  const response = await client.query(SQL, [title])
  return response.rows
}

const getBook = async author => {
  const SQL = `
  SELECT * FROM books WHERE author_id IN (select id from authors where $1 = name)
  `
  const response = await client.query(SQL, [author])

  return response.rows
}

const getBookByAuthorID = async author_id => {
  const SQL = `
  SELECT * FROM books WHERE author_id = $1
  `
  const response = await client.query(SQL, [author_id])
  return response.rows
}

const createBook = async (author, name, description) => {
  const SQL = `
  INSERT INTO books(title, author_id, description) VALUES ($1, (SELECT id FROM authors WHERE name = $2), $3)
  returning *
  `

  const response = await client.query(SQL, [name, author, description])
  return response.rows[0]
}

const deleteBook = async id => {
  const SQL = `
  DELETE FROM books WHERE id = $1

  `
  const response = await client.query(SQL, [id])

  return response.rows
}

module.exports = {
  sync,
  getAuthors,
  getBooks,
  getAuthor,
  getBook,
  getAuthorById,
  getBookByAuthorID,
  createAuthor,
  createBook,
  getBookTitle,
  deleteAuthor,
  deleteBook
}
