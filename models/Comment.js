module.exports = (sequelize, DataTypes) => {
	const Comments = sequelize.define('Comments', {
		commentBody: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		userid: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		nickname: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		postId: {
			type: DataTypes.STRING,
			allowNull: false,
		}
	});

	return Comments;
};
