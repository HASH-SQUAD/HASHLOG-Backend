const authUtil = require('../../response/authUtil');
const { Users } = require('../../models');
const bcrypt = require('bcrypt');

const SignUp = async (req, res) => {
	const { userid, password, email, nickname } = req.body;

	if (nickname === 'ADMIN' || userid === 'ADMIN') {
		return res
			.status(500)
			.send(authUtil.successFalse(500, 'ADMIN 닉네임&아이디는 사용하실 수 없습니다.'));
	} else {
		// 유저아이디 존재여부 확인
		const user = await Users.findOne({ where: { userid: userid } });

		if (!user) {
			bcrypt.hash(password, 10).then(hash => {
				Users.create({
					userid: userid,
					password: hash,
					email: email,
					nickname: nickname,
					isAdmin: false,
					profileImg: 'http://localhost:3000/uploads/NoUserImg.png',
				});
				return res
					.status(201)
					.send(authUtil.successTrue(201, '유저 회원가입에 성공하였습니다.'));
			});
		} else {
			return res
				.status(500)
				.send(authUtil.successFalse(500, '이미 존재하는 아이디입니다.'));
		}
	}
};

module.exports = SignUp;
