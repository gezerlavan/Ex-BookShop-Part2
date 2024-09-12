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
          <button onclick="onReadBook(event, '${book.id}')">Read</button>
          <button onclick="onUpdateBook('${book.id}')">Update</button>
          <button onclick="onRemoveBook('${book.id}')">Delete</button>
        </td>
      </tr>`
  )

  elTable.innerHTML = !books.length
    ? '<tr><td colspan="3">No books to show</td></tr>'
    : strHtmls.join('')
}

function onRemoveBook(bookId) {
  removeBook(bookId)
  renderBooks()
}

function onUpdateBook(bookId) {
  const newPrice = +prompt('Enter the new price')
  if (!newPrice) return
  updatePrice(bookId, newPrice)
  renderBooks()
}

function onAddBook() {
  const title = prompt('Enter the title for the book')
  const price = +prompt('Enter the price for the book')
  if (!title || !price) return
  addBook(title, price)
  renderBooks()
}

function onReadBook(ev, bookId) {
  const book = getBookById(bookId)
  renderModal(ev, book)
}

function renderModal(ev, book) {
  ev.stopPropagation()

  const elDialog = document.querySelector('dialog')
  const elDialogContainer = document.querySelector('dialog .dialog-container')

  var strHtml = `
  <h1>${book.title}</h1>
  <p>Price: ${book.price}</p>
  <img src="${book.imgUrl}" alt="book image">
  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, qui!</p>
  <button onclick="onCloseModal()">Close</button>
  `

  // var strHtml = `
  //   <pre>${JSON.stringify(book)}</pre>
  // `

  elDialogContainer.innerHTML = strHtml
  elDialog.showModal()

  window.addEventListener('click', closeOnOutsideClick)
}

function onCloseModal() {
  const elDialog = document.querySelector('dialog')
  elDialog.close()

  window.removeEventListener('click', closeOnOutsideClick)
}

function closeOnOutsideClick(ev) {
  const elDialogContainer = document.querySelector('dialog .dialog-container')

  const rect = elDialogContainer.getBoundingClientRect()
  const isOutsideDialog =
    ev.clientX < rect.left ||
    ev.clientX > rect.right ||
    ev.clientY < rect.top ||
    ev.clientY > rect.bottom

  if (isOutsideDialog) onCloseModal()
}
