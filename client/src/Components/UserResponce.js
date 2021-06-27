import { Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import API from "../API";
import { useParams } from 'react-router-dom'


function UserResponce(props) {
    const { id } = useParams() // Keep the survey ID 
    const [currentPage, setcurrentPage] = useState(1);
    const [itemsPerPage, setitemsPerPage] = useState(8);
    const [maxPageNumberLimit, setmaxPageNumberLimit] = useState(5);
    const [minPageNumberLimit, setminPageNumberLimit] = useState(0);
    const [pageNumberLimit, setpageNumberLimit] = useState(5);
    const [userID, setUserID] = useState([]);



    // useEffect 
    useEffect(() => {
        API.loadUserIDs(id).then(userId => setUserID(userId));
    }, [id]); // eslint-disable-next-line 

    const pages = [];
    for (let i = 1; i <= Math.ceil(props.surveyAnswers.length / itemsPerPage); i++) {
        pages.push(i);
    }


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = props.surveyAnswers.slice(indexOfFirstItem, indexOfLastItem);

    
    const handleNextbtn = () => {
        setcurrentPage(currentPage + 1);
        if (currentPage + 1 > maxPageNumberLimit) {
            setmaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
            setminPageNumberLimit(minPageNumberLimit + pageNumberLimit);
        }

    }

    const handlePrevbtn = () => {
        setcurrentPage(currentPage - 1);
        if ((currentPage - 1) % pageNumberLimit === 0) {
            setmaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
            setminPageNumberLimit(minPageNumberLimit - pageNumberLimit);
        }
    };

    return (
        <>
            <Row className="justify-content-center mt-5">
                <Col md={10}>
                    <Card>
                        {currentItems.length !== 0 ?
                            <>
                                <Card.Header>
                                    <h4>User Responce</h4>
                                </Card.Header>
                                <Card.Body>
                                    <Form.Group as={Row} controlId="UserName">
                                        <Form.Label column sm="2">
                                            <h4>UserName:</h4>
                                        </Form.Label>
                                        <Col sm="12">
                                            <Form.Control plaintext readOnly defaultValue={currentItems[0].username} />
                                        </Col>
                                    </Form.Group>

                                    <Row>
                                        <Col sm="6"><h4>Question</h4></Col>
                                        <Col sm="6"><h4>Answer</h4></Col>
                                    </Row>
                                    {currentItems.map((item, idx) => {
                                        return (
                                            <>
                                                <Form.Group key={"Row" + item.questionId + idx} as={Row} controlId={"answer" + item.questionId + idx}>
                                                    <Form.Label column sm="6" key={"questionTitle" + item.questionId + idx}>
                                                        {idx + 1}- {item.questionTitle}
                                                    </Form.Label>
                                                    <Col sm="6" key={"answer" + item.questionId + idx}>
                                                        {item.answer === null ? <h6><Badge variant="secondary">Not Answered</Badge></h6> :
                                                            <Form.Control key={"answer" + item.questionId + idx} plaintext readOnly defaultValue={item.answer} />
                                                        }
                                                    </Col>
                                                </Form.Group>
                                            </>
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
                                                disabled={currentPage === pages[0] ? true : false}
                                            >
                                                Prev
                                            </Button>
                                        </div>

                                        <div className="flex-item">
                                            <Button
                                                variant="outline-primary"
                                                onClick={handleNextbtn}
                                                disabled={currentPage === pages[pages.length - 1] ? true : false}
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