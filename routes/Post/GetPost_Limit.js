const { Post, Users } = require('../../models');
const authUtil = require('../../response/authUtil.js');

const GetPost_Limit = async (req, res) => {
	const pageNum = req.param('page');

	let offset = 0;
	if (pageNum > 1) {
		offset = 20 * (pageNum - 1);
	}

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
			order: [['createdAt', 'desc']],
			offset: offset,
			limit: 20,
		}).then(post => {
			if (post) {
				return res
					.status(200)
					.send(authUtil.successTrue(200, '게시글을 찾았습니다.', post));
			} else {
				return res
					.status(204)
					.send(authUtil.successTrue(204, '게시글을 찾을 수 없습니다.'));
			}
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send(authUtil.unknownError({ error: err }));
	}
};

module.exports = GetPost_Limit;
