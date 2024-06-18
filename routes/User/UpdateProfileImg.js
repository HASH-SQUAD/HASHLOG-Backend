const bcrypt = require('bcrypt');
const authUtil = require('../../response/authUtil');
const { Users } = require('../../models');

const UpdateProfileImg = async (req, res) => {
	const { profileImg } = req.body;
	if (!profileImg) {
		return res.status(200).send(authUtil.successFalse(200, '데이터가 없습니다.'));
	}

	try {
		const user = await Users.findOne({
			where: { userid: req.user.dataValues.userid },
		});

		if (!user) {
			return res.status(200).send(authUtil.successFalse(200, '유저를 찾을 수 없습니다.'));
		} else {
			Users.update(
				{ profileImg: profileImg },
				{ where: { userid: req.user.dataValues.userid } }
			);
			return res.status(200).send(authUtil.successTrue(200, '성공적으로 수정되었습니다.'));
		}
	} catch (err) {
		console.log(err);
		return res.status(500).send(authUtil.unknownError({ error: err }));
	}
};

module.exports = UpdateProfileImg;
