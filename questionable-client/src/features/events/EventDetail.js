import React, { useEffect } from 'react';
import { Card, Form } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { fetchEventDetail } from './eventDetailSlice';
import { Breadcrumb } from 'react-bootstrap';
import { ButtonGroup, ToggleButton } from 'react-bootstrap';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import '../../app/App.css';

const selectEventDetail = state => state.currentEvent;

function EventDetail() {
    const eventDetailState = useSelector( selectEventDetail );

    const dispatch = useDispatch();

    const { id } = useParams();

    useEffect( () => {
        fetchEventDetail( dispatch, eventDetailState, id );
    }, [ dispatch, eventDetailState, id ] );

    const radios = [
        { name: 'Like', value: '1' },
        { name: 'Neutral', value: '0' },
        { name: 'Dislike', value: '-1' },
    ];

    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Event Detail</Breadcrumb.Item>
            </Breadcrumb>
            <Container bg="light">
                <h2 className="md-auto text-center p-4">Event Detail</h2>
                <Row className="mb-3">
                    <Col className="mb-3">
                        < Card border="secondary"
                            bg={ 'light' }
                            key={ eventDetailState.currentEvent.id } >
                            <Card.Body>
                                <Card.Title >{ eventDetailState.currentEvent.name }</Card.Title>
                                <p>Event Id: { eventDetailState.currentEvent.id }</p>
                                <p>Event Date: { eventDetailState.currentEvent.eventDate }</p>
                                <Form className="EventDetailForm" id="EventDetailForm">
                                    <Form.Group className="mb-3" controlId="formEventDetail" onKeyDown={ ( evt ) => processAddQuestion( evt, dispatch ) } >
                                        <table className="question-table" id="question-table">
                                            <thead>
                                                <tr>
                                                    <th align="center">Question</th>
                                                    <th align="center">Ranking</th>
                                                    <th align="center"></th>
                                                    <th colSpan="4" align="center">Rating</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                { ( eventDetailState.currentEvent.questions !== null && eventDetailState.currentEvent.questions !== undefined ) ? [ ...eventDetailState.currentEvent.questions ].sort( ( a, b ) =>
                                                    b.ranking - a.ranking
                                                ).map( qVal => (
                                                    <tr key={ qVal.qid }>
                                                        <td>{ qVal.question }</td>
                                                        <td>{ qVal.ranking }</td>
                                                        <td colSpan="5">
                                                            <ButtonGroup className="like-buttons">
                                                                { radios.map( ( radio, idx ) => (
                                                                    <ToggleButton
                                                                        key={ qVal.qid + "-" + idx }
                                                                        id={ `radio-${ qVal.qid }-${ idx }` }
                                                                        type="radio"
                                                                        variant="primary"
                                                                        name={ `radio-${ qVal.qid }-${ idx }` }
                                                                        value={ radio.value }
                                                                        checked={ radio.value === 0 }
                                                                        onChange={ ( e ) => processButtonChange( e, eventDetailState.currentEvent.id, qVal.qid, dispatch )
                                                                        }
                                                                    >
                                                                        { radio.name }
                                                                    </ToggleButton>
                                                                ) ) }
                                                            </ButtonGroup>

                                                        </td>
                                                    </tr>
                                                ) ) : <tr><td colSpan="7"><p>No Questions Found</p></td></tr> }
                                            </tbody>
                                        </table>

                                        <div>
                                            <Form.Label>Question</Form.Label>
                                            <Form.Control type="text" placeholder="Enter question" />
                                        </div>
                                    </Form.Group>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col >
                </Row >

            </Container >
        </> );
}

function processAddQuestion( event, dispatch ) {
    //console.log( "Add Question" );
    //console.log( event );

    if ( event !== null && event !== undefined ) {

        if ( event.keyCode === 13 || event.which === 13 ) {

            let newQuestion = event.target.value;

            // todo: add question to the event
            // set the ranking to 0
            // add the question to the state
            // clear the input field
            event.target.value = "Enter question";

            dispatch( { type: "currentEvent/addQuestion", payload: newQuestion } );
        }
    }
}

function processButtonChange( uiEvt, eventId, questionId, dispatch ) {
    console.log( "Change" );
    console.log( uiEvt );
    console.log( uiEvt.target.value );
    console.log( eventId );
    console.log( questionId );

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
        if ( uiEvt.target.prev === 1 ) {
            adjustment = -1;
            // like button unpressed
            // neutral button pressed
            // dislike button unpressed
        } else if ( ranking === -1 ) {
            adjustment = 1;
        } else {
            adjustment = 0;
        }
    } else if ( uiEvt.target.value === "1" ) {
        if ( ranking === 1 ) {
            adjustment = 0;
        } else if ( ranking === -1 ) {
            adjustment = 2;
        } else {
            adjustment = 1;
        }
    } else if ( uiEvt.target.value === "-1" ) {
        if ( ranking === 1 ) {
            adjustment = -2;
        } else if ( ranking === -1 ) {
            adjustment = 0;
        } else {
            adjustment = -1;
        }
    }

    processAdjustment( eventId, questionId, adjustment, dispatch );

}

function processAdjustment( eventId, questionId, adjustment, dispatch ) {
    dispatch( { type: "currentEvent/processAdjustment", payload: [ eventId, questionId, adjustment ] } );
}

export default EventDetail;


