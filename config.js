/** Common config for message.ly */

// read .env files and make environmental variables
const PG_PWD = require('./.env')

require("dotenv").config();

process.env.PGPASSWORD = PG_PWD


const DB_URI = (process.env.NODE_ENV === "test")
  ? "postgresql:///messagely_test"
  : "postgresql:///messagely";

// const DB_URI = (process.env.NODE_ENV === "test")
//   ? {
//     host:"/var/run/postgresql/",
//     database: "messagely_test"
//   }
//   : {
//     host:"/var/run/postgresql/",
//     database: "messagely"
//   }

const SECRET_KEY = process.env.SECRET_KEY || "secret";

const BCRYPT_WORK_FACTOR = 12;


module.exports = {
  DB_URI,
  SECRET_KEY,
  BCRYPT_WORK_FACTOR,
};