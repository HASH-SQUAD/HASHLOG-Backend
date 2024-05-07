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

	if (
		nickname == 'ADMIN' ||
		nickname == 'admin' ||
		userid == 'admin' ||
		userid == 'ADMIN'
	) {
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
		return res.status(500).send(authUtil.successFalse(500, '로그인 실패'));
	}
});

//Update
router.put('/:id', async (req, res) => {
	const { userid, password, nickname } = req.body;

	if (nickname == 'ADMIN' || nickname == 'admin') {
		res.json('ADMIN 닉네임은 사용하실 수 없습니다.');
	} else {
		if (userid === req.params.id) {
			if (password) {
				bcrypt.hash(password, 10).then(hash => {
					Users.update(
						{
							userid: userid,
							password: hash,
							nickname: nickname,
						},
						{ where: { userid: userid } }
					);
				});
				Post.update(
					{
						userid: userid,
						nickname: nickname,
					},
					{ where: { userid: userid } }
				);
				res.json('계정정보 수정 완료');
			}
		} else {
			res.json('계정정보 수정 실패');
		}
	}
});

//Delete
router.delete('/:id', async (req, res) => {
	const { userid, password } = req.body;

	const user = await Users.findOne({ where: { userid: userid } });

	if (userid === req.params.id) {
		bcrypt.compare(password, user.password).then(match => {
			if (!match) {
				return res.json({
					error: '비밀번호가 일치하지 않습니다.',
				});
			} else {
				Users.destroy({ where: { userid: userid } });
				res.json('계정 삭제 성공');
			}
		});
	} else {
		res.json('아이디가 일치하지 않습니다.');
	}
});

module.exports = router;
