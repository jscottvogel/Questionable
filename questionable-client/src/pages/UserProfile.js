import { useContext } from "react"
import { AuthContext } from "../AuthContext"
import { Breadcrumb } from "react-bootstrap"
import { Container } from "react-bootstrap"
import { Form } from "react-bootstrap"
import { Row } from "react-bootstrap"
import { Col } from "react-bootstrap"
import { Card } from "react-bootstrap"
import { Link } from "react-router-dom"

export default function UserProfile() {
    const { user, session } = useContext( AuthContext )

    return (
        <div>
            <Breadcrumb>
                <Breadcrumb.Item href="/admin">Admin Dashboard</Breadcrumb.Item>
                <Breadcrumb.Item active>User Profile</Breadcrumb.Item>
            </Breadcrumb>
            <Container bg="light">
                <h2 className="md-auto text-center p-4">User Profile</h2>
                <Form noValidate>
                    <Row className="mb-3">
                        <Col className="mb-3">
                        </Col>
                        <Col className="mb-3">
                            < Card
                                bg={ 'light' }>
                                <Card.Header as="h4">{ user.username }</Card.Header>
                                <Card.Body >
                                    <Form.Group className="mb-3" controlId="formUserProfileUsername" >
                                        <Form.Label>Username:</Form.Label>
                                        <Form.Control required maxLength="32" type="text" placeholder="Username" value={ user.username } readOnly />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formUserProfileEmail" >
                                        <Form.Label>Email:</Form.Label>
                                        <Form.Control required maxLength="32" type="text" placeholder="Email" value={ user.email } readOnly />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formUserProfileGroups" >
                                        <Form.Label>Groups:</Form.Label>
                                        <Form.Control required maxLength="32" type="text" placeholder="Groups" value={ session.idToken.payload[ 'cognito:groups' ] } readOnly />
                                    </Form.Group>
                                </Card.Body>
                                <Card.Footer className="text-muted">
                                    <br />
                                    <Row className="mb-3">
                                        <Col className="mb-3">
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
        </div>
    )
}
