import { useEffect, useState } from 'react';
import { Button, Form, Row, Col, Container, Alert } from 'react-bootstrap';
import { QuestionsList } from './QuestionsList';
import { QuestionForm } from './QuestionForm';
import API from "../API";


function CreateSurvey(props) {

    const [surveyTitle, setSurveyTitle] = useState('');
    const [addSurvey, setAddSurvey] = useState(false);
    const [showSuccessMsg, setShowSuccessMsg] = useState(false);
    // enables / disables react-bootstrap validation report
    const [validated, setValidated] = useState(false)
    const [publishSurvey, setPublishSurvey] = useState(false)


    // useEffect runs only when addSurvey state variable is true
    useEffect(() => {
        if (addSurvey) {
            API.addSurveyOnDB({
                title: surveyTitle,
                surveyCreator: props.userId,
            }, props.userId)
            setAddSurvey(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addSurvey]);


    // useEffect runs only when publish state variable is true
    useEffect(() => {
        if (publishSurvey) {
            for (let i = 0; i < props.questions.length; i++) {
                API.addQuestionOnDB({
                    questionTitle: props.questions[i].question,
                    minAnswers: props.questions[i].minAnswers,
                    maxAnswers: props.questions[i].maxAnswers,
                    orderNumber: props.questions[i].questionOrder,
                    optionsTitle: props.questions[i].options
                })

            }
        }
        props.handleQuestions.emptyQuestions();
        props.handleQuestions.updateDB();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [publishSurvey]);


    const handleCreateSurvey = (event) => {
        // stop event default and propagation
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if (!form.checkValidity() || surveyTitle === '') {
            setValidated(true); // enables bootstrap validation error report
        } else {
            setValidated(false);
            setAddSurvey(true);
            setShowSuccessMsg(true);
        }
    }

    const handlePublishSurvey = () => {
        if (surveyTitle === '')
            setValidated(true); // enables bootstrap validation error report
        setPublishSurvey(true); 
    }

    return (
        <>
            <Container fluid>
                {!publishSurvey ?
                    <>
                        {!showSuccessMsg ?
                            <Row className="justify-content-center mt-5">
                                <Col md={12}>
                                    <Form noValidate validated={validated}>
                                        <Col md={8}>
                                            <Form.Label htmlFor="surveyTitle">Survey Title</Form.Label>
                                            <Form.Group className="mb-3" controlId="surveyTitle">
                                                <Form.Control type="text" name="surveyTitle" placeholder="Enter Survey Title" value={surveyTitle}
                                                    onChange={(ev) => setSurveyTitle(ev.target.value)}
                                                    autoFocus required />
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter a title for Survey !
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>
                                            <Button variant="primary" onClick={handleCreateSurvey}>Create Survey</Button>
                                        </Col>
                                    </Form>
                                </Col>
                            </Row>
                            :
                            <>
                                <Row className="mt-5">
                                    <Col md={4}>
                                        <Alert variant="success">Survey Created Successfuly !</Alert>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <Row><Col md={2}><h3>Survey Title: </h3> </Col><Col md={3}><h3>{surveyTitle}</h3></Col></Row>
                                    </Col>
                                    <Col md={12}>
                                        <Row className="mt-5 ml-3">
                                            <QuestionForm questions={props.questions} handleQuestions={props.handleQuestions} />
                                        </Row>
                                    </Col>
                                </Row>
                            </>
                        }
                        <Row className="justify-content-center mt-2">
                            <Col md={12}>
                                <QuestionsList questions={props.questions} handleQuestions={props.handleQuestions} />
                            </Col>
                        </Row>
                        <Row className="justify-content-center mt-2">
                            {props.questions.length === 0 ?
                                <Button variant="primary" disabled>
                                    Publish Survey
                                </Button>
                                : <Button variant="primary" onClick={handlePublishSurvey}>
                                    Publish Survey
                                </Button>}

                        </Row>
                    </> :
                    <Row className="justify-content-center mt-2">
                        <Col md={4}><Alert variant="success">The survey is published successfuly and now is visible for users !</Alert></Col>
                    </Row>
                }
            </Container>
        </>

    )
}

export { CreateSurvey };