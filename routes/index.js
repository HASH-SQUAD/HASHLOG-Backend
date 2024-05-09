const express = require('express');
const router = express.Router();

const userRouter = require('./User');
router.use('/auth', userRouter);

const postRouter = require('./Post');
router.use('/post', postRouter);

const jwtRouter = require('./Jwt');
router.use('/jwt', jwtRouter);

const uploadRouter = require('./Upload');
router.use('/upload', uploadRouter);

module.exports = router;
