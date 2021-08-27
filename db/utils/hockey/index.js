import dotenv from "dotenv";
dotenv.config()
import sql from 'sequelize'
const { Sequelize, Op, DataTypes } = sql;
import HockeyStandingsModel from "../../models/hockey/hockeyStandings.js"
import HockeySceduleModel from "../../models/hockey/hockeyScedule.js"

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
const HockeyScedule = HockeySceduleModel(sequelize, DataTypes);

// (async () => await sequelize.sync({ alter: true, force: false }))();

async function saveHockeyStandings(data) {
  try {
    await HockeyStandings.upsert( data )
    console.log('hockey standings updated')
  } catch (error) {
    throw error
  }
}
async function saveHockeyScedule(data) {
  try {
    await HockeyScedule.upsert( data )
    console.log('hockey scedule updated')
  } catch (error) {
    throw error
  }
}

export async function saveHockeyStats(KHLStandings, KHLScedule){
  await saveHockeyStandings(KHLStandings)
  await saveHockeyScedule(KHLScedule)
  sequelize.close();
}