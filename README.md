# Exam #1: "SurveyWebapp"
## Student: s274475 Feizabadi Fereshteh 

## React Client Application Routes

- Route `/`: home page, to show list of publised surveys
- Route `/login`: login form, for admin authentication
- Route `/responces`: list of surveys and number of their responces, by clicking on each survey it goes to navigation through different user's responces. 
- Route `/userResponces/:id`: it shows the user responces for the specific survey, with next and previous button, navigate through responces for each unique user, paramtere: surveyId
- Route `/create`: for createing the survey, inseritng survey title, for inserting, deleting and reordering the questions and then publishing the survey.
- Route `/survey/:id`: for showing the survey questions to the user for answering the questions and the proper validation for each question, paramtere: surveyId.


## API Server

- POST `/api/sessions`
  - Description: authenticate the user who is trying to login
  - Request body: credentials of the user who is trying to login (username , password)
  - Response: 200 OK (success)
  - Response body: authenticated user 
    {
      "id": 1,
      "email": "maria@polito.it", 
      "name": "Maria"
    }

- GET  `/api/sessions/current`
  - Description: check if current user is logged in and get her data
  - Request body: None
  - Response: 200 OK (success)
  - Response body: authenticated user

    {
        "id": 1,
        "email": "maria@polito.it", 
        "name": "Maria"
    }


- DELETE `/api/sessions/current`
  - Description: logout current user
  - Request body: None
  - Response: 200 OK (success)
  - Response body: None

- GET `/api/surveys`
  - Description: to get list of all the published surveys
  - Request body: None
  - Response body: Array of objects, each describing one survey:
    ``` JSON
    [{
          "surveyId": 320,
          "title": "Study Rooms",
          "surveyCreator": 2,
          "isOpen": true,
          "counter": 1
    }]
    ```

- POST `/api/surveys`
  - Description: to create survey by a specific user 
  - Response body content: None
  - Request body: 

  ``` JSON
    {
          "title": "Study Rooms",
          "surveyCreator": 2,
    }
    ```
 

- GET `/api/users/:id/surveys`
  - Description: to get the list of surveys of a specific user 
  - Request parameters: userId
  - Request body: None
  - Response body content: Array of objects, each describing one survey
    
     ``` JSON
    [{
          "surveyId": 320,
          "title": "Study Rooms",
          "surveyCreator": 2,
          "isOpen": true,
          "counter": 1
    }]
    ```

- POST `/api/question`
  - Description: adding questions for the last Survey Id that is created 
  - Response body content: None
  - Response: 200 OK (success)
  - Request body: Description of the question object to add

   ``` JSON
    {
          "Id": 259,
          "surveyId": 314,
          "questionTitle": "In overall how you evaluate the dormitory ?",
          "minAnswers": 1,
          "maxAnswers": 1,
          "orderNumber": 3,
          "optionsTitle": [ ["good"], ["bad"], ["suitable"], ["ok"] ]
    }
    ```
 

- GET `/api/survey/:id`
  - Description: get questions of the given SurveyId 
  - Request parameters: surveyId
  - Request body: None
  - Response body content: Array of objects, each describing one question

    ``` JSON
    [{
          "Id": 259,
          "surveyId": 314,
          "questionTitle": "In overall how you evaluate the dormitory ?",
          "minAnswers": 1,
          "maxAnswers": 1,
          "orderNumber": 3,
          "optionsTitle": [ ["good"], ["bad"], ["suitable"], ["ok"] ]
    }]
    ```

- POST `/api/answer`
  - Description: for adding answers by user
  - Response body: None
  - Request body: Description of the answer object to add

``` JSON
{
   "surveyId": 314,
     "answers": [
    { "qid": 257, "textarea": "nice" },
    { "qid": 260, "radio": "3 days in week" },
    { "qid": 259, "radio": "comfortable" },
    { "qid": 262, "checkedItems": ["item1","item2","item3"] },
    { "qid": 261, "radio": "Kitchen is good" }
  ],
  "username": "fereshteh"
}
```


- GET `/api/answers/:id/:userId`
    - Description: for showing user answers for the given survey Id and user Id
    - Request parameters: surveyId, userId
    - Request body: None
    - Response body content: Array of objects, each describing one answer
  
``` JSON
[{
    "questionId": 276,
    "userId": 21,
    "username": "Angel",
    "questionTitle": "Describe your favourite pizza?",
    "answer": "Fresh ingredients"
}]
```

- GET `/api/userids/:id`
    - Description: listing the user Ids that answer the survey
    - Request parameters: surveyId
    - Request body: None
    - Response body content: Array of objects, each describing one userId

``` JSON
    user IDs [ { "userId": 1 }, { "userId": 2 }, { "userId": 9 } ]

```


## Database Tables

- Table `users` - to keep admins informations, contains: id, email, name, hash
- Table `surveys` - to keep created surveys by admin, contains: surveyId, title, surveyCreator, isOpen, counter
- Table `questions` - to keep questions of survey, contains: Id, surveyId, questionTitle, minAnswers, maxAnswers, orderNumber, optionsTitle
- Table `answers` - to keep the answers of each survey, contains: userId, surveyId, questionId, answer, username


## Main React Components

- `LoginForm`: (in `app.js`) for user authentication and login to access for creating survey and observing results
- `CreateSurvey`: (in `app.js`) for creating new survey and publishing it
- `QuestionForm` (in `CreateSurvey.js`): for adding new question inside the survey 
- `QuestionsList` (in `CreateSurvey.js`): for showing the list of questions and deleting, changing order of each question
- `SurveyForm` (in `app.js`): for showing the list of questions of a survey to the user for answering
- `SurveyResponces` (in `app.js`): for showing the list of surveys with the number of responces and link to survey responces
- `UserResponce` (in `app.js`): for showing the responces of a unique users for a specific survey and navigating through responces of other users 



## Screenshot

![Screenshot](./img/Screenshot1.png)
![Screenshot](./img/Screenshot2.png)
![Screenshot](./img/Screenshot3.png)
![Screenshot](./img/Screenshot4.png)
![Screenshot](./img/Screenshot5.png)
![Screenshot](./img/Screenshot6.png)
![Screenshot](./img/Screenshot7.png)
![Screenshot](./img/Screenshot8.png)



## Users Credentials

| email | password | name | surveys |
|-------|----------|------|------|
| fc@polito.it | password | Fulvio Corno | Pre-vaccination Checklist for COVID-19 Vaccines, Study Rooms  |
| maria@polito.it | ciao | Maria | Dormitory Facilities, Favorite Pizza|
 
