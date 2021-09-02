const model = (sequelize, DataTypes) => {
	return sequelize.define('HockeyScedules', {
		league: {
			allowNull: false,
			unique: true,
			type: DataTypes.STRING
		},
		season: {
			allowNull: false,
			unique: true,
			type: DataTypes.INTEGER
		},
		items: {
			allowNull: false,
			type: DataTypes.JSON
		},
	});
};
export default model