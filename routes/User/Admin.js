const authUtil = require('../../response/authUtil');
const { Users } = require('../../models');

const Admin = async (req, res) => {
	const { userid, accessCode, givenAccess } = req.body;
	const ADMIN_ACCESS_CODE = process.env.ADMIN_ACCESS_CODE;

	try {
		if (accessCode === ADMIN_ACCESS_CODE) {
			const user = await Users.findOne({ where: { userid: userid } });

			if (!user) {
				return res
					.status(401)
					.send(authUtil.successTrue(401, '존재하지 않는 아이디입니다.'));
			}

			try {
				await Users.update(
					{ isAdmin: givenAccess },
					{ where: { userid: userid } }
				);
				return res
					.status(200)
					.send(authUtil.successTrue(200, '성공적으로 변경되었습니다.'));
			} catch (error) {
				return res
					.status(500)
					.send(
						authUtil.successFalse(500, '변경도중 오류가 발생하였습니다.', { error: err })
					);
			}
		} else {
			return res
				.status(403)
				.send(authUtil.successFalse(403, '액세스 코드가 맞지 않습니다.'));
		}
	} catch (err) {
		return res.status(500).send(authUtil.unknownError({ error: err }));
	}
};

module.exports = Admin;
