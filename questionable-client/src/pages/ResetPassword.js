import { useState } from "react"
import { confirmPassword } from "../auth"
import { Link } from "react-router-dom"
import { Breadcrumb } from "react-bootstrap"
import { Container } from "react-bootstrap"
import { Form } from "react-bootstrap"
import { Row } from "react-bootstrap"
import { Col } from "react-bootstrap"
import { Card } from "react-bootstrap"
import { Button } from "react-bootstrap"
import { Modal } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../AuthContext"

export default function ResetPassword() {
    const [ username, setUsername ] = useState( "" )
    const [ confirmationCode, setConfirmationCode ] = useState( "" )
    const [ newPassword, setNewPassword ] = useState( "" )
    const [ error, setError ] = useState( "" )
    const [ success, setSuccess ] = useState( "" )
    const [ show, setShow ] = useState( false )

    const navigate = useNavigate();

    const { signOut } = useContext( AuthContext )

    const handleSubmit = async ( e ) => {
        e.preventDefault()
        setError( "" )
        setSuccess( "" )
        setShow( false );
        signOut();

        confirmPassword( username, confirmationCode, newPassword ).then(
            function ( result ) {
                setSuccess( "Your password has been reset successfully!" )
                setShow( true );
            },
            function ( error ) {
                setError( error.message );
            }
        );
    }

    const handleReset = ( e ) => {
        e.preventDefault();

        setUsername( "" );
        setConfirmationCode( "" );
        setNewPassword( "" );
        setError( "" )
        setSuccess( "" )
        setShow( false );
    }

    function handleSuccess() {
        signOut();
        setShow( false );
        navigate( "/login" );
    }

    return (
        <div>
            <Breadcrumb>
                <Breadcrumb.Item href="/forgot-password">Forgot Password</Breadcrumb.Item>
                <Breadcrumb.Item active>Reset Password</Breadcrumb.Item>
            </Breadcrumb>
            <Modal show={ show } variant="success">
                <Modal.Header closeButton>
                    <Modal.Title>Password Successfully Reset</Modal.Title>
                </Modal.Header>
                <Modal.Body>{ success }</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={ () => handleSuccess() }>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Container bg="light">
                <h2 className="md-auto text-center p-4">Reset Password</h2>
                <Form noValidate onSubmit={ handleSubmit } onReset={ handleReset } >
                    <Row className="mb-3">
                        <Col className="mb-3">
                        </Col>
                        <Col className="mb-3">
                            < Card
                                bg={ 'light' }>
                                <Card.Header as="h4">Reset Password</Card.Header>
                                <Card.Body >
                                    <Form.Group className="mb-3" controlId="formResetPasswordUsername" >
                                        <Form.Label>Username:</Form.Label>
                                        <Form.Control required maxLength="32" type="text" placeholder="Username" value={ username } onChange={ ( e ) => setUsername( e.target.value ) } />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formResetPasswordConfirmation" >
                                        <Form.Label>Confirmation Code:</Form.Label>
                                        <Form.Control required maxLength="32" type="text" placeholder="Confirmation Code" value={ confirmationCode } onChange={ ( e ) => setConfirmationCode( e.target.value ) } />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formResetPasswordNew" >
                                        <Form.Label>New Password:</Form.Label>
                                        <Form.Control required maxLength="32" type="password" placeholder="New Password" value={ newPassword } onChange={ ( e ) => setNewPassword( e.target.value ) } />
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
        </div>
    )
}