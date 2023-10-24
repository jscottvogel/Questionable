import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Breadcrumb } from 'react-bootstrap';
import '../../app/App.css';
import { useNavigate } from 'react-router-dom';
import { addNewEvent } from '../../features/events/eventsSlice';

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
                        <Form className="AddEventForm" id="AddEventForm" onSubmit={ ( e ) => handleSubmit( e ) } >
                            <Form.Group className="mb-3" controlId="formAddEvent">
                                <Form.Label>Event Name</Form.Label>
                                <Form.Control name="AddEventName" type="text" required placeholder="Enter event name" />
                                <Form.Text className="text-muted">
                                    Enter the name of the event.
                                </Form.Text>
                                <br></br>
                                <br></br>
                                <Form.Label>Event Description</Form.Label>
                                <Form.Control name="AddEventDescription" type="text" required placeholder="Enter event description" />
                                <Form.Text className="text-muted">
                                    Enter the description of the event.
                                </Form.Text>
                                <Form.Label>Event Date</Form.Label>
                                <Form.Control type="date" name="AddEventDate" required placeholder="Enter event date" defaultValue={ ( new Date() ).toISOString().substring( 0, 10 )
                                } />
                                <Form.Text className="text-muted">
                                    Enter the date of the event.
                                </Form.Text>
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                            <Button variant="secondary" type="cancel">
                                Cancel
                            </Button>
                        </Form>
                    </Col >
                </Row >

            </Container >
        </> );
}

export default AdminAddEvent;


