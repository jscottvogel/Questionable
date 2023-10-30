import { Card, Button } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { fetchEvents } from './eventsSlice';
import { useEffect } from 'react';
import Table from 'react-bootstrap/Table';


const selectEvents = state => state.events

function EventList() {
    const eventState = useSelector( selectEvents );

    const navigate = useNavigate();

    const dispatch = useDispatch();

    useEffect( () => {
        fetchEvents( dispatch, eventState );
    }, [ dispatch, eventState ] );

    return (
        <>
            <Container bg="light">
                <h2 className="md-auto text-center p-4">Upcoming Events</h2>
                <Row className="mb-3">
                    <Col className="mb-3">
                        { eventState.events.filter( event => validEvent( event ) ).map( event => (
                            <Card
                                bg={ 'light' }
                                key={ event.id }>

                                <Card.Header as="h4">{ event.name }</Card.Header>
                                <Card.Body >
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
                                    <Button onClick={ () => { navigate( `/event/${ event.id }` ) } }>View Details</Button>
                                </Card.Body>
                            </Card>
                        ) ) }
                    </Col>
                </Row>

            </Container >




        </> );
}

function validEvent( event ) {

    if ( event !== null && event !== undefined ) {
        //console.log( event );

        if ( event.isActive === true ) {
            let today = new Date();
            let eventDate = new Date( event.eventDate );

            //console.log( eventDate.getTime() );
            //console.log( today.getTime() );

            if ( eventDate.getTime() >= today.getTime() ) {
                return true;
            }
        }
    }

    return false;
}

export default EventList;