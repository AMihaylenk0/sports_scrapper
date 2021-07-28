const model = (sequelize, DataTypes) => {
	return sequelize.define('BasketballLeaderboards', {
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