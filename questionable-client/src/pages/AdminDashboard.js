import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { fetchEvents, removeEvent } from '../features/events/eventsSlice';

const selectEvents = state => state.events;

function AdminDashboard() {
    const eventState = useSelector( selectEvents );

    const navigate = useNavigate();

    const dispatch = useDispatch();

    useEffect( () => {
        fetchEvents( dispatch, eventState );
    }, [ dispatch, eventState ] );

    return (
        <>

            <Container bg="light">
                <h2 className="md-auto text-center p-4">Admin Dashboard</h2>
                <Row className="mb-3">
                    <Col className="mb-3">
                        {
                            <Button onClick={ () => { navigate( `/admin/event` ) } }>Add Event</Button>
                        }
                        { eventState.events.map( event => (
                            <Card border="secondary"
                                bg={ 'light' }
                                key={ event.id }>
                                <Card.Body>
                                    <Card.Title >{ event.name }</Card.Title>
                                    <Card.Body >
                                        { event.description }
                                        <br></br>
                                        { event.eventDate }
                                        <br></br>
                                    </Card.Body>
                                    {
                                        <Button onClick={ () => { navigate( `/admin/event/${ event.id }` ) } }>Update Details</Button>
                                    }
                                    {
                                        <Button onClick={ () => { removeEvent( event.id, dispatch ) } }>Delete Event</Button>
                                    }
                                    {
                                        <Button onClick={ () => { navigate( `/admin/event/${ event.id }/questions` ) } }>Manage Questions</Button>
                                    }
                                </Card.Body>
                            </Card>
                        ) ) }
                    </Col>
                </Row>

            </Container>




        </> );
}


export default AdminDashboard;