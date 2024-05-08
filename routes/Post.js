const express = require('express');
const router = express.Router();
const { Post } = require('../models');
const { validateToken } = require('../middlewares/AuthMiddleware');
const authUtil = require('../response/authUtil');

//Write Post
router.post('/', validateToken, async (req, res) => {
	const title = req.body;
	title.desc = req.body.desc;

	try {
		if (req.body.mainImg) {
			title.mainImg = req.body.mainImg;
		} else {
			title.mainImg = `${SERVER_ORIGIN}/uploads/NoImg.jpg`;
		}

		title.subheading = req.body.subheading;
		title.userid = req.user.userid;

		await Post.create(req.body);

		return res.status(200).send(authUtil.successTrue(200, '게시글 작성 완료!'));
	} catch (err) {
		console.log(err);
		return res.status(501).send(authUtil.unknownError({ error: err }));
	}
});

//Update
router.put('/:id', validateToken, async (req, res) => {
	const title = req.body;
	title.id = req.params.id;
	title.desc = req.body.desc;
	title.mainImg = req.body.mainImg;
	title.subheading = req.body.subheading;

	try {
		await Post.findOne({ where: { id: req.params.id } }).then(async post => {
			if (!post) {
				return res
					.status(201)
					.send(authUtil.successFalse(201, '게시글을 찾을 수 없습니다.'));
			}

			if (
				req.user.isAdmin ||
				(req.user.isAdmin && post.userid === req.user.userid)
			) {
				await Post.update(req.body, { where: { id: req.params.id } });
				return res
					.status(201)
					.send(authUtil.successTrue(200, 'ADMIN : 게시글 수정 완료'));
			} else {
				try {
					if (post.userid === req.user.userid) {
						await Post.update(req.body, { where: { id: req.params.id } });
						return res
							.status(200)
							.send(authUtil.successTrue(200, '게시글 수정 완료!'));
					} else {
						return res
							.status(201)
							.send(authUtil.successFalse(201, '게시글 작성자만 수정할 수 있습니다.'));
					}
				} catch (err) {
					return res.status(501).send(authUtil.unknownError({ error: err }));
				}
			}
		});
	} catch (err) {
		console.log(err);
		return res.status(501).send(authUtil.unknownError({ end: err }));
	}
});

//Delete
router.delete('/:id', validateToken, async (req, res) => {
	try {
		await Post.findOne({ where: { id: req.params.id } }).then(async post => {
			if (!post) {
				return res
					.status(201)
					.send(authUtil.successFalse(201, '게시글을 찾을 수 없습니다.'));
			}

			if (
				req.user.isAdmin ||
				(req.user.isAdmin && post.userid === req.user.userid)
			) {
				await Post.destroy({ where: { id: req.params.id } });
				return res
					.status(200)
					.send(authUtil.successTrue(200, 'ADMIN : 게시글 삭제 완료!'));
			} else {
				if (post.userid === req.user.userid) {
					await Post.destroy({ where: { id: req.params.id } });
					return res
						.status(200)
						.send(authUtil.successTrue(200, '게시글 삭제 완료!'));
				} else {
					return res
						.status(201)
						.send(authUtil.successFalse(201, '글 작성자만 삭제할 수 있습니다.'));
				}
			}
		});
	} catch (err) {
		console.log(err);
		return res.status(501).send(authUtil.unknownError({ end: err }));
	}
});

const { Users } = require('../models');

//Get Id
router.get('/:id', async (req, res) => {
	try {
		await Post.findOne({
			where: { id: req.params.id },
			attributes: {
				exclude: ['userid'],
			},
			include: [
				{
					model: Users,
					attributes: ['nickname'],
				},
			],
		}).then(post => {
			if (post) {
				return res
					.status(200)
					.send(authUtil.successTrue(200, '게시글을 찾았습니다.', post));
			} else {
				return res
					.status(404)
					.send(authUtil.successTrue(404, '게시글을 찾을 수 없습니다.'));
			}
		});
	} catch (err) {
		console.log(err);
		return res.status(501).send(authUtil.unknownError({ error: err }));
	}
});

//Get ALL
router.get('/', async (req, res) => {
	try {
		await Post.findAll({
			attributes: {
				exclude: ['userid'],
			},
			include: [
				{
					model: Users,
					attributes: ['nickname'],
				},
			],
		}).then(post => {
			if (post) {
				return res
					.status(200)
					.send(authUtil.successTrue(200, '게시글을 찾았습니다.', post));
			} else {
				return res
					.status(404)
					.send(authUtil.successTrue(404, '게시글을 찾을 수 없습니다.'));
			}
		});
	} catch (err) {
		console.log(err);
		return res.status(501).send(authUtil.unknownError({ error: err }));
	}
});

module.exports = router;
