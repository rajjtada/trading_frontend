import React, { useState } from 'react';
import { Navbar, Nav, NavDropdown, Offcanvas } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./navigation.css"
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import apiBaseUrl from "../../constants/globaldata";
import loader from "../../assets/images/loader.gif";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import Cookies from "js-cookie";

export default function Navigation() {

    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isKotakIntegrated, setIsKotakIntegrated] = useState(false);
    const [isFinvasiaIntegrated, setIsFinvasiaIntegrated] = useState(false);
    const navigation = useNavigate();

    const toggleOffcanvas = () => {
        setShow(!show);
    };

    const KotakIntegration = () => {
        setLoading(true);
        axios
            .get(
                `${apiBaseUrl}integration/kotak/`,
                {   
                    headers: {
                        Cookie: Cookies.get("access_token"), 
                        'bypass-tunnel-reminder': "true"
                    }
                }
            )
            .then((res) => {
                setLoading(false);
                if (res.status === 200) {
                    const accessToken = res.data["access_token"];
                    // Cookies.set('access_token', accessToken, { expires: 1 }); 
                    toast.success("Login Successful");
                    setIsKotakIntegrated(true);
                    navigation("/kotak-auth");
                }
            })
            .catch((error) => {
                setLoading(false);
                if (error.response) {
                    if (error.response.status === 400) {
                        toast.error("OTP Invalid !");
                    } else {
                        toast.error(`Error: ${error.response.status} - ${error.response.data.message || 'Something went wrong!'}`);
                    }
                } else if (error.request) {
                    toast.error('No response received from the server.');
                } else {
                    toast.error('There was an error verifying the OTP!');
                }
            });
            setIsKotakIntegrated(!isKotakIntegrated);
    }

    const FinvasiaIntegration = () => {
        setLoading(true);
        axios
            .get(
                `${apiBaseUrl}integration/finvasia/`,
                {   

                    headers: {
                        Cookie: Cookies.get("access_token"),
                        'bypass-tunnel-reminder': "true"
                    }
                }
            )
            .then((res) => {
                setLoading(false);
                if (res.status === 200) {
                    const accessToken = res.data["access_token"];
                    // Cookies.set('access_token', accessToken, { expires: 1 }); 
                    toast.success("Login Successful");
                    setIsFinvasiaIntegrated(true)
                    navigation("/finvasia-auth");
                }
            })
            .catch((error) => {
                setLoading(false);
                if (error.response) {
                    if (error.response.status === 400) {
                        toast.error("OTP Invalid !");
                    } else {
                        toast.error(`Error: ${error.response.status} - ${error.response.data.message || 'Something went wrong!'}`);
                    }
                } else if (error.request) {
                    toast.error('No response received from the server.');
                } else {
                    toast.error('There was an error verifying the OTP!');
                }
            });
            setIsFinvasiaIntegrated(!isFinvasiaIntegrated);
    }

    const Already_Integrated = () => {
        toast.info("Already Integrated");
    }

    return (
        <>
            <ToastContainer />
            {loading && (
                <div className="loader-overlay d-flex justify-content-center align-items-center">
                    <img src={loader} alt="Loading..." className="loader-img" />
                </div>
            )}
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
                        <Nav.Link onClick={isKotakIntegrated ? Already_Integrated : KotakIntegration} className={isKotakIntegrated ? "kotak_btn_integrated" : "kotak_btn"}>
                            Kotak
                        <FontAwesomeIcon
                                icon={isKotakIntegrated ? faCheckCircle : faTimesCircle}
                                style={{ marginLeft: '8px', color: isKotakIntegrated ? 'green' : 'red' }}
                            />
                        </Nav.Link>

                        <Nav.Link onClick={isFinvasiaIntegrated ? Already_Integrated : FinvasiaIntegration} className={isFinvasiaIntegrated ? "finvasia_btn_integrated" : "finvasia_btn"}>
                            Finvasia
                        <FontAwesomeIcon
                                icon={isFinvasiaIntegrated ? faCheckCircle : faTimesCircle}
                                style={{ marginLeft: '8px', color: isFinvasiaIntegrated ? 'green' : 'red' }}
                            />
                        </Nav.Link>
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
                        <Nav.Link onClick={KotakIntegration} className="kotak_btn">Kotak</Nav.Link>
                        <Nav.Link onClick={FinvasiaIntegration} className="finvasia_btn">Finvaisa</Nav.Link>
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}
