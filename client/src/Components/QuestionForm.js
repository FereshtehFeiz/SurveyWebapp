import { Button, Form, Row, Col, Alert, Modal } from 'react-bootstrap';
import * as icon from '../icons';
import { useState } from 'react';



function QuestionForm(props) {

    const [questionText, setQuestionText] = useState('');
    const [questionType, setQuestionType] = useState('open');
    const [options, setOptions] = useState([{}]);
    const [numberOfOptions, setNumberOfOptions] = useState(1)
    const [show, setShow] = useState(false);
    // const [questionOrder, setQuestionOrder] = useState(props.questions.length);
    const [minAnswers, setminAnswers] = useState(0);
    const [maxAnswers, setmaxAnswers] = useState(1);
    const [openAnswerForce, setOpenAnswerForce] = useState('');
    const [disButton, setDisButton] = useState(true);

    const handleClose = () => setShow(false);


    const handleShow = () => {
        setShow(true);
        // console.log('reset everything')
        setQuestionText('');
        setminAnswers(0);
        setmaxAnswers(1);
        setOptions([{}]);
        setNumberOfOptions(1);
        setQuestionType('open');
    }

    function handleChange(i, event) {
        if (event.target.value === "") {
            setDisButton(false);
        }
        else {
            setDisButton(true);
        }
        const values = [...options];
        values[i].value = event.target.value;
        setOptions(values);
    }

    function handleAdd() {

        let items = [...options];
        for (let item of items) {
            // console.log(item);
            if (item.value === undefined) {
                // if option is empty
                alert('Options could not be empty!')
                setDisButton(false);
            }
            else {
                // else is not empty then push it to the options
                setNumberOfOptions(numberOfOptions + 1);
                setDisButton(true);
                const values = [...options];
                values.push({});
                setOptions(values);
            }
        }

        // console.log("my options", [...options]);

    }


    function handleRemove(i) {
        setNumberOfOptions(numberOfOptions - 1);
        const values = [...options];
        values.splice(i, 1);
        setOptions(values);
    }


    const selectMinValue = evt => {
        let value = parseInt(evt.target.value);
        setminAnswers(value);
    };

    const selectMaxValue = evt => {
        let value = parseInt(evt.target.value);
        setmaxAnswers(value);
    };


    const SelectQuestionType = evt => {
        const { value } = evt.target;
        if (value === 'open') {
            setQuestionType('open')
            setmaxAnswers(1);

        }
        else {
            setQuestionType('close')
            setmaxAnswers(maxAnswers);
        }
    };

    const OpenAnswerForce = evt => {
        const value = evt.target.value;
        setOpenAnswerForce(value);
        if (value === "Optional" && questionType === 'open') {
            setminAnswers(0);
        }
        else {
            setminAnswers(1);
        }
    };


    // function handleOrder() {
    //     let array = [...props.questions];
    //     // setQuestionOrder()
    //     // console.log("lenght is ", props.questions.length + 1);
    //     // let orderNumber = array.length + 1;
    //     // console.log("the number of questions are : ", orderNumber)
    //     // setQuestionOrder(props.questions.length + 1);
    // }

    const handleSubmit = () => {
        let formValid = true
        let optionsValid = true
        // validations
        if (questionText === '') {
            alert("The Question text should be entered!");
            formValid = false;
        }

        let items = [...options];
        for (let item of items) {
            if (item.value === undefined) {
                // if option is empty
                optionsValid = false;
            }
        }

        if (questionType === 'close' && !optionsValid) {
            alert("Options could not be empty! Remove it or Enter its text!")
            formValid = false;
        }

        if (numberOfOptions === 1 && maxAnswers === 1 && questionType === 'close') {
            alert("The closed question could not have only one single choice! Enter more options or change it to Open question!");
            formValid = false;
        }

        if (maxAnswers > numberOfOptions && questionType === 'close') {
            alert('The Maximun Answers should be Less or Equal to the total number of options!');
            formValid = false;
        }

        if (minAnswers > maxAnswers && questionType === 'close') {
            alert('The Minimum Answers should not be greater than Maximum Answers!');
            formValid = false

        }

        if (questionType === 'open' && openAnswerForce === '') {
            alert('Please choose the question is Mandatory or Optional!');
            formValid = false
        }

        if (formValid) {
            // filling the question
            props.handleQuestions.add({
                question: questionText,
                questionOrder: props.questions.length,
                questionType: questionType,
                minAnswers: minAnswers,
                maxAnswers: maxAnswers,
                options: options
            })

            setShow(false);
            setQuestionText('');
            setQuestionType('open');
            setOpenAnswerForce('');
            setminAnswers(0);
            setmaxAnswers(1);
            setOptions([{}]);
            setNumberOfOptions(1);

        }
    }



    return (
        <>
            <Button variant="info" onClick={handleShow}>
                Add Question
            </Button>

            <Modal show={show} onHide={handleClose} backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Add question</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row className="justify-content-center">
                        <Col md={12}>
                            <Form.Group className="mb-3" controlId="questionText">
                                <Form.Label>Question text</Form.Label>
                                <Form.Control type="text" name="surveyTitle" placeholder="Enter question" value={questionText}
                                    onChange={(ev) => setQuestionText(ev.target.value)} required />
                                <Form.Control.Feedback type="invalid">
                                    Please provide a text for question.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label as="legend" column sm={4}>
                                    Question Type:
                                </Form.Label>
                                <Col sm={8}>
                                    <Form.Check
                                        type="radio"
                                        label="Open ended Answer"
                                        name="questionType"
                                        id="open"
                                        value="open"
                                        onChange={SelectQuestionType}
                                        defaultChecked
                                    />
                                    <Form.Check
                                        type="radio"
                                        label="Closed Answer"
                                        name="questionType"
                                        id="close"
                                        value="close"
                                        onChange={SelectQuestionType}
                                    />
                                </Col>
                            </Form.Group>


                            {questionType === 'close' ?
                                <div>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group controlId="minOptions">
                                                <Form.Label>Minimum answers</Form.Label>
                                                <Form.Control as="select" value={minAnswers} onChange={selectMinValue}>
                                                    <option value="0">0</option>
                                                    <option value="1">1</option>
                                                    <option value="2">2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>
                                                    <option value="5">5</option>
                                                    <option value="6">6</option>
                                                    <option value="7">7</option>
                                                    <option value="8">8</option>
                                                    <option value="9">9</option>
                                                </Form.Control>
                                                <Form.Control.Feedback type="invalid">
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group controlId="maxOptions">
                                                <Form.Label>Maximum answers</Form.Label>
                                                <Form.Control as="select" value={maxAnswers} onChange={selectMaxValue}>
                                                    <option value="1">1</option>
                                                    <option value="2"> 2</option>
                                                    <option value="3">3</option>
                                                    <option value="4">4</option>
                                                    <option value="5">5</option>
                                                    <option value="6">6</option>
                                                    <option value="7">7</option>
                                                    <option value="8">8</option>
                                                    <option value="9">9</option>
                                                    <option value="10">10</option>
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    {disButton ?
                                        <>
                                            {numberOfOptions >= 10 ? <Alert variant="danger">Maximum 10 options are possible!</Alert> :
                                                <>
                                                    <Button variant="info" type="button" onClick={() => handleAdd()}>
                                                        {icon.plus}Options
                                                    </Button>
                                                </>
                                            }
                                        </>
                                        :
                                        <>
                                            <Button variant="info" type="button" disabled>
                                                {icon.plus}Options
                                            </Button>
                                        </>
                                    }


                                    <Row>
                                        {options.map((field, idx) => {
                                            return (
                                                <Col key={"col" + idx} md={4}>
                                                    <div key={`${field}-${idx}`} className="mb-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Enter option"
                                                            value={field.value}
                                                            onChange={e => handleChange(idx, e)}
                                                            required
                                                        />
                                                        {numberOfOptions === 1 ?
                                                            <>
                                                                <Button key={"removeButton" + idx} variant="secondary" type="button" onClick={() => handleRemove(idx)} disabled>
                                                                    {icon.remove}
                                                                </Button>
                                                            </>

                                                            :
                                                            <>
                                                                <Button key={"removeButton" + idx} variant="secondary" type="button" onClick={() => handleRemove(idx)}>
                                                                    {icon.remove}
                                                                </Button>
                                                            </>}

                                                    </div>
                                                </Col>
                                            );
                                        })}
                                    </Row>
                                </div>
                                : <fieldset>
                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label as="legend" column sm={4}>
                                            Question is:
                                        </Form.Label>
                                        <Col sm={8}>
                                            <Form.Check
                                                value="Optional"
                                                type="radio"
                                                label="Optional"
                                                name="OpenAnswerForce"
                                                id="Optional"
                                                onChange={OpenAnswerForce}
                                            />
                                            <Form.Check
                                                value="Mandatory"
                                                type="radio"
                                                label="Mandatory"
                                                name="OpenAnswerForce"
                                                id="Mandatory"
                                                onChange={OpenAnswerForce}
                                            />
                                        </Col>
                                    </Form.Group>
                                </fieldset>}
                        </Col>
                    </Row>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                    <Button variant="primary" onClick={handleSubmit}>Add</Button>
                </Modal.Footer>
            </Modal>
        </>
    )

}

export { QuestionForm };