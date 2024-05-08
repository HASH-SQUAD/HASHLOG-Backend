const bcrypt = require('bcrypt');
const authUtil = require('../../response/authUtil');
const { Users } = require('../../models');
const {
	generateAccessToken,
	generateRefreshToken,
} = require('../Jwt.js');

const SignIn = async (req, res) => {
	const { userid, password } = req.body;

	try {
		const user = await Users.findOne({ where: { userid: userid } });

		if (!user) {
			return res.status(200).send(authUtil.successTrue(400, '존재하지 않는 아이디입니다.'));
		}

		bcrypt.compare(password, user.password).then(async match => {
			if (!match) {
				return res
					.status(400)
					.send(authUtil.successFalse(400, '비밀번호가 맞지 않습니다.'));
			}

			// accessToken 발급및 Respond
			const accessToken = generateAccessToken(userid);
			const refreshToken = generateRefreshToken(userid);

			await Users.update(
				{ refreshToken: refreshToken },
				{ where: { userid: userid } }
			);
			if (user.isAdmin) {
				return res
					.status(200)
					.send(authUtil.jwtSent(200, '어드민 로그인 성공', accessToken, refreshToken));
			}
			return res
				.status(200)
				.send(authUtil.jwtSent(200, '유저 로그인 성공', accessToken, refreshToken));
		});
	} catch (err) {
		console.error(err);
		return res
			.status(500)
			.send(authUtil.successFalse(500, '로그인 실패', { error: err }));
	}
};

module.exports = SignIn;
