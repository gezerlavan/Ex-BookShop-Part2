'use strict'

var gQueryOptions = {
  filterBy: { txt: '', minRating: 1 },
  sortBy: {},
  page: { idx: 0, size: 5 },
}
var gIsTable
var gSelectedBook
var gTimeoutId

function onInit() {
  gIsTable = getUserPref() === 'table'
  handleToggleDisplay(gIsTable)
  gSelectedBook = null
  renderButton()
  readQueryParams()
  renderBooks()
  renderStats()
}

function renderBooks() {
  const books = getBooks(gQueryOptions)
  gIsTable ? renderTable(books) : renderCards(books)
  setQueryParams()
}

function renderTable(books) {
  const elTableBody = document.querySelector('tbody')

  const strHtmls = books.map(
    book => `
      <tr>
        <td>${book.title}</td>
        <td>${book.price}</td>
        <td>${book.rating}</td>
        <td>
          <button onclick="onReadBook(event, '${book.id}')">Read</button>
          <button onclick="onUpdateBook('${book.id}')">Update</button>
          <button onclick="onRemoveBook('${book.id}')">Delete</button>
        </td>
      </tr>`
  )

  elTableBody.innerHTML = !books.length
    ? '<tr><td colspan="4" class="no-books">No books to show</td></tr>'
    : strHtmls.join('')
}

function renderCards(books) {
  const elCards = document.querySelector('.book-list')

  const strHtmls = books.map(
    book => `
      <li>
        <p>Title: ${book.title}</p>
        <p>Price: ${book.price}</p>
        <p>Rating: ${book.rating}</p>
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

// CRUD

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

function onUpdateRating(diff) {
  const elRating = document.querySelector('.rating')
  const newRating = gSelectedBook.rating + diff

  const updatedBook = updateRating(gSelectedBook.id, newRating)
  elRating.innerText = updatedBook.rating

  renderBooks()
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

// Details modal

function onReadBook(ev, bookId) {
  const book = getBookById(bookId)
  gSelectedBook = book
  renderModal(ev, book)
}

function renderModal(ev, book) {
  ev.stopPropagation()

  const elDialog = document.querySelector('dialog')

  elDialog.querySelector('h1').innerText = book.title
  elDialog.querySelector('.price').innerText = `Price: ${book.price}`
  elDialog.querySelector('.rating').innerText = book.rating
  elDialog.querySelector('img').src = book.imgUrl

  elDialog.showModal()

  window.addEventListener('click', closeOnOutsideClick)
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

// Filter, Sort & Pagination

function onSetFilterBy(elInput) {
  const filterBy = gQueryOptions.filterBy
  if (elInput.name === 'txt') filterBy.txt = elInput.value
  if (elInput.name === 'minRating') filterBy.minRating = +elInput.value

  renderBooks()
}

function onResetFilter() {
  gQueryOptions = {
    filterBy: { txt: '', minRating: 1 },
    sortBy: {},
    page: { idx: 0, size: 5 },
  }

  document.querySelector('input[type=text]').value = ''
  document.querySelector('input[type=range]').value = 1
  document.querySelector('.sort-by').value = ''
  document
    .querySelectorAll('input[type=radio]')
    .forEach(i => (i.checked = false))

  renderBooks()
}

function onSetSortBy(elInput) {
  const sortBy = gQueryOptions.sortBy
  if (elInput.name === 'sort-field') sortBy.sortField = elInput.value
  if (elInput.name === 'sort-dir') sortBy.sortDir = +elInput.value

  renderBooks()
}

// Query Params

function readQueryParams() {
  const queryParams = new URLSearchParams(window.location.search)

  gQueryOptions.filterBy = {
    txt: queryParams.get('title') || '',
    minRating: +queryParams.get('minRating') || 1,
  }

  if (queryParams.get('sortField')) {
    const prop = queryParams.get('sortField')
    const dir = queryParams.get('sortDir')

    gQueryOptions.sortBy.sortField = prop
    gQueryOptions.sortBy.sortDir = dir
  }

  if (queryParams.get('pageIdx')) {
    gQueryOptions.page.idx = +queryParams.get('pageIdx')
    gQueryOptions.page.size = +queryParams.get('pageSize')
  }
  renderQueryParams()
}

function renderQueryParams() {
  document.querySelector('.title').value = gQueryOptions.filterBy.txt
  document.querySelector('.min-rating').value = gQueryOptions.filterBy.minRating

  const sortField = gQueryOptions.sortBy.sortField
  const sortDir = +gQueryOptions.sortBy.sortDir
  document.querySelector('.sort-by').value = sortField || ''
  document.querySelector('.asc').checked = sortDir > 0
  document.querySelector('.des').checked = sortDir < 0
}

function setQueryParams() {
  const queryParams = new URLSearchParams()

  queryParams.set('title', gQueryOptions.filterBy.txt)
  queryParams.set('minRating', gQueryOptions.filterBy.minRating)

  if (gQueryOptions.sortBy.sortField) {
    queryParams.set('sortField', gQueryOptions.sortBy.sortField)
    queryParams.set('sortDir', gQueryOptions.sortBy.sortDir)
  }

  if (gQueryOptions.page) {
    queryParams.set('pageIdx', gQueryOptions.page.idx)
    queryParams.set('pageSize', gQueryOptions.page.size)
  }

  const newUrl =
    window.location.protocol +
    '//' +
    window.location.host +
    window.location.pathname +
    '?' +
    queryParams.toString()

  window.history.pushState({ path: newUrl }, '', newUrl)
}

// UI

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
