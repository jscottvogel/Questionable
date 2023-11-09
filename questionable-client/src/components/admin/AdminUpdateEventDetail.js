import React, { useEffect } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchEventDetail, modifyEvent } from '../../features/events/eventDetailSlice';
import { Breadcrumb } from 'react-bootstrap';
import '../../app/App.css';
import { stringToDate } from '../../features/events/eventDetailSlice';
import { MDBCheckbox } from 'mdb-react-ui-kit';

const selectEventDetail = state => state.currentEvent;

function AdminUpdateEventDetail() {
    const eventDetailState = useSelector( selectEventDetail );

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const { id } = useParams();

    useEffect( () => {
        fetchEventDetail( dispatch, eventDetailState, id );
    }, [ dispatch, eventDetailState, id ] );

    function handleSubmit( e, eventId ) {
        e.preventDefault()
        let eventName = e.currentTarget.UpdateEventName.value;
        let eventDate = e.currentTarget.UpdateEventDate.value;
        let eventDescription = e.currentTarget.UpdateEventDescription.value;
        let eventCanAddQuestions = e.currentTarget.UpdateEventCanAddQuestions.checked ? true : false;

        let updatedEvent = {};
        updatedEvent.id = eventId;
        updatedEvent.name = eventName;
        updatedEvent.eventDate = eventDate;
        updatedEvent.description = eventDescription;
        updatedEvent.isActive = true;
        updatedEvent.canAddQuestions = eventCanAddQuestions;

        modifyEvent( updatedEvent, dispatch );

        navigate( `/admin` );
    }

    function handleReset( e ) {
        e.preventDefault();

        e.currentTarget.UpdateEventName.value = eventDetailState.currentEvent.name;
        e.currentTarget.UpdateEventDescription.value = eventDetailState.currentEvent.description;
        e.currentTarget.UpdateEventDate.value = stringToDate( eventDetailState.currentEvent.eventDate ).toISOString().substring( 0, 10 );
        e.currentTarget.UpdateEventCanAddQuestions.checked = eventDetailState.currentEvent.canAddQuestions;

    }

    function handleCheckboxClicked( e ) {
        dispatch( { type: 'currentEvent/toggleCanAddQuestions', payload: e.target.checked } );
    }

    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Item href="/admin">Admin Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item active>Update Event Detail</Breadcrumb.Item>
            </Breadcrumb>
            <Container bg="light">
                <h2 className="md-auto text-center p-4">Update Event Detail</h2>
                <Row className="mb-3">
                    <Col className="mb-3">
                        < Card border="secondary"
                            bg={ 'light' }
                            key={ eventDetailState.currentEvent.id } >
                            <Card.Header as="h4">{ eventDetailState.currentEvent.name }</Card.Header>
                            <Card.Body>
                                <Form className="UpdateEventDetailForm" id="UpdateEventDetailForm" onSubmit={ ( e ) => handleSubmit( e, eventDetailState.currentEvent.id, dispatch ) } onReset={ handleReset }  >
                                    <Form.Group className="mb-3" >
                                        <Form.Label htmlFor="UpdateEventName">Event Name</Form.Label>
                                        <Form.Control required name="UpdateEventName" id="UpdateEventName" type="text" placeholder="Enter event name" defaultValue={ eventDetailState.currentEvent.name } />
                                        <br></br>
                                        <Form.Label htmlFor="UpdateEventDescription">Event Description</Form.Label>
                                        <Form.Control required name="UpdateEventDescription" id="UpdateEventDescription" type="text" placeholder="Enter event description" defaultValue={ eventDetailState.currentEvent.description } />
                                        <br></br>
                                        <Form.Label htmlFor="UpdateEventDate">Event Date</Form.Label>
                                        <Form.Control required name="UpdateEventDate" id="UpdateEventDate" type="date" placeholder="Enter event date" defaultValue={ stringToDate( eventDetailState.currentEvent.eventDate ).toISOString().substring( 0, 10 ) } />
                                    </Form.Group>
                                    <MDBCheckbox name='UpdateEventCanAddQuestions' id='UpdateEventCanAddQuestions' label='Event Can Add Questions' checked={ eventDetailState.currentEvent.canAddQuestions } onChange={ handleCheckboxClicked } />
                                    <br></br>
                                    <Button variant="primary" type="submit">
                                        Submit
                                    </Button>
                                    &nbsp;
                                    <Button variant="primary" type="reset">
                                        Reset
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col >
                </Row >

            </Container >
        </> );
}

export default AdminUpdateEventDetail;


