import { useState } from "react"
import { confirmSignUp } from "../auth"
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

export default function ConfirmSignUp() {
    const [ username, setUsername ] = useState( "" )
    const [ code, setCode ] = useState( "" )
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

        confirmSignUp( username, code ).then(
            function ( result ) {
                setSuccess( "Confirmation successful! Please login to use the app." )
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
        setCode( "" );
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
                <Breadcrumb.Item href="/signup">Sign Up</Breadcrumb.Item>
                <Breadcrumb.Item active>Confirm Sign Up</Breadcrumb.Item>
            </Breadcrumb>
            <Modal show={ show } variant="success">
                <Modal.Header closeButton>
                    <Modal.Title>Successfully Signed Up</Modal.Title>
                </Modal.Header>
                <Modal.Body>{ success }</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={ () => handleSuccess() }>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Container bg="light">
                <h2 className="md-auto text-center p-4">Confirm Sign Up</h2>
                <Form noValidate onSubmit={ handleSubmit } onReset={ handleReset } >
                    <Row className="mb-3">
                        <Col className="mb-3">
                        </Col>
                        <Col className="mb-3">
                            < Card
                                bg={ 'light' }>
                                <Card.Header as="h4">Confirm Sign Up</Card.Header>
                                <Card.Body >
                                    <Form.Group className="mb-3" controlId="formConfirmSignUpUsername" >
                                        <Form.Label>Username:</Form.Label>
                                        <Form.Control required maxLength="32" type="text" placeholder="Username" value={ username } onChange={ ( e ) => setUsername( e.target.value ) } />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formConfirmSignUpCode" >
                                        <Form.Label>Confirmation Code:</Form.Label>
                                        <Form.Control required maxLength="32" type="text" placeholder="Confirmation Code" value={ code } onChange={ ( e ) => setCode( e.target.value ) } />
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