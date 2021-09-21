const model = (sequelize, DataTypes) => {
	return sequelize.define('UFCEvents', {
		eventId: {
			unique: true,
			allowNull: true,
			type: DataTypes.STRING
		},
		fights: {
			allowNull: true,
			type: DataTypes.JSON
		},
	});
};
export default model