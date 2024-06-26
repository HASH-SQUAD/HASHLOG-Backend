const { Post, Users } = require('../../models');
const authUtil = require('../../response/authUtil.js');

const GetPost_ById = async (req, res) => {
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
				{
					model: Users,
					attributes: ['profileImg'],
				},
			],
		}).then(post => {
			if (post) {
				return res
					.status(200)
					.send(authUtil.successTrue(200, '게시글을 찾았습니다.', post));
			} else {
				return res
					.status(401)
					.send(authUtil.successTrue(401, '게시글을 찾을 수 없습니다.'));
			}
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send(authUtil.unknownError({ error: err }));
	}
};

module.exports = GetPost_ById;
