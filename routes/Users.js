const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const authUtil = require('../response/authUtil');
const { Users } = require('../models');
const { Post } = require('../models');
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middlewares/AuthMiddleware');
const {
	generateAccessToken,
	generateRefreshToken,
} = require('../tokens/jwt.js');
const { where } = require('sequelize');

//Check Login State
router.get('/', validateToken, async (req, res) => {
	return res.status(201).send(
		authUtil.successTrue(201, '회원상태 조회완료', {
			nickname: req.user.dataValues.nickname,
			email: req.user.dataValues.email,
		})
	);
});

//Register
router.post('/signup', async (req, res) => {
	const { userid, password, email, nickname } = req.body;

	if (nickname === 'ADMIN' || userid === 'ADMIN') {
		return res
			.status(500)
			.send(authUtil.successFalse(500, 'ADMIN 닉네임은 사용하실 수 없습니다.'));
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
});

//Login
const secret = process.env.SECRET_KEY;
router.post('/signin', async (req, res) => {
	const { userid, password } = req.body;

	try {
		const user = await Users.findOne({ where: { userid: userid } });

		if (!user) {
			return res.status(200).send(authUtil.successTrue(400, '존재하지 않는 아이디입니다.'));
		}

		bcrypt.compare(password, user.password).then(async match => {
			if (!match) {
				return res
					.status(200)
					.send(authUtil.successFalse(400, '비밀번호가 맞지 않습니다.'));
			}

			// accessToken 발급및 Respond
			const accessToken = generateAccessToken(userid);
			const refreshToken = generateRefreshToken(userid);

			await Users.update(
				{ refreshToken: refreshToken },
				{ where: { userid: userid } }
			);
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
});

//Update Nickname
router.put('/update/nickname', validateToken, async (req, res) => {
	const { nickname, password } = req.body;
	const userCommon = req.user.dataValues;

	if (nickname === 'ADMIN') {
		return res
			.status(500)
			.send(authUtil.successFalse(500, 'ADMIN 닉네임은 사용하실 수 없습니다.'));
	} else {
		try {
			const user = await Users.findOne({
				where: { userid: userCommon.userid },
			});

			bcrypt.compare(password, user.password).then(async match => {
				if (!match) {
					return res
						.status(200)
						.send(authUtil.successFalse(400, '비밀번호가 맞지 않습니다.'));
				}
				try {
					await Users.update(
						{ nickname: nickname },
						{ where: { userid: req.user.dataValues.userid } }
					);
					return res
						.status(200)
						.send(authUtil.successTrue(200, '닉네임 수정이 완료되었습니다.'));
				} catch (err) {
					return res
						.status(501)
						.send(authUtil.successFalse(501, '업데이트 도중 에러가 발생했습니다.'));
				}
			});
		} catch (err) {
			console.log(err);
			return res.status(501).send(
				authUtil.successFalse(501, '알수 없는 에러가 발생하였습니다. Console을 확인해주세요', {
					error: err,
				})
			);
		}
	}
});

//Update Password
router.put('/update/password', validateToken, async (req, res) => {
	const { password, newPassword } = req.body;

	try {
		const user = await Users.findOne({
			where: { userid: req.user.dataValues.userid },
		});

		bcrypt.compare(password, user.password).then(async match => {
			if (!match) {
				return res
					.status(200)
					.send(authUtil.successFalse(400, '비밀번호가 맞지 않습니다.'));
			} else {
				try {
					bcrypt.hash(newPassword, 10).then(hash => {
						Users.update(
							{ password: hash },
							{ where: { userid: req.user.dataValues.userid } }
						);
					});
					return res
						.status(200)
						.send(authUtil.successTrue(200, '비밀번호 수정이 완료되었습니다.'));
				} catch (err) {
					return res
						.status(501)
						.send(authUtil.successFalse(501, '업데이트 도중 에러가 발생했습니다.'));
				}
			}
		});
	} catch (err) {
		console.log(err);
		return res.status(501).send(
			authUtil.successFalse(501, '알수 없는 에러가 발생하였습니다. Console을 확인해주세요', {
				error: err,
			})
		);
	}
});

//Delete
router.delete('/delete', validateToken, async (req, res) => {
	const { password } = req.body;

	try {
		const user = await Users.findOne({
			where: { userid: req.user.dataValues.userid },
		});
		bcrypt.compare(password, user.password).then(match => {
			if (!match) {
				return res
					.status(501)
					.send(authUtil.successFalse(501, '계정을 찾을 수 없습니다.'));
			} else {
				Users.destroy({ where: { userid: req.user.dataValues.userid } });
				return res.status(200).send(authUtil.successTrue(200, '계정 삭제성공'));
			}
		});
	} catch (err) {
		console.log(err);
		return res
			.status(501)
			.send(authUtil.successFalse(501, '알 수 없는 에러가 발생하였습니다.', { error: err }));
	}
});

module.exports = router;
