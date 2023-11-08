import React, { useEffect } from 'react';
import { Card, Form } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { fetchEventDetail } from './eventDetailSlice';
import { processAdjustment } from './eventDetailSlice';
import { Breadcrumb } from 'react-bootstrap';
import { ButtonGroup, ToggleButton } from 'react-bootstrap';
import '../../app/App.css';
import { processAddQuestion } from './eventDetailSlice';
import Table from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';

const selectEventDetail = state => state.currentEvent;

function EventDetail() {
    const [ show, setShow ] = useState( false );
    const eventDetailState = useSelector( selectEventDetail );

    const dispatch = useDispatch();

    const { id } = useParams();

    useEffect( () => {
        fetchEventDetail( dispatch, eventDetailState, id );
    }, [ dispatch, eventDetailState, id ] );

    const radios = [
        { name: '+1', value: '1' },
        { name: '0', value: '0' },
        { name: '-1', value: '-1' },
    ];

    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Event Detail</Breadcrumb.Item>
            </Breadcrumb>
            <Modal show={ show } variant="success">
                <Modal.Header closeButton>
                    <Modal.Title>Question Successfully Submitted</Modal.Title>
                </Modal.Header>
                <Modal.Body>Your question has been successfully submitted for approval.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={ () => setShow( false ) }>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Container bg="light">
                <h2 className="md-auto text-center p-4">Event Detail</h2>
                <Row className="mb-3">
                    <Col className="mb-3">
                        < Card
                            bg={ 'light' }
                            key={ eventDetailState.currentEvent.id } >
                            <Card.Header as="h4">{ eventDetailState.currentEvent.name }</Card.Header>
                            <Card.Body >
                                <Form id="EventDetailForm">
                                    <Table borderless>
                                        <tbody>
                                            <tr><td><b>Event Date:</b>&nbsp;&nbsp;&nbsp; { eventDetailState.currentEvent.eventDate }</td></tr>
                                            <tr>
                                                <td><b>Description:</b>&nbsp;&nbsp;&nbsp;{ eventDetailState.currentEvent.description }</td>
                                            </tr>
                                        </tbody>
                                    </Table>

                                    <Table>
                                        <thead>
                                            <tr>
                                                <th >Question</th>
                                                <th >Ranking</th>
                                                <th >Rating</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { ( eventDetailState.currentEvent.questions !== null && eventDetailState.currentEvent.questions !== undefined ) ? [ ...eventDetailState.currentEvent.questions ].sort( ( a, b ) =>
                                                b.ranking - a.ranking
                                            ).filter( // filter approved questions
                                                qVal => ( qVal.approved === true ) ).map( qVal => (
                                                    < tr key={ qVal.qid } >
                                                        <td>{ qVal.question }</td>
                                                        <td>{ qVal.ranking }</td>
                                                        <td>
                                                            <ButtonGroup>
                                                                { radios.map( ( radio, idx ) => (
                                                                    <ToggleButton style={ { fontSize: "8px" } }
                                                                        key={ qVal.qid + "-" + idx }
                                                                        id={ `radio-${ qVal.qid }-${ idx }` }
                                                                        type="radio"
                                                                        variant="primary"
                                                                        name={ `radio-${ qVal.qid }` }
                                                                        value={ radio.value }
                                                                        disabled={ setButtonGroupState( eventDetailState.currentEvent.id, qVal.qid, idx ) }
                                                                        onChange={ ( e ) => processButtonChange( e, eventDetailState.currentEvent.id, qVal.qid, dispatch )
                                                                        }
                                                                    >
                                                                        { radio.name }
                                                                    </ToggleButton>
                                                                ) ) }
                                                            </ButtonGroup>
                                                        </td>
                                                    </tr>
                                                ) ) : <tr><td><p>No Questions Found</p></td></tr> }
                                        </tbody>
                                    </Table>
                                </Form>
                            </Card.Body>
                            <Card.Footer>
                                <Form className="EventDetailAddQuestionForm" id="EventDetailAddQuestionForm">
                                    <Form.Group className="mb-3" controlId="formEventDetail" onKeyDown={ ( evt ) => { processAddQuestion( evt, dispatch, setShow ); } } >
                                        <Form.Label>Add a question:</Form.Label>
                                        <Form.Control type="text" placeholder="Enter question" />
                                    </Form.Group>
                                </Form>
                            </Card.Footer>
                        </Card>
                    </Col >
                </Row >

            </Container >
        </> );
}

function processButtonChange( uiEvt, eventId, questionId, dispatch ) {


    let buttonGroupId = eventId + "-" + questionId;

    // get the previousValue of the buttons (remember, these are treated like one button)
    // get the button state for this question from session storage
    // if the button state is not found, then set the previousValue to 0
    // if the button state is found, then set the previousValue to the button state
    let previousValue = sessionStorage.getItem( buttonGroupId );
    if ( previousValue === undefined || previousValue === null ) {
        previousValue = 0;
    }

    let likeButton = uiEvt.target.form[ `radio-${ questionId }-${ 0 }` ];
    let neutralButton = uiEvt.target.form[ `radio-${ questionId }-${ 1 }` ];
    let dislikeButton = uiEvt.target.form[ `radio-${ questionId }-${ 2 }` ];

    // if neutral button pressed, then if the question was liked, subtract 1 from the ranking
    // if neutral button pressed, then if the question was disliked, add 1 to the ranking
    // if neutral button pressed, then if the question was neutral, do nothing
    // if like button pressed, then if the question was liked, do nothing
    // if like button pressed, then if the question was disliked, add 2 to the ranking
    // if like button pressed, then if the question was neutral, add 1 to the ranking
    // if dislike button pressed, then if the question was liked, subtract 2 from the ranking
    // if dislike button pressed, then if the question was disliked, do nothing
    // if dislike button pressed, then if the question was neutral, subtract 1 from the ranking

    let adjustment = 0;

    if ( uiEvt.target.value === "0" ) {
        // like button unpressed
        // neutral button pressed
        // dislike button unpressed
        likeButton.disabled = false;
        neutralButton.disabled = true;
        dislikeButton.disabled = false;
        if ( previousValue === "1" ) {
            adjustment = -1;
        } else if ( previousValue === "-1" ) {
            adjustment = 1;
        } else {
            adjustment = 0;
        }
    } else if ( uiEvt.target.value === "1" ) {
        // like button pressed
        // neutral button unpressed
        // dislike button unpressed
        likeButton.disabled = true;
        neutralButton.disabled = false;
        dislikeButton.disabled = false;
        if ( previousValue === "1" ) {
            adjustment = 0;
        } else if ( previousValue === "-1" ) {
            adjustment = 2;
        } else {
            adjustment = 1;
        }
    } else if ( uiEvt.target.value === "-1" ) {
        // like button unpressed
        // neutral button unpressed
        // dislike button pressed
        likeButton.disabled = false;
        neutralButton.disabled = false;
        dislikeButton.disabled = true;
        if ( previousValue === "1" ) {
            adjustment = -2;
        } else if ( previousValue === "-1" ) {
            adjustment = 0;
        } else {
            adjustment = -1;
        }
    }

    sessionStorage.setItem( buttonGroupId, uiEvt.target.value );
    processAdjustment( eventId, questionId, adjustment, dispatch );

}

function setButtonGroupState( evid, qid, bnum ) {
    let buttonGroupId = evid + "-" + qid;

    // get the previousValue of the buttons (remember, these are treated like one button)
    // get the button state for this question from session storage
    // if the button state is not found, then set the previousValue to 0
    // if the button state is found, then set the previousValue to the button state
    let previousValue = sessionStorage.getItem( buttonGroupId );
    if ( previousValue === undefined || previousValue === null ) {
        previousValue = 0;
        sessionStorage.setItem( buttonGroupId, previousValue );
    }

    // if neutral button pressed, then if the question was liked, subtract 1 from the ranking
    // if neutral button pressed, then if the question was disliked, add 1 to the ranking
    // if neutral button pressed, then if the question was neutral, do nothing
    // if like button pressed, then if the question was liked, do nothing
    // if like button pressed, then if the question was disliked, add 2 to the ranking
    // if like button pressed, then if the question was neutral, add 1 to the ranking
    // if dislike button pressed, then if the question was liked, subtract 2 from the ranking
    // if dislike button pressed, then if the question was disliked, do nothing
    // if dislike button pressed, then if the question was neutral, subtract 1 from the ranking

    if ( previousValue === "0" ) {
        // like button unpressed
        // neutral button pressed
        // dislike button unpressed
        if ( bnum === 0 ) return false;
        if ( bnum === 1 ) return true;
        if ( bnum === 2 ) return false;
    } else if ( previousValue === "1" ) {
        // like button pressed
        // neutral button unpressed
        // dislike button unpressed
        if ( bnum === 0 ) return true;
        if ( bnum === 1 ) return false;
        if ( bnum === 2 ) return false;
    } else if ( previousValue === "-1" ) {
        // like button unpressed
        // neutral button unpressed
        // dislike button pressed
        if ( bnum === 0 ) return false;
        if ( bnum === 1 ) return false;
        if ( bnum === 2 ) return true;
    }

}


export default EventDetail;


