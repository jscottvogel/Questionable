import { useState } from "react"
import { signUp } from "../auth"
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { Form, Button } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import { Breadcrumb } from 'react-bootstrap';

export default function SignUp() {
    const [ username, setUsername ] = useState( "" )
    const [ email, setEmail ] = useState( "" )
    const [ password, setPassword ] = useState( "" )
    const [ error, setError ] = useState( "" )

    const navigate = useNavigate();

    const handleSubmit = async ( e ) => {
        e.preventDefault()

        signUp( username, email, password ).then(
            function ( result ) {
                setError( "" )
                navigate( "/confirm-sign-up" );
            },
            function ( error ) {
                setError( error.message )
                setUsername( "" );
                setPassword( "" );
                setEmail( "" );
            }
        );
    }

    const handleReset = ( e ) => {
        e.preventDefault();

        setUsername( "" );
        setPassword( "" );
        setEmail( "" );
        setError( "" );
    }

    return (
        <div>
            <Breadcrumb>
                <Breadcrumb.Item href="/login">Login</Breadcrumb.Item>
                <Breadcrumb.Item active>Sign Up</Breadcrumb.Item>
            </Breadcrumb>
            <Container bg="light">
                <h2 className="md-auto text-center p-4">Sign Up</h2>
                <Form noValidate onSubmit={ handleSubmit } onReset={ handleReset } >
                    <Row className="mb-3">
                        <Col className="mb-3">
                        </Col>
                        <Col className="mb-3">
                            < Card
                                bg={ 'light' }>
                                <Card.Header as="h4">Sign Up</Card.Header>
                                <Card.Body >
                                    <Form.Group className="mb-3" controlId="formSignUpUsername" >
                                        <Form.Label>Username:</Form.Label>
                                        <Form.Control required maxLength="32" type="text" placeholder="Username" onChange={ ( e ) => setUsername( e.target.value ) } />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formSignUpEmail" >
                                        <Form.Label>Email:</Form.Label>
                                        <Form.Control required maxLength="32" type="email" placeholder="Email" onChange={ ( e ) => setEmail( e.target.value ) } />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formSignUpPassword" >
                                        <Form.Label>Password:</Form.Label>
                                        <Form.Control required maxLength="32" type="password" placeholder="Password" onChange={ ( e ) => setPassword( e.target.value ) } />
                                    </Form.Group>
                                    { error && <p style={ { color: "red" } }>{ error }</p> }

                                    <Button variant="primary" type="submit">
                                        Submit
                                    </Button>
                                    &nbsp;&nbsp;
                                    <Button variant="primary" type="reset">Reset</Button>
                                </Card.Body>
                                <Card.Footer className="text-muted">
                                    <br />
                                    <Row className="mb-3">
                                        <Col className="mb-3">
                                            <Link to="/login">Login</Link>
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
        </div >
    )
}