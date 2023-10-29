import React, { useEffect } from 'react';
import { Card, Form } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { fetchEventDetail } from '../../features/events/eventDetailSlice';
import { Breadcrumb } from 'react-bootstrap';
import '../../app/App.css';
import { processAddQuestion } from '../../features/events/eventDetailSlice';
import { ButtonGroup, ToggleButton } from 'react-bootstrap';
import { processQuestionApproval } from '../../features/events/eventDetailSlice';
import { Table } from 'react-bootstrap';


const selectEventDetail = state => state.currentEvent;

function AdminManageEventQuestions() {
    const eventDetailState = useSelector( selectEventDetail );

    const dispatch = useDispatch();

    const { id } = useParams();

    useEffect( () => {
        fetchEventDetail( dispatch, eventDetailState, id );
    }, [ dispatch, eventDetailState, id ] );

    const radios = [
        { name: 'Approve', value: '1' },
        { name: 'Unapprove', value: '-1' },
    ];

    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Item href="/admin">Admin Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item active>Manage Event Questions</Breadcrumb.Item>
            </Breadcrumb>
            <Container bg="light">
                <h2 className="md-auto text-center p-4">Manage Event Questions</h2>
                <Row className="mb-3">
                    <Col className="mb-3">
                        < Card border="secondary"
                            bg={ 'light' }
                            key={ eventDetailState.currentEvent.id } >
                            <Card.Header as="h4">{ eventDetailState.currentEvent.name }</Card.Header>
                            <Card.Body >
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
                                        ).map( qVal => (
                                            < tr key={ qVal.qid } >
                                                <td>{ qVal.question }</td>
                                                <td>{ qVal.ranking }</td>
                                                <td>
                                                    <Form className="ManageEventQuestionsForm" id="ManageEventQuestionsForm">
                                                        <ButtonGroup className="action-buttons">
                                                            { radios.map( ( radio, idx ) => (
                                                                <ToggleButton
                                                                    key={ qVal.qid + "-" + idx }
                                                                    id={ `radio-${ qVal.qid }-${ idx }` }
                                                                    type="radio"
                                                                    variant="primary"
                                                                    name={ `radio-${ qVal.qid }` }
                                                                    value={ radio.value }
                                                                    disabled={ setQuestionManagementButtonGroupState( qVal, idx ) }
                                                                    onChange={ ( e ) => processQuestionManagementButtonChange( e, eventDetailState.currentEvent.id, qVal.qid, dispatch )
                                                                    }
                                                                >
                                                                    { radio.name }
                                                                </ToggleButton>
                                                            ) ) }
                                                        </ButtonGroup>
                                                    </Form>
                                                </td>
                                            </tr>
                                        ) ) : <tr><td><p>No Questions Found</p></td></tr> }
                                    </tbody>
                                </Table>
                            </Card.Body>
                            <Card.Footer>
                                <Form className="ManageAddQuestionsForm" id="ManageAddQuestionsForm">
                                    <Form.Group className="mb-3" controlId="formManageAddQuestions" onKeyDown={ ( evt ) => { processAddQuestion( evt, dispatch, null ); } } >
                                        <Form.Label>Add a question:</Form.Label>
                                        <Form.Control type="text" placeholder="Enter question" />
                                    </Form.Group>
                                </Form>
                            </Card.Footer>
                        </Card>
                    </Col >
                </Row >

            </Container >
        </>
    );
}

function setQuestionManagementButtonGroupState( question, idx ) {

    // if the question is approved, disable the approve button and enable the disapprove button
    if ( question.approved !== undefined && question.approved !== null ) {
        if ( question.approved === true ) {
            if ( idx === 0 ) {
                return true;
            } else if ( idx === 1 ) {
                return false;
            } else {
                return false;
            }
        } else if ( question.approved === false ) {
            if ( idx === 0 ) {
                return false;
            } else if ( idx === 1 ) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function processQuestionManagementButtonChange( uiEvt, eventId, questionId, dispatch ) {

    //console.log( "processQuestionManagementButtonChange" );
    //console.log( uiEvt.target.form );
    //console.log( uiEvt.target.form[ `radio-${ questionId }-${ 0 }` ] );
    //console.log( uiEvt.target.form[ `radio-${ questionId }-${ 1 }` ] );

    let approveButton = uiEvt.target.form[ `radio-${ questionId }-${ 0 }` ];
    let unapproveButton = uiEvt.target.form[ `radio-${ questionId }-${ 1 }` ];

    // if the approved button is pressed, dispatch the approveQuestion action
    // if the unapproved button is pressed, dispatch the unapproveQuestion action
    // if the delete button is pressed, dispatch the deleteQuestion action
    if ( approveButton.checked ) {
        processQuestionApproval( eventId, questionId, true, dispatch );
    } else if ( unapproveButton.checked ) {
        processQuestionApproval( eventId, questionId, false, dispatch );
    }
}


export default AdminManageEventQuestions;



