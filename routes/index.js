const express = require('express');
const router = express.Router();

const userRouter = require('./User');
router.use('/auth', userRouter);

const postRouter = require('./Post');
router.use('/post', postRouter);

module.exports = router;
