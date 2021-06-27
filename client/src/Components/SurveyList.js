import { Col, ListGroup, Container, Row, Alert } from "react-bootstrap";
import { Link } from 'react-router-dom'



function SurveyList(props) {



    return (
        <>
            <Container fluid>
                <Row className="justify-content-center mt-5">
                    <Col md={4}>
                        <h4>Published Surveys</h4>
                        {props.surveys.length === 0 ? <Alert variant="info">No published survey available!</Alert> :
                            <ListGroup>
                                {props.surveys.map((element, idx) => {
                                    return (
                                        <ListGroup.Item key={"Item" + idx}>
                                            <Link key={"link" + idx} onClick={() => props.changeSurvey(element.surveyId)}
                                                to={"/survey/" + element.surveyId}
                                            ><h6>{element.title}</h6></Link>
                                        </ListGroup.Item>
                                    );
                                })}
                            </ListGroup>
                        }
                    </Col>
                </Row>
            </Container>

        </>
    )
}

export { SurveyList };