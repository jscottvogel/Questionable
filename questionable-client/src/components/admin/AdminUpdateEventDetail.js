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

        let updatedEvent = {};
        updatedEvent.id = eventId;
        updatedEvent.name = eventName;
        updatedEvent.eventDate = eventDate;
        updatedEvent.description = eventDescription;
        updatedEvent.isActive = true;

        modifyEvent( updatedEvent, dispatch );

        navigate( `/admin` );
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
                                <Form className="UpdateEventDetailForm" id="UpdateEventDetailForm" onSubmit={ ( e ) => handleSubmit( e, eventDetailState.currentEvent.id, dispatch ) } >
                                    <Form.Group className="mb-3" controlId="formUpdateEventDetail">
                                        <Form.Label>Event Name</Form.Label>
                                        <Form.Control required name="UpdateEventName" type="text" placeholder="Enter event name" defaultValue={ eventDetailState.currentEvent.name } />
                                        <br></br>
                                        <Form.Label>Event Description</Form.Label>
                                        <Form.Control required name="UpdateEventDescription" type="text" placeholder="Enter event description" defaultValue={ eventDetailState.currentEvent.description } />
                                        <br></br>
                                        <Form.Label>Event Date</Form.Label>
                                        <Form.Control required name="UpdateEventDate" type="date" placeholder="Enter event date" defaultValue={ stringToDate( eventDetailState.currentEvent.eventDate ).toISOString().substring( 0, 10 ) } />
                                    </Form.Group>
                                    <br></br>
                                    <Button variant="primary" type="submit">
                                        Submit
                                    </Button>
                                    &nbsp;
                                    <Button variant="secondary" type="reset">
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


