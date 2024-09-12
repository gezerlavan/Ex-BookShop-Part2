'use strict'

const imgUrl =
  'https://i.pinimg.com/736x/35/a4/52/35a45204888e5df66d047bb84a6f3ab6.jpg'
  
const gBooks = [
  {
    id: '101',
    title: 'Book 1',
    price: 110,
    imgUrl,
  },
  {
    id: '102',
    title: 'Book 2',
    price: 120,
    imgUrl,
  },
  {
    id: '103',
    title: 'Book 3',
    price: 130,
    imgUrl,
  },
]

function getBooks() {
  return gBooks
}

function removeBook(bookId) {
  const bookIdx = gBooks.findIndex(book => book.id === bookId)
  gBooks.splice(bookIdx, 1)
}

function updatePrice(bookId, newPrice) {
  const bookToUpdate = gBooks.find(book => book.id === bookId)
  bookToUpdate.price = newPrice
}

function addBook(title, price) {
  const newBook = _createBook(title, price)
  gBooks.push(newBook)
}

function getBookById(bookId) {
  const book = gBooks.find(book => book.id === bookId)
  return book
}

function _createBook(title = '', price = 100) {
  return {
    id: makeId(),
    title,
    price,
    imgUrl: '',
  }
}
