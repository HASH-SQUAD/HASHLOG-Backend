const express = require('express');
const router = express.Router();
const { Post } = require('../models');
const bcrypt = require('bcrypt');
const { validateToken } = require('../middlewares/AuthMiddleware');

//Write Post
router.post('/', validateToken, async (req, res) => {
	const title = req.body;
	title.desc = req.body.desc;
	if (req.body.mainImg) {
		title.mainImg = req.body.mainImg;
	} else {
		title.mainImg = 'http://localhost:3000/uploads/NoImg.jpg';
	}

	title.subheading = req.body.subheading;

	title.nickname = req.user.nickname;
	title.userid = req.user.userid;

	Post.create(req.body);
	res.json('게시글 작성 완료');
});

//Update
router.put('/:id', validateToken, async (req, res) => {
	const title = req.body;
	title.id = req.params.id;
	title.userid = req.user.userid;
	title.desc = req.body.desc;

	Post.findOne({ where: { id: req.params.id } }).then(post => {
		if (post.userid === req.user.userid) {
			Post.update(req.body, { where: { id: req.params.id } });
			res.json('글 수정 완료');
		} else {
			res.json('글작성자만 글을 수정할 수 있습니다.');
		}
	});
});

//Delete
router.delete('/:id', validateToken, async (req, res) => {
	const id = req.params.id;
	id.userid = req.user.userid;

	if (req.user.userid == 'admin') {
		Post.findOne({ where: { id: req.params.id } }).then(post => {
			Post.destroy({ where: { id: id } });
			res.json('게시글 삭제 성공 (어드민 권한)');
		});
	} else {
		Post.findOne({ where: { id: req.params.id } })
			.then(post => {
				if (id === req.params.id) {
					if (post.userid === req.user.userid) {
						Post.destroy({ where: { id: req.params.id } });
						res.json('게시글 삭제 성공');
					} else {
						res.json('글작성자만 글을 삭제할 수 있습니다.');
					}
				} else {
					res.json('게시글을 찾을 수 없습니다.');
				}
			})
			.catch(() => {
				res.json('게시글을 찾을 수 없습니다.');
			});
	}
});

//Get Id
router.get('/:id', async (req, res) => {
	Post.findOne({ where: { id: req.params.id } }).then(post => {
		if (post) {
			res.json(post);
		} else {
			res.json('해당 게시글을 찾을 수 없습니다.');
		}
	});
});

//Get ALL
router.get('/', async (req, res) => {
	Post.findAll().then(post => {
		res.json(post);
	});
});

module.exports = router;
