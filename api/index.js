const express = require('express');
const apiRouter = express.Router();

//Users//
const usersRouter = require('./users');
apiRouter.use('/users', usersRouter);

//Posts//
const postsRouter = require('./posts');
apiRouter.use('/posts', postsRouter);

//Tags//
const tagsRouter = require('./tags');
apiRouter.use('/tags', tagsRouter);

module.exports = apiRouter;