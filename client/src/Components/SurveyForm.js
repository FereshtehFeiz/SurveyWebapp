import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { Button, Form, Card, Row, Col, ListGroup, Badge, Container, Alert } from "react-bootstrap";
import API from "../API";
import { Redirect } from 'react-router'




function SurveyForm(props) {
    const { id } = useParams() // Keep the survey ID 
    // const [validated, setValidated] = useState(false);
    const [userName, setUserName] = useState('');
    const [submitSurvey, setSubmitSurvey] = useState(false);
    const [finalResult, setFinalResult] = useState([]);
    const [pageRedirect, setPageRedirect] = useState(false);
    const [surveyQuestions, setSurveyQuestions] = useState([]);


    // useEffect runs only when submitSurvey state variable is true
    useEffect(() => {
        if (submitSurvey) {
            API.addAnswersOnDB({
                surveyId: id,
                answers: finalResult.filter((answer) => answer !== undefined),
                username: userName
            })
            setSubmitSurvey(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submitSurvey]);


    useEffect(() => {
        API.loadSurveyQuestions(id).then(surveyQuestions => setSurveyQuestions(surveyQuestions));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    function handleChange(value, questionInfo) {

        let array = [...finalResult]; // get a copy of answers
        // console.log("questionInfo: " , questionInfo);
        // console.log("array: " , array);
        // console.log("vale: " , value);

        if (questionInfo.type === 'radio' || questionInfo.type === 'textarea') {
            array[questionInfo.orderNumber] = (questionInfo.type === 'radio') ? { qid: questionInfo.qid, radio: value } : { qid: questionInfo.qid, textarea: value }
        }
        else {

            let checked = array[questionInfo.orderNumber] ? array[questionInfo.orderNumber].checkedItems : [];

            if (checked.filter(item => item === value).length === 0) {
                checked.push(value);
            }
            else {
                //alread present, remove it 
                checked = checked.filter(item => item !== value)
            }

            array[questionInfo.orderNumber] = { qid: questionInfo.qid, checkedItems: checked }
        }
        // console.log("set array: ", array);
        setFinalResult(array);

    }


    const handleSubmit = (event) => {
        let valid = true;
        event.preventDefault();
        event.stopPropagation();
        // const form = event.currentTarget;

        if (userName === '') {
            // setValidated(true); // enables bootstrap validation error report
            valid = false
            alert('Enter your name!');
        }
        else {
            // setValidated(false);
            // validation 
            // console.log(surveyQuestions.length);
            let questions = [...surveyQuestions];
            for (let question of questions) {
                let answer = finalResult.filter((answer) => {
                    // console.log("final result filter ",answer);
                    if (!answer)
                        return false;

                    return (question.Id === answer.qid)

                })
                //    console.log("question is ",question);
                //    console.log("answer is ",answer)

                if (answer.length === 0) {

                    // mandatory
                    if (question.minAnswers !== 0) {
                        question.error = "Please answer to this question!"
                        valid = false

                    }

                }
                else {
                    // console.log("answer is not empty and is: ", answer[0]);
                    question.error = ""

                    //     for(let answer of finalResult)
                    //     {
                    if (answer[0].checkedItems) {
                        //check the lenght of array
                        // console.log("answer is not empty and is: ", answer[0].checkedItems);
                        if (!(answer[0].checkedItems.length >= question.minAnswers && answer[0].checkedItems.length <= question.maxAnswers)) {
                            question.error = "The number of options selected are not correct!"
                            valid = false
                            // it's not ok 
                        }


                    }

                }
            }
            // console.log("after check ", questions);
            setSurveyQuestions(questions);

        }

        if (valid) {
            // console.log('ok');
            setSubmitSurvey(true);
            setPageRedirect(true);
        }
        // else {
        //     // console.log('not ok');
        //     //  validation here 
        // }

    };


    return (
        <>
            <Container fluid>
                <Row className="justify-content-center mt-5">
                    <Col md={8}>
                        <h4>Survey Questions</h4>
                        <Card>
                            <Card.Body>
                                <Form noValidate onSubmit={handleSubmit}>
                                    <ListGroup.Item>
                                        <Form.Group as={Row} controlId="userName">
                                            <Form.Label column sm={12}>
                                                Name
                                            </Form.Label>
                                            <Col sm={6}>
                                                <Form.Control type="text" onChange={(ev) => setUserName(ev.target.value)} placeholder="Your Name" value={userName} required />
                                            </Col>
                                        </Form.Group>
                                    </ListGroup.Item>
                                    {surveyQuestions.map((item, idx) => {
                                        return (
                                            <ListGroup.Item key={item.Id + "Question"}>
                                                <Form.Group as={Row}>
                                                    <Form.Label column sm={12} key={item.Id + "Title"}>
                                                        {idx + 1}<span>- </span>{item.questionTitle}
                                                    </Form.Label>
                                                    {item.error &&
                                                        <Alert style={{ width: '100%', textAlign: 'center' }} variant="danger" key={item.Id + "error"}> {item.error} </Alert>
                                                    }
                                                </Form.Group>
                                                {/* Closed Question */}
                                                {item.optionsTitle.length !== 1 ?
                                                    <>
                                                        {item.maxAnswers > 1 ?
                                                            <>
                                                                {/* Multiple Choice */}
                                                                {item.optionsTitle.map((option, idx) => {
                                                                    return (
                                                                        <div key={idx + 'checkbox' + item.Id} className="form-check form-check-inline">
                                                                            <Form.Group className="mb-3" controlId={"checkbox" + idx + item.Id}>
                                                                                <Form.Check
                                                                                    className="ml-4"

                                                                                    name={option.value}
                                                                                    type="checkbox"
                                                                                    label={option.value}
                                                                                    value={option.value}
                                                                                    onChange={e => handleChange(e.target.value, { qid: item.Id, orderNumber: item.orderNumber, type: 'checkbox' })}
                                                                                />
                                                                            </Form.Group>
                                                                        </div>
                                                                    )

                                                                })}
                                                                <>
                                                                <h6><Badge variant="secondary">Maximum options to choose: {item.maxAnswers} - Minimum options to choose: {item.minAnswers}</Badge></h6>
                                                                </>
                                                            </>
                                                            : <>
                                                                {/* Single Choice */}
                                                                <Form.Group as={Row} controlId={"radio" + idx + item.Id} >
                                                                    {item.optionsTitle.map((option, idx) => {

                                                                        return (
                                                                            <div key={idx + 'radio' + item.Id} className="form-check form-check-inline">
                                                                                <Form.Check
                                                                                    noValidate
                                                                                    className="ml-4"

                                                                                    type="radio"
                                                                                    label={option.value}
                                                                                    value={option.value}
                                                                                    name={"singleChoice" + item.Id}
                                                                                    onChange={e => handleChange(e.target.value, { qid: item.Id, orderNumber: item.orderNumber, type: 'radio' })}

                                                                                />
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </Form.Group>
                                                            </>}
                                                            <>
                                                        {item.minAnswers >= 1 ? <h6><Badge variant="danger">Madatory</Badge> </h6> : <h6> <Badge variant="success">Optional</Badge></h6>}  
                                                        </> 
                                                         </>
                                                    :
                                                    <>
                                                        {/* Opened Question */}
                                                        <Form.Group>
                                                            <Col sm={6}>
                                                                <Form.Control
                                                                    key={item.Id + 'textArea'}
                                                                    maxLength="200"
                                                                    as="textarea"
                                                                    rows={3}
                                                                    name={"openQuestion" + item.Id}
                                                                    onChange={e => handleChange(e.target.value, { qid: item.Id, orderNumber: item.orderNumber, type: 'textarea' })}
                                                                />
                                                            </Col>
                                                            {item.minAnswers >= 1 ?
                                                                <h6><Badge variant="danger">Madatory</Badge></h6> :
                                                                <h6><Badge variant="success">Optional</Badge></h6>}
                                                        </Form.Group>
                                                    </>
                                                }
                                            </ListGroup.Item>
                                        );
                                    })}
                                    <Button variant="info" type="submit">Submit</Button>
                                </Form>
                                {pageRedirect && (
                                    <Redirect to={'/'} /> //back to the main page
                                )}
                            </Card.Body>

                        </Card>
                    </Col>
                </Row>
            </Container>
        </>);
}

export { SurveyForm };
