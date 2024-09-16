const { Sequelize } = require('sequelize');
const path = require('path'); 
require('dotenv').config({ path: path.join(__dirname, '.env') });

const sequelize = new Sequelize(
  process.env.DB_NAME,       // Database name
  process.env.DB_USER,       // Database username
  process.env.DB_PASSWORD,   // Database password
  {
    host: process.env.DB_HOST,  // Database host
    dialect: 'mysql',           // Dialect
    logging: false,             // Disable logging; default: console.log
    pool: {
      max: 5,                   // Maximum number of connections in pool
      min: 0,                   // Minimum number of connections in pool
      acquire: 30000,           // Maximum time in ms that a connection can be idle before being released
      idle: 10000               // Maximum time in ms that pool will try to get a connection before throwing error
    },
  }
);

const connectToDB =async ()=>{
    try{
        await sequelize.authenticate();
        console.log("Succesfully connected to out DB");
    }

    catch(error){
        console.log(error);
    }
}

module.exports = {sequelize, connectToDB};
