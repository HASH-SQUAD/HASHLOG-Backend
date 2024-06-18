const bcrypt = require('bcrypt');
const authUtil = require('../../response/authUtil');
const { Users } = require('../../models');

const GetUserList = async (req, res) => {
	try {
		await Users.findAll().then(data => {
			console.log(data);
			if (data) {
				res.status(200).send(authUtil.successTrue(200, '유저를 찾았습니다.', data));
			}
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send(authUtil.unknownError({ error: err }));
	}
};

module.exports = GetUserList