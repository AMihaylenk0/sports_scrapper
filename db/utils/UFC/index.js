import dotenv from "dotenv";
dotenv.config()
import sql from 'sequelize'
const { Sequelize, Op, DataTypes } = sql;
import UFCLeadersModel from "../../models/UFC/ufcLeaders.js"
import UFCAtheletsModel from "../../models/UFC/ufcAthelets.js"

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
const UFCLeaders = UFCLeadersModel(sequelize, DataTypes);
const UFCAthelets = UFCAtheletsModel(sequelize, DataTypes);

// (async () => await sequelize.sync({ alter: true, force: false }))();

async function saveUFCLeaders(data) {
  try {
    await UFCLeaders.upsert( data )
    console.log('UFC leaders updated')
  } catch (error) {
    throw error
  }
}
async function saveUFCAthelets(data) {
  try {
    await UFCAthelets.bulkCreate( data, { updateOnDuplicate: Object.keys(UFCAthelets.rawAttributes)} )
    console.log('UFC atheletes updated')
  } catch (error) {
    throw error
  }
}


export async function saveUFCData(ufcLeaders, ufcAthelets){
  await saveUFCLeaders(ufcLeaders)
  await saveUFCAthelets(ufcAthelets)
  sequelize.close();
}