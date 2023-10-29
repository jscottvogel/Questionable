import React from "react";
import { useNavigate } from "react-router-dom"
import { signOut } from "../auth"
import { useEffect } from "react"
import { Container } from 'react-bootstrap';
import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import { Link } from "react-router-dom"


export default function LogoutPage() {
    const navigate = useNavigate();

    useEffect( () => {
        signOut()

        navigate( "/" );
    }, [ navigate ] )

    return (
        <div>
            <Container bg="light">
                <h2 className="md-auto text-center p-4">Logout</h2>
                <Row className="mb-3">
                    <Col className="mb-3">
                    </Col>
                    <Col className="mb-3">
                        < Card
                            bg={ 'light' }>
                            <Card.Header as="h4">Logout</Card.Header>
                            <Card.Body >

                                { <p style={ { color: "red" } }>{ "Logging out..." }</p> }

                            </Card.Body>
                            <Card.Footer className="text-muted">
                                <br />
                                <Row className="mb-3">
                                    <Col className="mb-3">
                                        <Link to="/login">Login</Link><br />
                                    </Col>
                                </Row>
                            </Card.Footer>
                        </Card>
                    </Col>
                    <Col className="mb-3">
                    </Col>
                </Row>
            </Container >
        </div>
    )
}

