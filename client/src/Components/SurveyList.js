import { Container, Row , Col, ListGroup} from "react-bootstrap";
import { Link } from "react-router-dom";

function SurveyList(props) {
    return (
        <>
        <Container fluid>
        <Row className="justify-content-center mt-5">
            <Col md={4}>
            <h3>Published Surveys</h3>
            <ListGroup>
            <ListGroup.Item><Link to="/">Survey1</Link></ListGroup.Item>
            <ListGroup.Item><Link to="/">Survey2</Link></ListGroup.Item>
            <ListGroup.Item><Link to="/">Survey3</Link></ListGroup.Item>
            </ListGroup>
            </Col>
        </Row>
        </Container>
        </>
    )
}

export { SurveyList };