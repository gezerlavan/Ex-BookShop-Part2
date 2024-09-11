'use strict'

function onInit() {
  renderBooks()
}

function renderBooks() {
  const elTable = document.querySelector('tbody')
  const books = getBooks()

  const strHtmls = books.map(
    book => `
    <tr>
      <td>${book.title}</td>
      <td>${book.price}</td>
      <td>
        <button onclick="onReadBook('${book.id}')">Read</button>
        <button onclick="onUpdateBook('${book.id}')">Update</button>
        <button onclick="onRemoveBook('${book.id}')">Delete</button>
      </td>
    </tr>`
  )

  elTable.innerHTML = strHtmls.join('')
}

function onRemoveBook(bookId) {
  removeBook(bookId)
  renderBooks()
}

function onUpdateBook(bookId) {
  const newPrice = +prompt('Enter the new price')
  updatePrice(bookId, newPrice)
  renderBooks()
}
