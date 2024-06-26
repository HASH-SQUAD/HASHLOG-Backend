const bcrypt = require('bcrypt');
const authUtil = require('../../response/authUtil');
const { Users } = require('../../models');

const UpdateNickname = async (req, res) => {
	const { nickname, password } = req.body;
	const userCommon = req.user.dataValues;

	if (nickname === 'ADMIN') {
		return res
			.status(401)
			.send(authUtil.successFalse(401, 'ADMIN 닉네임은 사용하실 수 없습니다.'));
	} else {
		try {
			const user = await Users.findOne({
				where: { userid: userCommon.userid },
			});

			bcrypt.compare(password, user.password).then(async match => {
				if (!match) {
					return res
						.status(401)
						.send(authUtil.successFalse(401, '비밀번호가 맞지 않습니다.'));
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
						.status(500)
						.send(authUtil.successFalse(500, '업데이트 도중 에러가 발생했습니다.'));
				}
			});
		} catch (err) {
			console.log(err);
			return res.status(500).send(authUtil.unknownError({ error: err }));
		}
	}
}

module.exports = UpdateNickname;