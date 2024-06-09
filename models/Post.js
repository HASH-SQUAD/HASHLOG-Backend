const Users = require('./User.js');

module.exports = (sequelize, DataTypes) => {
	const Post = sequelize.define(
		'Post',
		{
			title: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			desc: {
				type: DataTypes.TEXT,
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
				type: DataTypes.TEXT,
				allowNull: false,
			},
		},
		{
			paranoid: true,
			charset: 'utf8',
			collate: 'utf8_general_ci',
		}
	);
	Post.associate = db => {
		db.Post.belongsTo(db.Users, {
			foreignKey: { name: 'userid', allowNull: false },
			targetKey: ['userid'],
		});
	};
	return Post;
};
