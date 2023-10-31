import React from "react";
import { useState } from "react"
import { AuthContext } from "../AuthContext"
import { useContext } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { Container, Row, Col } from 'react-bootstrap';
import { Form, Button } from 'react-bootstrap';
import { Card } from 'react-bootstrap';


export default function LoginPage() {
    const [ username, setUsername ] = useState( "" )
    const [ password, setPassword ] = useState( "" )
    const [ error, setError ] = useState( "" )

    const navigate = useNavigate();

    const { signIn, signOut, isAdmin } = useContext( AuthContext )

    const handleSubmit = ( event ) => {
        event.preventDefault();
        event.stopPropagation();

        signIn( username, password ).then(
            function ( res ) {
                //console.log( "Calling isAdmin()" );
                isAdmin().then(
                    function ( result ) {
                        //console.log( "isAdmin() returned " + result );

                        if ( result ) {
                            //console.log( "Going to Admin page" );
                            navigate( "/admin" );
                        } else {
                            //console.log( "Going to regular page" );
                            navigate( "/" );
                        }
                    },
                    function ( error ) {
                        console.log( "isAdmin() returned " + error );
                    }
                );
            },
            function ( error ) {
                setError( "Invalid username or password" );
                setUsername( "" );
                setPassword( "" );
            }
        );
    };

    const handleReset = ( e ) => {
        e.preventDefault();

        signOut().then(
            function ( result ) {
                setUsername( "" );
                setPassword( "" );
            },
            function ( error ) {
                setError( error.message )
                setUsername( "" );
                setPassword( "" );
            }
        );
    }

    return (
        <>
            <Container bg="light">
                <h2 className="md-auto text-center p-4">Login</h2>
                <Form noValidate onSubmit={ handleSubmit } onReset={ handleReset }>
                    <Row className="mb-3">
                        <Col className="mb-3">
                        </Col>
                        <Col className="mb-3">
                            < Card
                                bg={ 'light' }>
                                <Card.Header as="h4">Enter Credentials</Card.Header>
                                <Card.Body >
                                    <Form.Group className="mb-3" controlId="formLoginUsername" >
                                        <Form.Label>Username:</Form.Label>
                                        <Form.Control required maxLength="32" type="text" placeholder="Username" value={ username } onChange={ ( e ) => setUsername( e.target.value ) } />
                                        <Form.Control.Feedback type="invalid">
                                            Please provide a username.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formLoginPassword" >
                                        <Form.Label>Password:</Form.Label>
                                        <Form.Control required maxLength="32" type="password" placeholder="Password" value={ password } onChange={ ( e ) => setPassword( e.target.value ) } />
                                        <Form.Control.Feedback type="invalid">
                                            Please provide a password.
                                        </Form.Control.Feedback>
                                    </Form.Group>

                                    { error && <p style={ { color: "red" } }>{ error }</p> }

                                    <Button variant="primary" type="submit">
                                        Login
                                    </Button>
                                    &nbsp;&nbsp;
                                    <Button variant="primary" type="reset">Reset</Button>

                                </Card.Body>
                                <Card.Footer className="text-muted">
                                    <br />
                                    <Row className="mb-3">
                                        <Col className="mb-3">
                                            <Link to="/signUp">Create Account</Link><br />
                                            <Link to="/forgot-password">Forgot Password</Link>
                                        </Col>
                                    </Row>
                                </Card.Footer>
                            </Card>
                        </Col>
                        <Col className="mb-3">
                        </Col>
                    </Row>
                </Form>
            </Container >
        </> )
}

