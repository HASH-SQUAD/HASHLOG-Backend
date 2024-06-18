const bcrypt = require('bcrypt');
const authUtil = require('../../response/authUtil');
const { Users } = require('../../models');

const DeleteProfileImg = async (req, res) => {
	try {
		const user = await Users.findOne({
			where: { userid: req.user.dataValues.userid },
		});

		if (!user) {
			return res.status(200).send(authUtil.successFalse(200, '유저를 찾을 수 없습니다.'));
		} else {
			Users.update(
				{ profileImg: `${process.env.SERVER_ORIGIN}/common/NoUserImg.png` },
				{ where: { userid: req.user.dataValues.userid } }
			);
			return res.status(200).send(authUtil.successTrue(200, '성공적으로 삭제되었습니다.'));
		}
	} catch (err) {
		console.log(err);
		return res.status(500).send(authUtil.unknownError({ error: err }));
	}
};

module.exports = DeleteProfileImg;
