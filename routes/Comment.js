const express = require('express');
const router = express.Router();
const { Comments } = require('../models');
const { validateToken } = require('../middlewares/AuthMiddleware');

router.get('/:postId', async (req, res) => {
	const postId = req.params.postId;
	const comments = await Comments.findAll({ where: { PostId: postId } });
	res.json(comments);
});

router.post('/', validateToken, async (req, res) => {
	const Comment = req.body;
	Comment.nickname = req.user.nickname;
	Comment.userid = req.user.userid;

	await Comments.create(req.body);

	res.json('댓글작성 성공!');
});

router.delete('/:commentId', validateToken, async (req, res) => {
	const commentId = req.params.commentId;

	await Comments.destroy({ where: { id: commentId } });

	res.json('댓글삭제 성공');
});

module.exports = router;
