import { useState } from "react"
import { forgotPassword } from "../auth"
import { useNavigate } from "react-router-dom"
import { Breadcrumb } from "react-bootstrap"
import { Container } from "react-bootstrap"
import { Form } from "react-bootstrap"
import { Row } from "react-bootstrap"
import { Col } from "react-bootstrap"
import { Card } from "react-bootstrap"
import { Button } from "react-bootstrap"
import { Link } from "react-router-dom"

export default function ForgotPassword() {
    const [ username, setUsername ] = useState( "" )
    const [ error, setError ] = useState( "" )

    const navigate = useNavigate();

    const handleSubmit = ( e ) => {
        e.preventDefault()
        setError( "" )

        forgotPassword( username ).then(
            function ( result ) {
                navigate( "/reset-password" );
            },
            function ( error ) {
                setError( error.message );
            }
        );
    }

    const handleReset = ( e ) => {
        e.preventDefault();

        setUsername( "" );
        setError( "" )
    }

    return (
        <div>
            <Breadcrumb>
                <Breadcrumb.Item href="/login">Login</Breadcrumb.Item>
                <Breadcrumb.Item active>Forgot Password</Breadcrumb.Item>
            </Breadcrumb>
            <Container bg="light">
                <h2 className="md-auto text-center p-4">Forgot Password</h2>
                <Form noValidate onSubmit={ handleSubmit } onReset={ handleReset } >
                    <Row className="mb-3">
                        <Col className="mb-3">
                        </Col>
                        <Col className="mb-3">
                            < Card
                                bg={ 'light' }>
                                <Card.Header as="h4">Forgot Password</Card.Header>
                                <Card.Body >
                                    <Form.Group className="mb-3" controlId="formForgotPasswordUsername" >
                                        <Form.Label>Username:</Form.Label>
                                        <Form.Control required maxLength="32" type="text" placeholder="Username" onChange={ ( e ) => setUsername( e.target.value ) } />
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