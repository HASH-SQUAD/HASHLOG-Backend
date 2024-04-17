const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const { Post } = require('../models');
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const { validateToken } = require('../middlewares/AuthMiddleware');

//Register
router.post('/', async (req, res) => {
	const { userid, password, email, nickname } = req.body;

	if (
		nickname == 'ADMIN' ||
		nickname == 'admin' ||
		userid == 'admin' ||
		userid == 'ADMIN'
	) {
		res.json({ error: 'ADMIN 닉네임&아이디는 사용하실 수 없습니다.' });
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
				res.json('회원가입 성공!');
			});
		} else {
			res.json({ error: '이미 존재하는 아이디입니다.' });
		}
	}
});

//Login
router.post('/login', async (req, res) => {
	const { userid, password, nickname } = req.body;

	const user = await Users.findOne({ where: { userid: userid } });

	if (!user) {
		return res.json({ error: '존재하지 않는 아이디입니다.' });
	}

	bcrypt.compare(password, user.password).then(match => {
		if (!match)
			return res.json({
				error: '비밀번호가 일치하지 않습니다.',
			});

		// accessToken 발급및 Respond
		const accessToken = sign(
			{ userid: user.userid, nickname: user.nickname },
			'importantsecret'
		);
		return res.json({
			code: 200,
			token: accessToken,
			userid: userid,
			nickname: user.nickname,
		});
	});
});

router.get('/state', validateToken, async (req, res) => {
	res.json({ state: true });
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
