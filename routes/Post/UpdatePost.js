const { Post } = require('../../models');
const authUtil = require('../../response/authUtil.js');

const UpdatePost = async (req, res) => {
	const title = req.body;
	title.id = req.params.id;
	title.desc = req.body.desc;
	title.mainImg = req.body.mainImg;
	title.subheading = req.body.subheading;

	try {
		await Post.findOne({ where: { id: req.params.id } }).then(async post => {
			if (!post) {
				return res
					.status(401)
					.send(authUtil.successFalse(401, '게시글을 찾을 수 없습니다.'));
			}

			if (
				req.user.isAdmin ||
				(req.user.isAdmin && post.userid === req.user.userid)
			) {
				await Post.update(req.body, { where: { id: req.params.id } });
				return res
					.status(200)
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
							.status(401)
							.send(authUtil.successFalse(401, '게시글 작성자만 수정할 수 있습니다.'));
					}
				} catch (err) {
					return res.status(500).send(authUtil.unknownError({ error: err }));
				}
			}
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send(authUtil.unknownError({ end: err }));
	}
};

module.exports = UpdatePost;
