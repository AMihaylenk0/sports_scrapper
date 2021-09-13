const model = (sequelize, DataTypes) => {
	return sequelize.define('UFCAthelets', {
		athleteId: {
			allowNull: false,
			unique: true,
			type: DataTypes.STRING
		},
		name: {
			allowNull: true,
			type: DataTypes.STRING
		},
		nickname: {
			allowNull: true,
			type: DataTypes.STRING
		},
		division: {
			allowNull: true,
			type: DataTypes.STRING
		},
		country: {
			allowNull: true,
			type: DataTypes.STRING
		},
		wins: {
			allowNull: true,
			type: DataTypes.STRING
		},
		losses: {
			allowNull: true,
			type: DataTypes.STRING
		},
		draws: {
			allowNull: true,
			type: DataTypes.STRING
		},
		status: {
			allowNull: true,
			type: DataTypes.STRING
		},
		city: {
			allowNull: true,
			type: DataTypes.STRING
		},
		height: {
			allowNull: true,
			type: DataTypes.STRING
		},
		weight: {
			allowNull: true,
			type: DataTypes.STRING
		},
		debuteDate: {
			allowNull: true,
			type: DataTypes.STRING
		},
		armSpan: {
			allowNull: true,
			type: DataTypes.STRING
		},
		legSpan: {
			allowNull: true,
			type: DataTypes.STRING
		},
		strikingAccuracy: {
			allowNull: true,
			type: DataTypes.STRING
		},
		grapplingAccuracy: {
			allowNull: true,
			type: DataTypes.STRING
		},
		fightingStats: {
			allowNull: true,
			type: DataTypes.JSON
		},
		promotedStats: {
			allowNull: true,
			type: DataTypes.JSON
		},
	});
};
export default model