const model = (sequelize, DataTypes) => {
	return sequelize.define('UFCLeaders', {
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