import React from "react";
import { useState } from "react"
import { AuthContext } from "../AuthContext"
import { useContext } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { Container, Row, Col } from 'react-bootstrap';
import { Form, Button } from 'react-bootstrap';


export default function LoginPage() {
    const [ username, setUsername ] = useState( "" )
    const [ password, setPassword ] = useState( "" )
    const [ error, setError ] = useState( "" )

    const navigate = useNavigate();

    const { user, signIn, signOut } = useContext( AuthContext )

    const handleSubmit = ( event ) => {
        //const form = event.currentTarget;
        setError( "Invalid username or password" );

        //if ( form.checkValidity() === false ) {
        event.preventDefault();
        event.stopPropagation();

        try {
            //console.log( "Login: ", username, password );
            signIn( username, password )
            // Redirect to the app's main page or dashboard

            // If the user is logged in, don't show the login form
            //console.log( "User: ", user );
            if ( user ) {
                // Redirect to the admin dashboard page

                return navigate( "/admin" );
            } else {
                setError( "Invalid username or password" );
                setUsername( "" );
                setPassword( "" );
            }

        } catch ( err ) {
            setError( err.message )
            setUsername( "" );
            setPassword( "" );
        }
        //}
    };

    const handleReset = ( e ) => {
        e.preventDefault()
        setError( "" )

        try {
            signOut( username, password )

            setUsername( "" );
            setPassword( "" );
        } catch ( err ) {
            setError( err.message )
            setUsername( "" );
            setPassword( "" );
        }

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

                        </Col>
                        <Col className="mb-3">
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col className="mb-3">
                        </Col>
                        <Col className="mb-3">
                            <Row className="mb-3">
                                <Col className="mb-3">
                                    <Button variant="primary" type="submit">
                                        Login
                                    </Button>
                                </Col>
                                <Col className="mb-3">
                                    <Button variant="primary" type="reset">Cancel</Button>
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col className="mb-3">
                                    <Link to="/signUp">Create Account</Link>
                                </Col>
                                <Col className="mb-3">
                                    <Link to="/forgot-password">Forgot Password</Link>
                                </Col>
                            </Row>
                        </Col>
                        <Col className="mb-3">
                        </Col>
                    </Row>
                </Form>
            </Container >
        </> )
}

