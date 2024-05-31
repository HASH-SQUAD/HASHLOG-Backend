const express = require('express');
const router = express.Router();

const { validateToken } = require('../../middlewares/AuthMiddleware.js');

const WritePost = require('./WritePost.js');
router.post('/', validateToken, WritePost);

const UpdatePost = require('./UpdatePost.js');
router.put('/:id', validateToken, UpdatePost);

const DeletePost = require('./DeletePost.js');
router.delete('/:id', validateToken, DeletePost);

const GetPost_ById = require('./GetPost_ById.js');
router.get(`/:id`, GetPost_ById);

const GetPost_All = require('./GetPost_All.js');
router.get('/', GetPost_All);

module.exports = router;
