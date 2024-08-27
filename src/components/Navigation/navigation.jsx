import React, { useState } from 'react';
import { Navbar, Nav, NavDropdown, Offcanvas } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./navigation.css"
export default function Navigation() {
    const [show, setShow] = useState(false);

    const toggleOffcanvas = () => {
        setShow(!show);
    };

    return (
        <>
            <Navbar bg="light" expand="lg" className="shadow-sm">
                <Navbar.Brand href="#home" className="MarketCallTag">MarketCalls</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggleOffcanvas} />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#features">Portfolio</Nav.Link>
                        <Nav.Link href="#pricing">Orders</Nav.Link>
                        <NavDropdown title="More" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Option1</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Option2</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Option3</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="#logout" className="logout">Logout</Nav.Link>

                    </Nav>
                </Navbar.Collapse>
            </Navbar>

            <Offcanvas show={show} onHide={toggleOffcanvas}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Dashboard</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="flex-column">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#features">Features</Nav.Link>
                        <Nav.Link href="#pricing">Pricing</Nav.Link>
                        <NavDropdown title="More" id="offcanvas-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Option1</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Option2</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Option3</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="#logout" className="logout">Logout</Nav.Link>
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}
