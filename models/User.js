module.exports = (sequelize, DataTypes) => {
	const Users = sequelize.define(
		'Users',
		{
			userid: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				primaryKey: true,
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			nickname: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			refreshToken: {
				type: DataTypes.STRING,
			},
			isAdmin: {
				type: DataTypes.BOOLEAN
			}
		},
		{
			paranoid: true,
			charset: 'utf8',
			collate: 'utf8_general_ci',
		}
	);

	return Users;
};
