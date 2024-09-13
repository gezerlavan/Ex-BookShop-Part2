'use strict'

const BOOKS_KEY = 'books'

const IMG_URL =
  'https://i.pinimg.com/736x/35/a4/52/35a45204888e5df66d047bb84a6f3ab6.jpg'

var gBooks = []
_createBooks()

function getBooks(filterBy) {
  if (!filterBy) return gBooks

  const regex = new RegExp(filterBy, 'i')
  return gBooks.filter(book => regex.test(book.title))
}

function removeBook(bookId) {
  const bookIdx = gBooks.findIndex(book => book.id === bookId)
  gBooks.splice(bookIdx, 1)

  _saveBooks()
}

function updatePrice(bookId, newPrice) {
  const bookToUpdate = gBooks.find(book => book.id === bookId)
  bookToUpdate.price = newPrice

  _saveBooks()
}

function addBook(title, price) {
  const newBook = _createBook(title, price)
  gBooks.push(newBook)

  _saveBooks()
}

function getBookById(bookId) {
  const book = gBooks.find(book => book.id === bookId)
  return book
}

function _createBooks() {
  gBooks = loadFromStorage(BOOKS_KEY)

  if (gBooks && gBooks.length) return

  gBooks = []
  gBooks.push(_createBook('Book 1', 110))
  gBooks.push(_createBook('Book 2', 120))
  gBooks.push(_createBook('Book 3', 130))

  _saveBooks()
}

function _createBook(title = 'Demo Book', price = 100) {
  return {
    id: makeId(),
    title,
    price,
    imgUrl: IMG_URL,
  }
}

function _saveBooks() {
  saveToStorage(BOOKS_KEY, gBooks)
}
