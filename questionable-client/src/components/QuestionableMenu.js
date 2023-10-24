import React from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';

function QuestionableMenu() {

    return (
        <div>
            <Navbar bg="light" expand="xl">
                <Container fluid>
                    <Navbar.Brand href="#home">Questionable</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/login">Sign In</Nav.Link>
                            <Nav.Link href="/logout">Sign Out</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );

}


export default QuestionableMenu;