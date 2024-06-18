const bcrypt = require('bcrypt');
const authUtil = require('../../response/authUtil');
const { Users } = require('../../models');

const GetUserList = async (req, res) => {
	console.log(req.user.dataValues.isAdmin);

	const pageNum = req.param('page');
	let offset = 0;
	if (pageNum > 1) {
		offset = 20 * (pageNum - 1);
	}

	if (!req.user.dataValues.isAdmin) {
		return res.status(200).send(authUtil.successFalse(200, '어드민만 조회가능합니다.'));
	}
	try {
		await Users.findAll({
			offset: offset,
			limit: 20,
		}).then(data => {
			if (data) {
				res.status(200).send(authUtil.successTrue(200, '유저를 찾았습니다.', data));
			}
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send(authUtil.unknownError({ error: err }));
	}
};

module.exports = GetUserList;
