const URL = "http://localhost:3000"


async function loadAllSurveys() {
    try {
        const response = await fetch(URL + '/api/surveys').then(res => {
            if (!res.ok)
                throw Error(`[${res.status}] ${res.statusText}`)

            return res;
        });

        const obj = await response.json();
        return obj;
    }
    catch (err) {
        console.log(`Something went Wrong: ${err.message} `)
    }

}

async function addSurveyOnDB(surveyObj) {
    await fetch(URL + `/api/surveys`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...surveyObj })
    })

}



async function logIn(credentials) {
    let response = await fetch(URL + '/api/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();

        return user;
    }
    else {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
        }
        catch (err) {
            throw err;
        }
    }
}

async function logOut() {
    await fetch(URL + '/api/sessions/current', { method: 'DELETE' });
}

async function getUserInfo() {
    const response = await fetch(`/api/sessions/current`);
    const userInfo = await response.json();

    if (response.ok)
        return userInfo;
    else
        throw userInfo;
}


async function getUserSurveys(userId) {
    try {
        const response = await fetch(URL + `/api/users/${userId}/surveys`).then(res => {
            if (!res.ok)
                throw Error(`[${res.status}] ${res.statusText}`)

            return res;
        });

        const obj = await response.json();
        return obj;
    }
    catch (err) {
        console.log(`Something went Wrong: ${err.message} `)
    }

}


async function addQuestionOnDB(questionObj) {
    await fetch(URL + `/api/question`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...questionObj })
    })
    console.log("addQuestionOnDB API questionObj" + questionObj)
}


async function loadSurveyQuestions(surveyId) {
    try {
        const response = await fetch(URL + `/api/survey/${surveyId}`).then(res => {
            if (!res.ok)
                throw Error(`[${res.status}] ${res.statusText}`)

            return res;
        });

        const obj = await response.json();
        return obj;
    }
    catch (err) {
        console.log(`Something went Wrong: ${err.message} `)
    }

}

async function addAnswersOnDB(answerObj) {
    console.log("API", answerObj);
    await fetch(URL + `/api/answer`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(answerObj)
    })
}

async function loadSurveyAnswers(surveyId) {
    try {
        const response = await fetch(URL + `/api/answers/${surveyId}`).then(res => {
            if (!res.ok)
                throw Error(`[${res.status}] ${res.statusText}`)

            return res;
        });

        const obj = await response.json();
        return obj;
    }
    catch (err) {
        console.log(`Something went Wrong: ${err.message} `)
    }

}


async function loadUserIDs(surveyId) {
    try {
        const response = await fetch(URL + `/api/userids/${surveyId}`).then(res => {
            if (!res.ok)
                throw Error(`[${res.status}] ${res.statusText}`)

            return res;
        });

        const obj = await response.json();
        return obj;
    }
    catch (err) {
        console.log(`Something went Wrong: ${err.message} `)
    }

}



const API = { getUserInfo, logIn, logOut, loadAllSurveys, addSurveyOnDB, getUserSurveys, addQuestionOnDB, loadSurveyQuestions, addAnswersOnDB, loadSurveyAnswers, loadUserIDs  }
export default API