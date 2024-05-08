const bcrypt = require('bcrypt');
const authUtil = require('../../response/authUtil');
const { Users } = require('../../models');

const DeleteAccount = async (req, res) => {
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
		return res.status(501).send(authUtil.unknownError({ error: err }));
	}
};

module.exports = DeleteAccount;
