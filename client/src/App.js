import 'bootstrap/dist/css/bootstrap.min.css';
import { NavBar } from './Components/NavBar';
import { LoginForm } from './Components/LoginForm';
import { CreateSurvey } from './Components/CreateSurvey';
import { SurveyResponces } from './Components/SurveyResponces';
import { SurveyForm } from './Components/SurveyForm';
import { SurveyList } from './Components/SurveyList';
import { UserResponce } from './Components/UserResponce';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import './custom.css'
import API from "./API";


function App() {

  const [questions, setQuestions] = useState([]);
  const [surveyQuestions, setSurveyQuestions] = useState([]);

  // A boolean state variable to know if
  // the user is logged in
  const [loggedIn, setLoggedIn] = useState(false);

  // An object state variable that contains
  // all the info about the current user logged in
  const [user, setUser] = useState({ name: '' });
  // all the published surveys
  const [surveys, setSurveys] = useState([]);
  const [userSurveys, setUserSurveys] = useState([]);
  const [surveyAnswers, setSurveyAnswers] = useState([]);


  // A boolean state variable to know if
  // there are updates on DB
  const [updatesOnDB, setUpdatesOnDB] = useState(false);
  // const [order, setOrder] = useState();

  // by reloading the page I have the list of all the surveys 
  useEffect(() => {
    API.loadAllSurveys().then(NewSurveys => setSurveys(NewSurveys));
  }, []);



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
      // retriew all the surveys of this current user
      API.getUserSurveys(user.id).then(response => setUserSurveys(response))
    }

  }, [user]);



  // To show the User responces for a survey
  const showAnswers = (surveyId) => {
    // console.log("surveyID" , surveyId);
    API.loadSurveyAnswers(surveyId).then(surveyAnswers => setSurveyAnswers(surveyAnswers));
  }


  //  // useEffect runs every time the userId object changes
  //  useEffect(() => {
  //   if (userId) {
  //     API.loadSurveyAnswers().then(surveyAnswers => setSurveyAnswers(surveyAnswers));
  //   }
  // }, [userId]);


  // To Load the questions of a survey
  const changeSurvey = (surveyId) => {
    API.loadSurveyQuestions(surveyId).then(surveyQuestions => setSurveyQuestions(surveyQuestions));
  };

  // To Load the latest surveys when click on navigation button
  const loadSurveys = () => {
    // API.loadSurveyQuestions(surveyId).then(surveyQuestions => setSurveyQuestions(surveyQuestions));
    API.loadAllSurveys().then(NewSurveys => setSurveys(NewSurveys));
  };

  // useEffect runs only when the updatesOnDB state variable
  // is true
  useEffect(() => {
    if (updatesOnDB) {
      try {
        API.loadSurveyQuestions().then(surveyQuestions => setSurveyQuestions(surveyQuestions));
        // API.loadSurveyAnswers().then(surveyAnswers => setSurveyAnswers(surveyAnswers));
        API.getUserSurveys(user.id).then(response => setUserSurveys(response));
        API.loadAllSurveys().then(NewSurveys => setSurveys(NewSurveys));
      }
      catch (err) {
        console.log(`Something went Wrong: ${err.message} `)
      }
      setUpdatesOnDB(false);
    }
    // eslint-disable-next-line
  }, [updatesOnDB]);

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
    setUserSurveys([]);
    setQuestions([]);
    setSurveyAnswers([]);
  }



  const handleQuestions = {
    add: (question) => {
      setQuestions(oldquestion => [...oldquestion, question])
    },

    delete: (item) => {
      let array = [...questions];
      array = array.filter((question) => question.questionOrder !== item.questionOrder).map((question, idx) => { question.questionOrder = idx; return question })
      setQuestions(array);
    },

    moveUp: (idx) => {
      if (idx === 0) return;
      let array = [...questions];
      let index = idx - 1
      console.log("idx is", idx);
      console.log("array[idx]", array[idx]);
      console.log("array[index]", array[index]);
      array[idx].questionOrder -= 1;
      array[index].questionOrder += 1;
      let itemAbove = array[index];
      array[idx - 1] = array[idx];
      array[idx] = itemAbove;
      setQuestions(array);
      // console.log(array);
      // console.log("idx" , idx)
      // console.log(array[idx]);
      console.log("order in the array is", array[index].questionOrder)
      // console.log(questions[idx].questionOrder)
      // console.log("the old order of this item was:", idx)
      // setOrder(index);
    },

    moveDown: (idx) => {
      let array = [...questions];
      if (idx === array.length - 1) return;
      let index = idx + 1;
      array[idx].questionOrder += 1;
      array[index].questionOrder -= 1;
      let itemBelow = array[index];
      array[idx + 1] = array[idx];
      array[idx] = itemBelow;
      setQuestions(array);
      console.log("the new order of this item is:", index)
      console.log("order in the array is", array[index].questionOrder)
      // console.log("the old order of this item was:", idx)
      // setOrder(index);
    },

    emptyQuestions: () => {
      setQuestions([]);
    },

    // getList: () => questions,
    updateDB: () => { setUpdatesOnDB(true) }
  };


  return (
    <>

      <Router>
        <NavBar logout={doLogOut}
          loadSurveys={loadSurveys}
          user={user}
        />
        <Switch>
          <Route path="/login" render={() =>
            <>{loggedIn ? <Redirect to="/create" /> : <LoginForm login={doLogIn} user={user} />}</>
          } />

          <Route exact path="/" render={() =>
            <SurveyList surveys={surveys} changeSurvey={changeSurvey} />
          } />


          <Route path="/responces" render={() =>
            <>
              {loggedIn ?
                <SurveyResponces
                  showAnswers={showAnswers}
                  userSurveys={userSurveys}
                />
                : <Redirect to="/login" />}
            </>
          } />

          <Route path="/userResponces/:id" render={() =>
            <>
              {loggedIn ?
                <UserResponce
                  surveyAnswers={surveyAnswers}
                />
                : <Redirect to="/login" />}
            </>
          } />

          <Route path="/create" render={() =>
            <>
              {loggedIn ?
                <>
                  <CreateSurvey userId={user.id} questions={questions} handleQuestions={handleQuestions} />
                </>
                : <Redirect to="/login" />}
            </>
          } />
          <Route path="/survey/:id">
            <SurveyForm surveyQuestions={surveyQuestions} />
          </Route>

        </Switch>
      </Router>
    </>
  );
}

export default App;
