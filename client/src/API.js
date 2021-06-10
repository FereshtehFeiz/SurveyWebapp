const URL = "http://localhost:3000"


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

    // console.log("function: getUserInfo \nUserInfo: ", userInfo)
    if (response.ok)
        return userInfo;
    else
        throw userInfo;
}


const API = {getUserInfo, logIn, logOut }
export default API