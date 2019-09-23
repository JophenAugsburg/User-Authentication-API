require('dotenv').config();

module.exports.dbs = {
  db1: {
    database: process.env.MONGO_DB_1_URL
  },
};
