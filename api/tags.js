const express = require('express');
const tagsRouter = express.Router();
const { getAllTags } = require('../db');
const { getPostsByTagName } = require('../db');

tagsRouter.use((req, res, next) => {
    console.log("A request is being made to /tags");

    next();
});

tagsRouter.get('/', async (req, res) => {
    const tags = await getAllTags();

    res.send({
        tags
    });
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    const { tagName } = req.params;
    try {
        const postsTags = await getPostsByTagName(tagName);
        // send out an object to the client { posts: // the posts }
        res.status(200).send({ posts });
    } catch ({ name, message }) {
        // forward the name and message to the error handler
        next({ name, message });
    }
});

module.exports = tagsRouter;