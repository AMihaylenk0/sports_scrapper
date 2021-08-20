import dotenv from "dotenv";
dotenv.config()
import sql from 'sequelize'
const { Sequelize, Op, DataTypes } = sql;
import TennisRankingsModel from "../../models/tennis/tennisRankings.js"
import TennisSceduleModel from "../../models/tennis/tennisScedule.js"

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
const TennisRankings = TennisRankingsModel(sequelize, DataTypes);
const TennisScedule = TennisSceduleModel(sequelize, DataTypes);

// (async () => await sequelize.sync({ alter: true, force: false }))();

async function saveTennisRankings(data) {
  try {
    await TennisRankings.upsert( data )
    console.log('tennis rankings updated')
  } catch (error) {
    throw error
  }
}
async function saveTennisScedule(data) {
  try {
    await TennisScedule.upsert( data )
    console.log('tennis scedule updated')
  } catch (error) {
    throw error
  }
}

export async function saveTennisStats(tennisRankings, tennisScedule){
  await saveTennisRankings(tennisRankings)
  await saveTennisScedule(tennisScedule)
  sequelize.close();
}