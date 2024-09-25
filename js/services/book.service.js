'use strict'

const BOOKS_KEY = 'books'
const USER_PREF_KEY = 'userPref'

const IMG_URL =
  'https://i.pinimg.com/736x/35/a4/52/35a45204888e5df66d047bb84a6f3ab6.jpg'

var gBooks = []
var gUserPref = ''

_createBooks()

function getBooks(options) {
  const filterBy = options.filterBy
  const sortBy = options.sortBy
  const page = options.page

  var books = _filterBooks(filterBy)

  if (sortBy.sortField === 'title') {
    books.sort((a, b) => a.title.localeCompare(b.title) * sortBy.sortDir)
  } else if (sortBy.sortField === 'rating') {
    books.sort((b1, b2) => (b1.rating - b2.rating) * sortBy.sortDir)
  } else if (sortBy.sortField === 'price') {
    books.sort((b1, b2) => (b1.price - b2.price) * sortBy.sortDir)
  }

  const startIdx = page.idx * page.size
  books = books.slice(startIdx, startIdx + page.size)

  return books
}

function _filterBooks(filterBy) {
  var books = gBooks.slice()

  if (filterBy.txt) {
    const regex = new RegExp(filterBy.txt, 'i')
    books = books.filter(book => regex.test(book.title))
  }
  if (filterBy.minRating) {
    books = books.filter(book => book.rating >= filterBy.minRating)
  }

  return books
}

function getUserPref() {
  return loadFromStorage(USER_PREF_KEY) || 'table'
}

function setUserPref(isTable) {
  gUserPref = isTable ? 'table' : 'cards'
  _saveUserPref()
}

function removeBook(bookId) {
  const bookIdx = gBooks.findIndex(book => book.id === bookId)
  gBooks.splice(bookIdx, 1)

  _saveBooks()
}

function updatePrice(bookId, newPrice) {
  const bookToUpdate = getBookById(bookId)
  bookToUpdate.price = newPrice

  _saveBooks()
}

function updateRating(bookId, newRating) {
  const bookToUpdate = getBookById(bookId)
  if (newRating >= 1 && newRating <= 5) {
    bookToUpdate.rating = newRating
  }

  _saveBooks()
  return bookToUpdate
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

function getStats() {
  return gBooks.reduce(
    (acc, book) => {
      if (book.price < 80) acc.cheap++
      else if (book.price <= 200) acc.average++
      else acc.expensive++
      return acc
    },
    { expensive: 0, average: 0, cheap: 0 }
  )
}

function _createBooks() {
  gBooks = loadFromStorage(BOOKS_KEY)

  if (gBooks && gBooks.length) return

  gBooks = []
  gBooks.push(_createBook('Book 1', 110, 3))
  gBooks.push(_createBook('Book 2', 120, 4))
  gBooks.push(_createBook('Book 3', 130, 5))
  gBooks.push(_createBook('Book 4', 140, 4))
  gBooks.push(_createBook('Book 5', 150, 4))
  gBooks.push(_createBook('Book 6', 160, 3))
  gBooks.push(_createBook('Book 7', 170, 3))
  gBooks.push(_createBook('Book 8', 180, 5))
  gBooks.push(_createBook('Book 9', 190, 5))
  gBooks.push(_createBook('Book 10', 200, 5))
  gBooks.push(_createBook('Book 11', 210, 4))
  gBooks.push(_createBook('Book 12', 220, 4))

  _saveBooks()
}

function _createBook(title = 'Demo Book', price = 100, rating = 5) {
  return {
    id: makeId(),
    title,
    price,
    rating,
    imgUrl: IMG_URL,
  }
}

function _saveBooks() {
  saveToStorage(BOOKS_KEY, gBooks)
}

function _saveUserPref() {
  saveToStorage(USER_PREF_KEY, gUserPref)
}
