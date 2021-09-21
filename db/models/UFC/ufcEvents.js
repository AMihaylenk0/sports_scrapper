const model = (sequelize, DataTypes) => {
	return sequelize.define('UFCEvents', {
		eventId: {
			unique: true,
			allowNull: false,
			type: DataTypes.STRING
		},
		fights: {
			allowNull: false,
			type: DataTypes.JSON
		},
	});
};
export default model