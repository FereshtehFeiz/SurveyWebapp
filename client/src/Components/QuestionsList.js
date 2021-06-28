import { Card, Table, Button } from 'react-bootstrap';
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
                                            {idx ===0 ? <span style={{color:'gray',margin: '5px'}}>{icon.arrowUp}</span> :<span style={{margin: '5px', cursor: 'pointer' }} onClick={() => props.handleQuestions.moveUp(idx)}>{icon.arrowUp}</span>}
                                            {idx === props.questions.length-1 ? <span style={{color:'gray',margin: '5px'}}>{icon.arrowDown}</span> :<span style={{margin: '5px', cursor: 'pointer' }} onClick={() => props.handleQuestions.moveDown(idx)}>{icon.arrowDown}</span>}
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