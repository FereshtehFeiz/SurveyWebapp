import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useState } from 'react';


function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    const credentials = { username, password };
    let result;
    // SOME VALIDATION, ADD MORE!!!
    let valid = true;
    if (username === '' || password === '')
      valid = false;

    if (valid) {
      // if email and password are not empty
      // we try to login with the credentials entered
      // props.login will return true if the login goes fine
      // otherwise will return false
      result = await props.login(credentials);

      // if the credentials are not in the DB or are incorrect
      // we set the message
      if (!result) {
        // console.log("handle submit", result);
        setErrorMessage('Incorrect password and/or username.')
      }

    } else {
      // if valid is false, this means that either username or password
      // is an empty string
      setErrorMessage('Please insert username and password.')
    }

  };

  return (
    <>

      <Container>
        <br />
        <Row className="justify-content-center">
          <h4 style={{ color: "#17a2b8" }}>Login</h4>
        </Row>
        <Row className="justify-content-md-center">
          <Col className="border rounded-lg" md={4} sm={12}>
            <br />
            <Form>
              {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
              <Form.Group controlId='username'>
                <Form.Label>E-mail</Form.Label>
                <Form.Control type='email' value={username} onChange={ev => setUsername(ev.target.value)} />
              </Form.Group>
              <Form.Group controlId='password'>
                <Form.Label>Password</Form.Label>
                <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
              </Form.Group>
              <Button variant="info" onClick={handleSubmit}>Login</Button>
            </Form>
            <br />
          </Col>
        </Row>
      </Container >
    </>
  )
}



export { LoginForm };