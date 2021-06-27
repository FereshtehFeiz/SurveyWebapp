import { Card, Table, Button} from 'react-bootstrap';
import * as icon from '../icons';


function QuestionsList(props) {

    return (
        <Card>
            <Card.Header>
                <h4>List of questions</h4>
            </Card.Header>
            <Card.Body>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Question</th>
                            <th>Delete</th>
                            <th>Order</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.questions.length === 0 ? 
                        <tr><td><span>There are no questions for this survey !</span></td></tr>
                        :
                            <>
                                {props.questions.map((item, idx) => {
                                    return (
                                        <tr key={idx}>
                                            <td>{idx + 1}</td>
                                            <td>{item.question}</td>
                                            <td>
                                                <Button size="sm" variant="danger"
                                                 onClick={() => props.handleQuestions.delete(item)}
                                                >{icon.deleteTask}</Button>
                                            </td>
                                            <td>
                                            <span style={{fontSize:'30px', margin:'5px', cursor:'pointer'}} onClick={() => props.handleQuestions.moveUp(idx)}>{icon.arrowUp}</span>
                                            <span style={{fontSize:'30px',margin:'5px',cursor:'pointer'}} onClick={() => props.handleQuestions.moveDown(idx)}>{icon.arrowDown}</span>
                                            </td>
                                        </tr>

                                    );
                                })}
                            </>
                        }
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
}


export { QuestionsList };