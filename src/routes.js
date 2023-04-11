const {
  saveBookHandler, getBookDetailHandler, updateBookHandler, deleteBookHandler, getBookHandler,
} = require('./handler');

const routes = [
  {
    method: 'GET',
    path: '/books',
    handler: getBookHandler,
    options: {
      cors: {
        origin: ['*'],
      },
    },
  },

  {
    method: 'POST',
    path: '/books',
    handler: saveBookHandler,
    options: {
      cors: {
        origin: ['*'],
      },
    },
  },

  {
    method: 'GET',
    path: '/books/{id}',
    handler: getBookDetailHandler,
    options: {
      cors: {
        origin: ['*'],
      },
    },
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: updateBookHandler,
    options: {
      cors: {
        origin: ['*'],
      },
    },
  },

  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBookHandler,
    options: {
      cors: {
        origin: ['*'],
      },
    },
  },
];

module.exports = routes;
