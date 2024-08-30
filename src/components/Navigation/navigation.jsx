import React, { useState,useEffect } from 'react';
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
import KotakOtpModal from '../Integration/kotak/kotak_otp';
import Finvasia from '../Integration/finvasia/finvasia_modal';
import Cookies from "js-cookie";

export default function Navigation() {

    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isKotakIntegrated, setIsKotakIntegrated] = useState(false);
    const [isFinvasiaIntegrated, setIsFinvasiaIntegrated] = useState(false);
    const [showKotakModal, setShowKotakModal] = useState(false);
    const [showFinvasiaModal, setShowFinvasiaModal] = useState(false);

    useEffect(() => {
        if (Cookies.get('kotak_access_token')) {
            setIsKotakIntegrated(true);
        }
        if (Cookies.get('finvasia_access_token')) {
            setIsFinvasiaIntegrated(true);
        }
    }, []);

    const navigation = useNavigate();

    const toggleOffcanvas = () => {
        setShow(!show);
    };

    const handleKotakIntegration = () => {
        setLoading(true);
        axios
            .get(
                `${apiBaseUrl}integrations/kotak/`,
                {
                    headers: {
                        Authorization: Cookies.get("access_token"),
                        'bypass-tunnel-reminder': "true"
                    }
                }
            )
            .then((res) => {
                setLoading(false);
                if (res.status === 200) {
                    localStorage.setItem('access_token', res.data["access_token"]);
                    localStorage.setItem('sid', res.data["sid"]);
                    localStorage.setItem('user_id', res.data["user_id"]);
                    localStorage.setItem('view_token', res.data["view_token"]);
                    setShowKotakModal(true);
                }
            })
            .catch((error) => {
                setLoading(false);
                if (error.response) {
                    toast.error(`Error: ${error.response.status} - ${error.response.data.message || 'Something went wrong!'}`);
                } else if (error.request) {
                    toast.error('No response received from the server.');
                } else {
                    toast.error('Something went wrong');
                }
            });

    }

    const handleFinvasiaIntegration = () => {
        setLoading(true);
        axios
            .get(
                `${apiBaseUrl}integrations/shoonya/`,
                {
                    headers: {
                        Authorization: Cookies.get("access_token"),
                        'bypass-tunnel-reminder': "true"
                    }
                }
            )
            .then((res) => {
                setLoading(false);
                console.log(res);
                if (res.status === 200) {
                    Cookies.set('finvasia_access_token', res.data, { expires: 1 });
                    setShowFinvasiaModal(true);
                    setIsFinvasiaIntegrated(true);
                }
            })
            .catch((error) => {
                setLoading(false);
                if (error.response) {
                    if (error.response.status === 400) {
                        toast.error("Invalid Parameter!");
                    } else {
                        toast.error(`Error: ${error.response.status} - ${error.response.data.message || 'Something went wrong!'}`);
                    }
                } else if (error.request) {
                    toast.error('No response received from the server.');
                } else {
                    toast.error('Something went wrong');
                }
            });
    }

    const handleAlreadyIntegrated = () => {
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
                        <Nav.Link onClick={isKotakIntegrated ? handleAlreadyIntegrated : handleKotakIntegration} className={isKotakIntegrated ? "kotak_btn_integrated" : "kotak_btn"}>
                            Kotak {isKotakIntegrated ? <FontAwesomeIcon icon={faCheckCircle} className="check-icon" /> : <FontAwesomeIcon icon={faTimesCircle} className="cross-icon" />}
                        </Nav.Link>
                        <Nav.Link onClick={isFinvasiaIntegrated ? handleAlreadyIntegrated : handleFinvasiaIntegration} className={isFinvasiaIntegrated ? "finvasia_btn_integrated" : "finvasia_btn"}>
                            Finvasia {isFinvasiaIntegrated ? <FontAwesomeIcon icon={faCheckCircle} className="check-icon" /> : <FontAwesomeIcon icon={faTimesCircle} className="cross-icon" />}
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <Offcanvas show={show} onHide={toggleOffcanvas}>
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Menu</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                    <Nav className="ml-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#features">Portfolio</Nav.Link>
                        <Nav.Link href="#pricing">Orders</Nav.Link>
                        <NavDropdown title="More" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Option1</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Option2</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Option3</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Offcanvas.Body>
            </Offcanvas>

            {/* Kotak OTP Modal */}
            <KotakOtpModal show={showKotakModal} setIsKotakIntegrated={setIsKotakIntegrated} onHide={() => setShowKotakModal(false)} />

            {/* Finvasia Success Modal */}
            <Finvasia show={showFinvasiaModal} onHide={() => setShowFinvasiaModal(false)} />
        </>
    );
}