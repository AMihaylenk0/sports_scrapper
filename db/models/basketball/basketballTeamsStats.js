const model = (sequelize, DataTypes) => {
	return sequelize.define('BasketballTeamsStats', {
		season: {
			allowNull: false,
			type: DataTypes.INTEGER
		},
		league: {
			allowNull: false,
			type: DataTypes.STRING,
			unique: true
		},
		statsCategory: {
			allowNull: false,
			type: DataTypes.STRING
		},
		items: {
			allowNull: false,
			type: DataTypes.JSON
		},
	});
};
export default model