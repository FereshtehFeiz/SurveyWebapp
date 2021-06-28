import { Row, Col, Card, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import * as icon from '../icons';


function SurveyResponces(props) {

    return (
        <Row className="justify-content-center mt-5">
            <Col md={8}>
                <Card>
                    <Card.Header>
                        <h4>Surveys Results</h4>
                    </Card.Header>
                    <Card.Body>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Survey</th>
                                    <th>Responces</th>
                                    <th>View</th>
                                </tr>
                            </thead>
                            <tbody>
                                {props.userSurveys.length === 0 ? <tr><td><span>No surveys are available to check its responces!</span></td></tr> :
                                    <>
                                        {props.userSurveys.map((element, idx) => {
                                            return (
                                                <tr key={"row" + idx}>
                                                    <td>{element.title}</td>
                                                    <td>{icon.people}<span style={{ padding: '10px' }}>{element.counter}</span></td>
                                                    <td><Link key={"link" + { idx }} to={"/userResponces/" + element.surveyId}>
                                                        <Button variant="outline-info"
                                                        >Responces</Button></Link></td>
                                                </tr>
                                            );
                                        })}
                                    </>
                                }
                            </tbody>

                        </Table>

                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
}

export { SurveyResponces };