import { Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import API from "../API";
import { useParams } from 'react-router-dom'


function UserResponce(props) {
    const { id } = useParams() // Keep the survey ID 
    // const [currentPage, setcurrentPage] = useState(1);
    // const [itemsPerPage, setitemsPerPage] = useState(8);
    // const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
    // const [minPageNumberLimit, setminPageNumberLimit] = useState(0);
    // const [pageNumberLimit, setpageNumberLimit] = useState(5);
    // const [userID, setUserID] = useState([]);
    const [users, setUsers] = useState([]);
    const [surveyAnswers, setSurveyAnswers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(0);


    // useEffect for load all the userIds of this survey
    useEffect(() => {
        API.loadUserIDs(id).then((res) => {
            setUsers(res);
        })
    }, [id]); // eslint-disable-next-line 

    // pass userId to load the ansewers of the user
    useEffect(() => {
        if (users.length) {
            // console.log("users.length",users.length);
            API.loadSurveyAnswers(id, users[selectedUser].userId).then((res) => {
                setSurveyAnswers(res)
            })
        }
    }, [id, selectedUser, users]);

    // console.log("users",users);
    // console.log("selected user", selectedUser);
    // console.log("surveyAnswers[selectedUser].username", surveyAnswers[selectedUser].user);

    // const pages = [];
    // for (let i = 1; i <= Math.ceil(props.surveyAnswers.length / itemsPerPage); i++) {
    //     pages.push(i);
    // }


    // const indexOfLastItem = currentPage * itemsPerPage;
    // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // const currentItems = props.surveyAnswers.slice(indexOfFirstItem, indexOfLastItem);


    const handleNextbtn = () => {
        if (selectedUser < (users.length - 1)) {
            setSelectedUser(s => s + 1);
        }
        // setcurrentPage(currentPage + 1);
        // if (currentPage + 1 > maxPageNumberLimit) {
        //     setmaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
        //     setminPageNumberLimit(minPageNumberLimit + pageNumberLimit);
        // }

    }

    const handlePrevbtn = () => {
        if (selectedUser > 0) {
            setSelectedUser(s => s - 1)
        }
        // setcurrentPage(currentPage - 1);
        // if ((currentPage - 1) % pageNumberLimit === 0) {
        //     setmaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
        //     setminPageNumberLimit(minPageNumberLimit - pageNumberLimit);
        // }
    };

    return (
        <>
            <Row className="justify-content-center mt-5">
                <Col md={10}>
                    <Card>
                        {surveyAnswers.length !== 0 ?
                            <>
                                <Card.Header>
                                    <h4>User Responce</h4>
                                </Card.Header>
                                <Card.Body>
                                    <Form.Group as={Row} controlId="UserName">
                                        <Form.Label column sm="2">
                                            <h4>UserName:</h4>
                                        </Form.Label>
                                        <Col sm="10">
                                            {surveyAnswers[selectedUser] ?
                                                <Form.Control plaintext readOnly value={surveyAnswers[selectedUser].username} />
                                                : ''
                                            }
                                        </Col>
                                    </Form.Group>

                                    <Row>
                                        <Col sm="6"><h4>Question</h4></Col>
                                        <Col sm="6"><h4>Answer</h4></Col>
                                    </Row>
                                    {surveyAnswers.map((item, idx) => {
                                        return (
                                            <div key={"Item" + idx}>
                                                <Form.Group key={idx + "Row" + item.questionId} as={Row} controlId={idx + "Control" + item.questionId}>
                                                    <Form.Label column sm="6" key={idx + "QTitle" + item.questionId}>
                                                        {idx + 1}- {item.questionTitle}
                                                    </Form.Label>
                                                    <Col sm="6" key={idx + "QLabel" + item.questionId}>
                                                        {item.answer === null ? <h6><Badge variant="secondary">Not Answered</Badge></h6> :
                                                            <Form.Control key={idx + "userAnswer" + item.questionId} plaintext readOnly value={item.answer} />
                                                        }
                                                    </Col>
                                                </Form.Group>
                                            </div>
                                        )
                                    })}
                                </Card.Body>
                                {/* Navigation through answers user by user for each survey */}
                                <Card.Footer className="text-muted">

                                    <div className="d-flex justify-content-between">
                                        <div className="flex-item">
                                            <Button
                                                variant="outline-primary"
                                                onClick={handlePrevbtn}
                                            // disabled={currentPage === pages[0] ? true : false}
                                            >
                                                Prev
                                            </Button>
                                        </div>

                                        <div className="flex-item">
                                            <Button
                                                variant="outline-primary"
                                                onClick={handleNextbtn}
                                            // disabled={currentPage === pages[pages.length - 1] ? true : false}
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                </Card.Footer>
                            </>
                            : <Card.Body><p>No responces are available for this survey!</p></Card.Body>}
                    </Card>

                </Col>
            </Row>


        </>)

}
export { UserResponce };