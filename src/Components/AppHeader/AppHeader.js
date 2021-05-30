import React from "react";
import { Container, Nav, Navbar, NavDropdown, Image } from "react-bootstrap";

import * as constants from '../../constants/constants'
import "./AppHeader.css";

const AppHeader = () => {
    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="#home">
                    <Image
                        src={constants.APP_LOGO}
                        alt="MarketPlaceLogo"
                        width="60"
                        height="40"
                        roundedCircle
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="#Approve">Open</Nav.Link>
                        <Nav.Link href="#Approve">Approve</Nav.Link>
                        <Nav.Link href="#InProgress">InProgress</Nav.Link>
                        <Nav.Link href="#InProgress">Completed</Nav.Link>
                        <NavDropdown
                            title="Dropdown"
                            id="collasible-nav-dropdown"
                        >
                            <NavDropdown.Item href="#action/3.1">
                                Action
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">
                                Another action
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">
                                Something
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">
                                Separated link
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav className="ml-auto">
                        <Nav.Link href="#deets">More</Nav.Link>
                        <Nav.Link eventKey={2} href="#memes">
                            Dank memes
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppHeader;
