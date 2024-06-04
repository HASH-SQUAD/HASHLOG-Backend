const authUtil = require('../../response/authUtil');

const LoginState = async (req, res) => {
	return res.status(201).send(
		authUtil.successTrue(201, '회원상태 조회완료', {
			nickname: req.user.dataValues.nickname,
			email: req.user.dataValues.email,
			isAdmin: req.user.dataValues.isAdmin,
		})
	);
};
module.exports = LoginState;
