const { Post } = require('../../models');
const { Users } = require('../../models');
const authUtil = require('../../response/authUtil.js');

const GetPost_All = async (req, res) => {
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
};

module.exports = GetPost_All;
