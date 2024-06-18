const authUtil = require('../../response/authUtil');

const LoginState = async (req, res) => {
	return res.status(200).send(
		authUtil.successTrue(200, '회원상태 조회완료', {
			nickname: req.user.dataValues.nickname,
			email: req.user.dataValues.email,
			profileImg: req.user.dataValues.profileImg,
			isAdmin: req.user.dataValues.isAdmin,
		})
	);
};
module.exports = LoginState;
