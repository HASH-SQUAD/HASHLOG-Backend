module.exports = (sequelize, DataTypes) => {
	const Post = sequelize.define('Post', {
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		desc: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		nickname: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		userid: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		mainImg: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		subheading: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	});

	return Post;
};
