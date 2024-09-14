'use strict'

var gFilterBy = ''
var gIsTable
var gSelectedBook
var gTimeoutId

function onInit() {
  gIsTable = getUserPref() === 'table'
  handleToggleDisplay(gIsTable)
  gSelectedBook = null
  renderButton()
  renderBooks()
  renderStats()
}

function renderBooks() {
  const books = getBooks(gFilterBy)
  gIsTable ? renderTable(books) : renderCards(books)
}

function renderTable(books) {
  const elTableBody = document.querySelector('tbody')

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

  elTableBody.innerHTML = !books.length
    ? '<tr><td colspan="3" class="no-books">No books to show</td></tr>'
    : strHtmls.join('')
}

function renderCards(books) {
  const elCards = document.querySelector('.book-list')

  const strHtmls = books.map(
    book => `
      <li>
        <p>Title: ${book.title}</p>
        <p>Price: ${book.price}</p>
        <img src="${book.imgUrl}" alt="">
        <div>
          <button onclick="onReadBook(event, '${book.id}')">Read</button>
          <button onclick="onUpdateBook('${book.id}')">Update</button>
          <button onclick="onRemoveBook('${book.id}')">Delete</button>
        </div>
      </li>
    `
  )

  elCards.innerHTML = !books.length
    ? '<li class="no-books">No books to show</li>'
    : strHtmls.join('')
}

function renderButton() {
  const elDisplayBtn = document.querySelector('.btn-display')
  elDisplayBtn.innerText = gIsTable ? 'Cards' : 'Table'
}

function onToggleDisplay() {
  gIsTable = !gIsTable
  setUserPref(gIsTable)

  handleToggleDisplay()
  renderButton()
  renderBooks()
}

function handleToggleDisplay() {
  const elTable = document.querySelector('table')
  const elCards = document.querySelector('.book-list')

  if (gIsTable) {
    elTable.style.display = 'table'
    elCards.style.display = 'none'
  } else {
    elTable.style.display = 'none'
    elCards.style.display = 'flex'
  }
}

function renderStats() {
  const elExpensive = document.querySelector('.expensive')
  const elAverage = document.querySelector('.average')
  const elCheap = document.querySelector('.cheap')
  const stats = getStats()

  elExpensive.innerText = stats.expensive
  elAverage.innerText = stats.average
  elCheap.innerText = stats.cheap
}

function onFilterBy(elInput) {
  if (!elInput) {
    gFilterBy = ''
    document.querySelector('input').value = ''
  } else {
    gFilterBy = elInput.value
  }
  renderBooks()
}

function onRemoveBook(bookId) {
  removeBook(bookId)
  renderBooks()
  renderStats()

  showSuccessMsg(`Book removed successfully ${bookId}`)
}

function onUpdateBook(bookId) {
  const newPrice = +prompt('Enter the new price')
  if (!newPrice) return
  updatePrice(bookId, newPrice)
  renderBooks()
  renderStats()

  showSuccessMsg(`Book updated successfully ${bookId}`)
}

function onAddBook() {
  const title = prompt('Enter the title for the book')
  const price = +prompt('Enter the price for the book')
  if (!title || !price) return
  addBook(title, price)
  renderBooks()
  renderStats()

  showSuccessMsg(`Book added successfully`)
}

function onReadBook(ev, bookId) {
  const book = getBookById(bookId)
  gSelectedBook = book
  renderModal(ev, book)
}

function showSuccessMsg(msg) {
  if (gTimeoutId) clearTimeout(gTimeoutId)
  const elUserMsg = document.querySelector('.user-msg')
  elUserMsg.innerText = msg
  elUserMsg.hidden = false

  gTimeoutId = setTimeout(() => {
    elUserMsg.innerText = ''
    elUserMsg.hidden = true
  }, 2000)
}

function renderModal(ev, book) {
  ev.stopPropagation()

  const elDialog = document.querySelector('dialog')
  const elDialogContainer = document.querySelector('dialog .dialog-container')

  var strHtml = `
    <h1>${book.title}</h1>
    <p>Price: ${book.price}</p>
    <p>Rating: 
      <span onclick="onUpdateRating(-1)">-</span> 
      <span class="rating">${book.rating}</span> 
      <span onclick="onUpdateRating(1)">+</span>
    </p>
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

function onUpdateRating(diff) {
  const elRating = document.querySelector('.rating')
  const newRating = gSelectedBook.rating + diff

  const updatedBook = updateRating(gSelectedBook.id, newRating)
  elRating.innerText = updatedBook.rating
}

function onCloseModal() {
  const elDialog = document.querySelector('dialog')
  gSelectedBook = null
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
