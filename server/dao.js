'use strict'

const sqlite = require('sqlite3');


// open the database
const db = new sqlite.Database('DB.db', (err) => {
  if (err) {
    console.log(err);
    throw err;
  }
});
