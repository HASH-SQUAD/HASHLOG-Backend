const bcrypt = require('bcrypt');
const authUtil = require('../../response/authUtil');
const { Users } = require('../../models');

const UpdatePassword = async (req, res) => {
	const { password, newPassword } = req.body;

	try {
		const user = await Users.findOne({
			where: { userid: req.user.dataValues.userid },
		});

		bcrypt.compare(password, user.password).then(async match => {
			if (!match) {
				return res
					.status(200)
					.send(authUtil.successFalse(200, '비밀번호가 일치하지 않습니다.'));
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
						.status(500)
						.send(authUtil.successFalse(500, '업데이트 도중 에러가 발생했습니다.'));
				}
			}
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send(authUtil.unknownError({ error: err }));
	}
};

module.exports = UpdatePassword;
