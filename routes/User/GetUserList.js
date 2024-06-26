const authUtil = require('../../response/authUtil');
const { Users } = require('../../models');

const GetUserList = async (req, res) => {
	const pageNum = req.param('page');
	let offset = 0;
	if (pageNum > 1) {
		offset = 10 * (pageNum - 1);
	}

	if (!req.user.dataValues.isAdmin) {
		return res.status(401).send(authUtil.successFalse(401, '어드민만 조회가능합니다.'));
	}
	try {
		await Users.findAll({
			offset: offset,
			limit: 10,
		}).then(data => {
			if (data) {
				res.status(200).send(authUtil.successTrue(200, '유저를 찾았습니다.', data));
			} else {
				res
					.status(401)
					.send(authUtil.successFalse(401, '유저가 존재하지 않습니다.', data));
			}
		});
	} catch (err) {
		console.log(err);
		return res.status(500).send(authUtil.unknownError({ error: err }));
	}
};

module.exports = GetUserList;
