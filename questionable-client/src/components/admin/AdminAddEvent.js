import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Breadcrumb } from 'react-bootstrap';
import '../../app/App.css';
import { useNavigate } from 'react-router-dom';
import { addNewEvent } from '../../features/events/eventsSlice';
import { Card } from 'react-bootstrap';

function AdminAddEvent() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleSubmit( e ) {
        e.preventDefault()
        let eventName = e.currentTarget.AddEventName.value;
        let eventDate = e.currentTarget.AddEventDate.value;
        let eventDescription = e.currentTarget.AddEventDescription.value;
        addNewEvent( { "name": eventName, "eventDate": eventDate, "questions": [], "isActive": true, "description": eventDescription }, dispatch );

        navigate( '/admin' );
    }

    function handleReset( e ) {
        e.preventDefault();

        e.currentTarget.AddEventName.value = "";
        e.currentTarget.AddEventDescription.value = "";
        e.currentTarget.AddEventDate.value = ( new Date() ).toISOString().substring( 0, 10 );
    }

    return (
        <>
            <Breadcrumb>
                <Breadcrumb.Item href="/admin">Admin Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item active>Add Event</Breadcrumb.Item>
            </Breadcrumb>
            <Container bg="light">
                <h2 className="md-auto text-center p-4">Add Event</h2>
                <Row className="mb-3">
                    <Col className="mb-3">
                        < Card border="secondary"
                            bg={ 'light' } >
                            <Card.Header as="h4">{ "New Event" }</Card.Header>
                            <Card.Body>
                                <Form className="AddEventForm" id="AddEventForm" onSubmit={ ( e ) => handleSubmit( e ) } onReset={ handleReset } >
                                    <Form.Group className="mb-3" controlId="formAddEvent">
                                        <Form.Label>Event Name</Form.Label>
                                        <Form.Control name="AddEventName" type="text" required placeholder="Enter event name" />
                                        <br></br>
                                        <Form.Label>Event Description</Form.Label>
                                        <Form.Control name="AddEventDescription" type="text" required placeholder="Enter event description" />
                                        <br></br>
                                        <Form.Label>Event Date</Form.Label>
                                        <Form.Control type="date" name="AddEventDate" required placeholder="Enter event date" defaultValue={ ( new Date() ).toISOString().substring( 0, 10 )
                                        } />
                                    </Form.Group>
                                    <br></br>
                                    <Button variant="primary" type="submit">
                                        Submit
                                    </Button>
                                    &nbsp;&nbsp;
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

export default AdminAddEvent;


