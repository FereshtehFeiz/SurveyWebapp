'use-strict';
const sqlite = require('sqlite3');
const bcrypt = require('bcrypt');

const db = new sqlite.Database('DB.db', (err) => {
  if (err) {
    console.log("sqlite.Database: ", err);
    throw err;
  }
});


exports.getUser = (email, password) => {
  return new Promise((resolve, reject) => {

    const sql = 'SELECT * FROM users WHERE email = ?';

    // console.log("getUserFunction on dao.js");
    // console.log("email: ", email);
    // console.log("password: ", password)

    db.get(sql, [email], (err, row) => {
      // DB error
      if (err)
        reject(err);

      // user not found
      else if (row == undefined)
        resolve(false);
      // user found in DB
      else {
        // bcrypt.compare make a comparison between the
        // password in cleartext (password) and the 
        // password's hash of the DB (row.password)
        // this function return a Promise with a
        // result variable [true | false]

        bcrypt.compare(password, row.hash).then(result => {
          // if result == true, the password inserted by the user
          // is the same of the DB
          if (result)
            resolve({ id: row.id, email: row.email, name: row.name });
          else
            resolve(false);
        }); // end bcrypt.compare

      } // end else
    });


  });
}


exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {

    const sql = "SELECT * FROM users WHERE id = ?";

    db.get(sql, [id], (err, row) => {

      // DB error
      if (err)
        reject(err);

      // id not found
      else if (row == undefined)
        resolve(false);

      else {
        resolve({ id: row.id, email: row.email, name: row.name });
      }
    });

  });

}