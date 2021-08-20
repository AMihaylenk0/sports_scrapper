import dotenv from "dotenv";
dotenv.config()
import sql from 'sequelize'
const { Sequelize, Op, DataTypes } = sql;
import FootballPlayersStatsModel from "../../models/football/footballPlayersStats.js"
import FootballTeamsStatsModel from "../../models/football/footballTeamsStats.js"
import FootballStandingsModel from "../../models/football/footballStandings.js"

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
const FootballPlayersStats = FootballPlayersStatsModel(sequelize, DataTypes);
const FootballTeamsStats = FootballTeamsStatsModel(sequelize, DataTypes);
const FootballStandings = FootballStandingsModel(sequelize, DataTypes);

// (async () => await sequelize.sync({ alter: true, force: false }))();

async function saveFootballPlayersStats(data) {
  try {
    await FootballPlayersStats.bulkCreate( data, { updateOnDuplicate: ["items"] } )
    console.log('football players stats updated')
  } catch (error) {
    throw error
  }
}
async function saveFootballTeamsStats(data) {
  try {
    await FootballTeamsStats.bulkCreate( data, { updateOnDuplicate: ["items"] } )
    console.log('football teams stats updated')
  } catch (error) {
    throw error
  }
}
async function saveFootballStandings(data) {
  try {
    await FootballStandings.bulkCreate( data, { updateOnDuplicate: ["items"] } )
    console.log('football standings updated')
  } catch (error) {
    throw error
  }
}

export async function saveFootballStats(footballStandings, footballTeamsStats, footballPlayersStats){
  await saveFootballPlayersStats(footballPlayersStats)
  await saveFootballTeamsStats(footballTeamsStats)
  await saveFootballStandings(footballStandings)
  sequelize.close();
}