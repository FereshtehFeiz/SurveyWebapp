import 'bootstrap/dist/css/bootstrap.min.css';
import { NavBar } from './Components/NavBar';
import { Container, Row } from 'react-bootstrap';
import { LoginForm } from './Components/LoginForm';
import { SurveyList } from './Components/SurveyList';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import API from "./API";


function App() {
  // A boolean state variable to know if
  // the user is logged in
  const [loggedIn, setLoggedIn] = useState(false);

  // An object state variable that contains
  // all the info about the current user logged in
  const [user, setUser] = useState({ name: '' });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // here you have the user info, if already logged in
        // get the user object from the session
        // API.getUserInfo returns the user object
        // if there is an user stored in the cookies of the session
        // otherwise returns {error: "errorMessage"}
        const user = await API.getUserInfo();
        if (user.error === "not authenticated") {
          setLoggedIn(false);
          setUser({ name: "" })
          // setTasks([])
          //console.log("What Happened")
        }
        else {
          setLoggedIn(true);
          setUser(user);
        }
      } catch (err) {
        console.error(err.error);
      }
    };
    checkAuth();
  }, []);

  // useEffect runs every time the user object changes
  useEffect(() => {
    // if user.name is not an empty string
    // if there is a valid user logged in
    if (user.name) {
      // console.log(`useEffect[user]: calling API.getData(${user.id})`)
      // retriew all the tasks of this current user
      // API.getData(user.id).then(response => setTasks(response))
    }

  }, [user]);

  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      console.log(user);
      if (user) {
        setUser(user);
        setLoggedIn(true);
        return true;
      }

    } catch (err) {
      return false;
    }
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser({ name: "" })
    // clean up everything
    // setTasks([]);
  }

  return (
    <>
      
      <Router>
          <NavBar logout={doLogOut}
            user={user}
          />

      <Switch>
        <Route path="/login" render={() => 
          <>{loggedIn ? <Redirect to="/admin" /> : <LoginForm login={doLogIn} user={user} />}</>
        }/>

        <Route exact path="/" render={() =>
        <>
           <SurveyList />
        </>
        } />

    <Route path="/admin" render={() =>
        <>
          {loggedIn ?
            <Row>
              <p>Welcome Admin</p>
            </Row>
          : <Redirect to="/" /> }
        </>
        } />

      <Route path="/responces" render={() =>
        <>
           <p>The list of responces</p>
        </>
        } />

    <Route path="/create" render={() =>
        <>
           <p>Create the survey</p>
        </>
        } />
        
      </Switch>
  </Router>
    </>
  );
}

export default App;
