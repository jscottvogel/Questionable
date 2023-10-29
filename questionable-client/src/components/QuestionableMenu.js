import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { AuthContext } from '../AuthContext';
import { useContext } from 'react';

function QuestionableMenu() {

    const { user } = useContext( AuthContext )

    return (
        <div>
            <Navbar bg="light" expand="xl">
                <Container fluid>
                    <Navbar.Brand href="/">Questionable</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            {/* if no user is logged in, show the following links */ }
                            { !user &&
                                <Nav.Link href="/login">Sign In / Sign Up</Nav.Link>
                            }

                            {/* if user is logged in, show the following links */ }
                            { user && (
                                <Nav.Link href="/profile">Profile</Nav.Link>
                            ) }
                            { user && (
                                <Nav.Link href="/logout">Sign Out</Nav.Link>
                            ) }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );

}


export default QuestionableMenu;