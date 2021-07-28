import dotenv from "dotenv";
dotenv.config()
import sql from 'sequelize'
const { Sequelize, Op, DataTypes } = sql;
import BasketballLeaderboardsModel from "./models/basketball/basketballLeaderboards.js"
import BasketballStandingsModel from "./models/basketball/basketballStandings.js"
import BasketballTeamsStatsModel from "./models/basketball/basketballTeamsStats.js"

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
const BasketballLeaderboards = BasketballLeaderboardsModel(sequelize, DataTypes);
const BasketballStandings = BasketballStandingsModel(sequelize, DataTypes);
const BasketballTeamsStats = BasketballTeamsStatsModel(sequelize, DataTypes);

// (async () => await sequelize.sync({ alter: true, force: false }))();

async function getBasketballLeaderboards(data) {
  try {
    await BasketballLeaderboards.bulkCreate( data, { updateOnDuplicate: ["items"] } )
    console.log('basketball leaderboards updated')
  } catch (error) {
    throw error
  }
}
async function getBasketballStandings(data) {
  try {
    await BasketballStandings.bulkCreate( data, { updateOnDuplicate: ["items"] } )
    console.log('basketball standings updated')
  } catch (error) {
    throw error
  }
}
async function getBasketBasketballTeamsStats(data) {
  try {
    await BasketballTeamsStats.bulkCreate( data, { updateOnDuplicate: ["items"] } )
    console.log('basketball teams stats updated')
  } catch (error) {
    throw error
  }
}

export async function getBasketballStats(basketballLeaderboards, basketballStandings, basketballTeamsStats){
  await getBasketballLeaderboards(basketballLeaderboards)
  await getBasketballStandings(basketballStandings)
  await getBasketBasketballTeamsStats(basketballTeamsStats)
  sequelize.close();
}