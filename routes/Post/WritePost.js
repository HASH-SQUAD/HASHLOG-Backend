const { Post } = require('../../models');
const authUtil = require('../../response/authUtil.js');

const WritePost = async (req, res) => {
	const title = req.body;
	title.desc = req.body.desc;

	try {
		if (req.body.mainImg) {
			title.mainImg = req.body.mainImg;
		} else {
			title.mainImg = `${SERVER_ORIGIN}/common/NoImg.jpg`;
		}

		title.subheading = req.body.subheading;
		title.userid = req.user.userid;

		await Post.create(req.body);

		return res.status(200).send(authUtil.successTrue(200, '게시글 작성 완료!'));
	} catch (err) {
		console.log(err);
		return res.status(501).send(authUtil.unknownError({ error: err }));
	}
};

module.exports = WritePost;
