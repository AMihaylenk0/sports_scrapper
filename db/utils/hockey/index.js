import dotenv from "dotenv";
dotenv.config()
import sql from 'sequelize'
const { Sequelize, Op, DataTypes } = sql;
import HockeyStandingsModel from "../../models/hockey/hockeyStandings.js"
import HockeyScheduleModel from "../../models/hockey/hockeySchedule.js"
import HockeyTeamsStatsModel from "../../models/hockey/hockeyTeamsStats.js"
import HockeyPlayersStatsModel from "../../models/hockey/hockeyPlayersStats.js"
import HockeyPlayersModel from "../../models/hockey/hockeyPlayers.js"

function initDB() {
 let sql = new Sequelize(`${process.env.DATABASE_URI}?sslmode=require`, {
    url: process.env.DATABASE_URI,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // very important
      }
    }
  })
  return sql
}
let sequelize = initDB();
const HockeyStandings = HockeyStandingsModel(sequelize, DataTypes);
const HockeySchedule = HockeyScheduleModel(sequelize, DataTypes);
const HockeyTeamsStats = HockeyTeamsStatsModel(sequelize, DataTypes);
const HockeyPlayersStats = HockeyPlayersStatsModel(sequelize, DataTypes);
const HockeyPlayers = HockeyPlayersModel(sequelize, DataTypes);

// (async () => await sequelize.sync({ alter: true, force: false }))();

async function saveHockeyStandings(data) {
  try {
    await HockeyStandings.upsert( data )
    console.log('hockey standings updated')
  } catch (error) {
    throw error
  }
}
async function saveHockeySchedule(data) {
  try {
    await HockeySchedule.upsert( data )
    console.log('hockey schedule updated')
  } catch (error) {
    throw error
  }
}
async function saveHockeyTeamsStats(data) {
  try {
    await HockeyTeamsStats.upsert( data )
    console.log('hockey teams stats updated')
  } catch (error) {
    throw error
  }
}
async function saveHockeyPlayersStats(data) {
  try {
    await HockeyPlayersStats.upsert( data )
    console.log('hockey players stats updated')
  } catch (error) {
    throw error
  }
}
async function saveHockeyPlayers(data) {
  try {
    await HockeyPlayers.upsert( data )
    console.log('hockey players stats updated')
  } catch (error) {
    throw error
  }
}

export async function saveHockeyStats(KHLStandings, KHLSchedule, KHLTeamsStats, KHLPlayersStats, KHLPlayers){
  await saveHockeyStandings(KHLStandings)
  await saveHockeySchedule(KHLSchedule)
  await saveHockeyTeamsStats(KHLTeamsStats)
  await saveHockeyPlayersStats(KHLPlayersStats)
  await saveHockeyPlayers(KHLPlayers)
  sequelize.close();
}