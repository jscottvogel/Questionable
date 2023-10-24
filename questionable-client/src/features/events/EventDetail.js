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
                                                ).filter( // filter approved questions
                                                    qVal => ( qVal.approved === true ) ).map( qVal => (
                                                        < tr key={ qVal.qid } >
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


