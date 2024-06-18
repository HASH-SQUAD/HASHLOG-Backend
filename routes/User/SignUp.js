const authUtil = require('../../response/authUtil');
const { Users } = require('../../models');
const bcrypt = require('bcrypt');

const SignUp = async (req, res) => {
	const { userid, password, email, nickname } = req.body;

	if (nickname === 'ADMIN' || userid === 'ADMIN') {
		return res
			.status(204)
			.send(authUtil.successFalse(204, 'ADMIN 닉네임&아이디는 사용하실 수 없습니다.'));
	} else {
		try {
			const user = await Users.findOne({ 
				where: { userid: userid }, 
				paranoid: false 
			});

			if (user) {
				return res
					.status(204)
					.send(authUtil.successFalse(204, '이미 존재하는 아이디입니다.'));
			} else {
				const hash = await bcrypt.hash(password, 10);
				await Users.create({
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
			}
		} catch (error) {
			console.error(error);
			return res
				.status(500)
				.send(authUtil.unknownError({ error: error }));
		}
	}
};

module.exports = SignUp;
