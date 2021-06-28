'use strict'

const sqlite = require('sqlite3');


// open the database
const db = new sqlite.Database('DB.db', (err) => {
  if (err) {
    console.log(err);
    throw err;
  }
});



// get all published surveys
exports.listSurveys = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM surveys WHERE isOpen=1';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const surveys = rows.map((e) => {
        return ({
          surveyId: e.surveyId,
          title: e.title,
          surveyCreator: e.surveyCreator,
          isOpen: e.isOpen ? true : false,
          counter: e.counter
        });
      });
      resolve(surveys);
    });

  });

};


// Create a New Survey 
exports.createSurvey = (survey) => {
  return new Promise((resolve, reject) => {

    const sql = "INSERT INTO surveys(title, surveyCreator, isOpen, counter) VALUES(?, ?, 1, 0)";

    db.run(sql, [survey.title, survey.surveyCreator, survey.isOpen, survey.counter], (err) => {

      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  })
};


// get surveys of a given user admin
exports.getSurveysByUser = (surveyCreator) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM surveys WHERE surveyCreator = ?";

    db.all(sql, [surveyCreator], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      if (rows == undefined) {
        reject({ errorMessage: "Survey ID not found." });
      }
      else {

        const surveys = rows.map((e) => {

          return ({
            surveyId: e.surveyId,
            title: e.title,
            surveyCreator: e.surveyCreator,
            isOpen: e.isOpen ? true : false,
            counter: e.counter
          });
        });
        console.log(surveys);
        resolve(surveys);
      }
    });
  });
};


// insert the question for the last inserted survey
exports.insertQuestion = (question) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO questions (surveyId,questionTitle, minAnswers, maxAnswers, orderNumber, optionsTitle)" +
      "VALUES ((SELECT max(surveyId) FROM surveys), ? , ? , ? , ? , ?)";
    db.run(sql, [question.questionTitle, question.minAnswers, question.maxAnswers, question.orderNumber, JSON.stringify(question.optionsTitle)], (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });

  });
};


// get the questions of the give Survey Id
exports.getQuestions = (surveyId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM questions WHERE surveyId = ? ORDER by orderNumber ASC'
    db.all(sql, [surveyId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const questions = rows.map((e) => {
        return ({
          Id: e.Id,
          surveyId: e.surveyId,
          questionTitle: e.questionTitle,
          minAnswers: e.minAnswers,
          maxAnswers: e.maxAnswers,
          orderNumber: e.orderNumber,
          optionsTitle: JSON.parse(e.optionsTitle)
        });
      });
      resolve(questions);
    });

  });

};


// insert the answers
exports.insertAnswers = (userAnswers) => {
  let userID; // to keep the last user Id 
  return new Promise((resolve, reject) => {
    // Get the last Id of userId 
    const sql1 = "SELECT max(userId) as ID FROM answers";
    db.get(sql1, [], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row == undefined) {
        reject({ errorMessage: "ID not found." });
      }
      else {
        const id = row.ID
        resolve(id);
        userID = row.ID + 1;
      }

      const sql2 = "INSERT INTO answers (userId,surveyId, questionId, answer, username) VALUES(?,?,?,?,?)";

      for (let answer of userAnswers.answers) {
        let ans;
        if (answer.textarea) {
          ans = answer.textarea;
        }
        if (answer.radio) {
          ans = answer.radio;
        }
        if (answer.checkedItems) {
          ans = JSON.stringify(answer.checkedItems);
        }
        db.run(sql2, [userID, userAnswers.surveyId, answer.qid, ans, userAnswers.username], (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        }); // second query 
      } //  loop for iterating over answers 
    }); //  first query

    //then update the counter 
    const sql3 = "UPDATE surveys SET counter=counter+1 where surveyId = ?";
    db.run(sql3, [userAnswers.surveyId], (err) => {
      if (err) {
        reject(err);
        return;
      }
      // resolve({ message: "Update completed!" });
    }); //close third query 

  }); //close promise 
};



// userAnswers = {
//   surveyId: props.surveys.surveyId,
//   username: userName,
//   answers :[
//     {qid: 136, textarea: "dddfffff"},
//     {qid: 139, radio: "jobless"},
//     {checkedItems: Array(2), qid: 140}
//     ]
// }

// to get all the userIDs that answer to the survey
exports.allUserIDs = (surveyId) => {
  return new Promise((resolve, reject) => {
    const sql1 = "SELECT DISTINCT userId FROM answers WHERE surveyId = ?";
    db.all(sql1, [surveyId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const userIds = rows.map((e) => {
        return ({
          userId: e.userId
        });
      });
      resolve(userIds);
    });
  });
};


// show user responces to the Admin
exports.listAnswers = (surveyId, userId) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT questionId,answers.userId,answers.surveyId, username, questionTitle, answer FROM answers INNER JOIN questions on questions.id = answers.questionId WHERE answers.surveyId = ? AND answers.userId = ? ORDER By questionId";
    db.all(sql, [surveyId, userId], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const answers = rows.map((e) => {
        return ({
          questionId: e.questionId,
          userId: e.userId,
          username: e.username,
          questionTitle: e.questionTitle,
          answer: e.answer,
        });
      });
      console.log("answers", answers);
      resolve(answers);
    });

  });
};



