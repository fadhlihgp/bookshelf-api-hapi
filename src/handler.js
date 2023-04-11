const { nanoid } = require('nanoid');
const books = require('./books');

const saveBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = new Date().toISOString();

  const newBook = {
    // eslint-disable-next-line max-len
    name, year, author, summary, publisher, pageCount, readPage, reading, id, finished, insertedAt, updatedAt,
  };

  if (name === '' || name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (!isSuccess) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
  }

  const response = h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  });
  response.code(201);
  return response;
};

const getBookHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  let findBook = books;

  if (name !== undefined) {
    findBook = findBook.filter((book) => {
      const bookName = book.name.toLowerCase();
      const searchName = name.toLowerCase();
      return bookName.includes(searchName);
    });
  }

  if (reading !== undefined) {
    findBook = findBook.filter((book) => {
      if (reading === 0) {
        return book.reading === false;
      }
      if (reading === 1) {
        return book.reading === true;
      }
      return book.reading;
    });
  }

  if (finished !== undefined) {
    findBook = findBook.filter((book) => {
      if (finished === '0') {
        return book.finished === false;
      }
      if (finished === '1') {
        return book.finished === true;
      }
      return book.finished;
    });
  }
  // eslint-disable-next-line no-shadow
  const filteredBooks = findBook.map(({ id, name, publisher }) => ({ id, name, publisher }));

  return h.response({
    status: 'success',
    data: {
      books: filteredBooks,
    },
  });
};

const getBookDetailHandler = (request, h) => {
  const { id } = request.params;

  // eslint-disable-next-line no-shadow
  const book = books.filter((book) => book.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: { book },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const updateBookHandler = (request, h) => {
  const { id } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  // eslint-disable-next-line no-shadow
  const book = books.find((book) => book.id === id);

  if (name === '' || name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  if (book !== undefined) {
    book.name = name;
    book.year = year;
    book.author = author;
    book.summary = summary;
    book.publisher = publisher;
    book.pageCount = pageCount;
    book.readPage = readPage;
    book.reading = reading;
    book.updatedAt = updatedAt;
    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
  }

  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  }).code(404);
};

const deleteBookHandler = (request, h) => {
  const { id } = request.params;
  // eslint-disable-next-line no-shadow
  const book = books.findIndex((book) => book.id === id);

  if (book !== -1) {
    books.splice(book, 1);
    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  }).code(404);
};

module.exports = {
  saveBookHandler, getBookDetailHandler, updateBookHandler, deleteBookHandler, getBookHandler,
};
