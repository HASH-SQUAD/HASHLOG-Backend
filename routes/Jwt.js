const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const { verify } = require('jsonwebtoken');
const { generateAccessToken } = require('../tokens/jwt.js');
const authUtil = require('../response/authUtil');

const secret = process.env.SECRET_KEY;
router.post('/', async (req, res) => {
	const { accessToken, refreshToken } = req.body;

	try {
		const decoded = verify(accessToken, secret);
		const userId = decoded.id;
		const user = await Users.findOne({
			where: {
				userId,
			},
		});
		if (user.refresh === refreshToken) {
			const accessToken = generateAccessToken(user.userid);
			return res
				.status(200)
				.send(
					authUtil.jwtSent(
						200,
						'Refresh 토큰을 재발급 했습니다.',
						accessToken,
						refreshToken
					)
				);
		} else {
			return res.status(501).send(authUtil.successFalse(200, '알수없는 에러발생'));
		}
	} catch (err) {
		console.log(err);
		return res
			.status(501)
			.send(authUtil.successFalse(200, '디코딩 중 문제발생 Console 확인바람'));
	}
});

module.exports = router;
