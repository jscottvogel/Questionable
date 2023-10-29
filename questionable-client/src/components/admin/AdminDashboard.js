import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import Table from 'react-bootstrap/Table';
import { fetchEvents, removeEvent } from '../../features/events/eventsSlice';

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
                        <Button onClick={ () => { navigate( `/admin/event` ) } }>Add Event</Button>
                        <br></br>
                        <br></br>
                        { eventState.events.filter( event => event.isActive === true ).map( event => (
                            <Card border="secondary"
                                bg={ 'light' }
                                key={ event.id }>
                                <Card.Header as="h4">{ event.name }</Card.Header>
                                <Card.Body>
                                    <Table borderless>
                                        <tbody>
                                            <tr>
                                                <td><b>Event Date:</b>&nbsp;&nbsp;&nbsp;{ event.eventDate }</td>
                                            </tr>
                                            <tr>
                                                <td><b>Description:</b>&nbsp;&nbsp;&nbsp;{ event.description }</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Card.Body>
                                <Card.Body>
                                    <Button onClick={ () => { navigate( `/admin/event/${ event.id }` ) } }>Update Details</Button>
                                    &nbsp;&nbsp;
                                    <Button onClick={ () => { removeEvent( event.id, dispatch ) } }>Delete Event</Button>
                                    &nbsp;&nbsp;
                                    <Button onClick={ () => { navigate( `/admin/event/${ event.id }/questions` ) } }>Manage Questions</Button>
                                </Card.Body>
                            </Card>
                        ) ) }
                    </Col>
                </Row>
            </Container>
        </> );
}


export default AdminDashboard;