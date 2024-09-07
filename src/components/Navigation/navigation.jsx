import React, { useState, useEffect } from 'react';
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./navigation.css";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiBaseUrl from "../../constants/globaldata";
import loader from "../../assets/images/loader.gif";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import KotakOtpModal from '../Integration/kotak/kotak_otp';
import Finvasia from '../Integration/finvasia/finvasia_modal';
import Cookies from "js-cookie";

export default function Navigation({setIsShoonyaConnected}) {
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

    const logout = () => {
        Cookies.remove('kotak_access_token');
        Cookies.remove('finvasia_access_token');
        Cookies.remove('access_token');
        toast.success("Logged out successfully");
        navigation("/");
    };

    const toggleOffcanvas = () => {
        setShow(!show);
    };

    const handleKotakIntegration = () => {
        setLoading(true);
        axios
            .get(`${apiBaseUrl}integrations/kotak/auth/`, {
                headers: {
                    Authorization: Cookies.get("access_token"),
                    'bypass-tunnel-reminder': "true"
                }
            })
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
                handleError(error);
            });
    };

    const handleFinvasiaIntegration = () => {
        setLoading(true);
        axios
            .get(`${apiBaseUrl}integrations/shoonya/auth`, {
                headers: {
                    Authorization: Cookies.get("access_token"),
                    'bypass-tunnel-reminder': "true"
                }
            })
            .then((res) => {
                setLoading(false);
                if (res.status === 200) {
                    const finvasia_access_token = {
                        shoonya_api_access: res.data["shoonya_api_access"],
                        uid: res.data["uid"],
                    }
                    Cookies.set('finvasia_access_token', JSON.stringify(finvasia_access_token), { expires: 1 });
                    setShowFinvasiaModal(true);
                    setIsFinvasiaIntegrated(true);
                    setIsShoonyaConnected(true);
                }
            })
            .catch((error) => {
                setLoading(false);
                handleError(error);
            });
    };

    const handleError = (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                try {
                    const detail = JSON.parse(error.response.data.detail);  
                    const { message, flag } = detail;  
    
                    console.log(`Message: ${message}, Flag: ${flag}`);
    
                    if (flag === "k" || flag === "s") {
                        toast.error(message);
                    } else {
                        navigation("/");  
                    }
                } catch (e) {
                    toast.error('Error: Unable to parse error details.');
                }
            } else {
                toast.error(`Error: ${error.response.status} - ${error.response.data.message || 'Something went wrong!'}`);
            }
        } else if (error.request) {
            toast.error('No response received from the server.');
        } else {
            toast.error('Something went wrong');
        }
    };
    

    const handleAlreadyIntegrated = () => {
        toast.info("Already Integrated");
    };

    return (
        <>
            <ToastContainer />
            {loading && (
                <div className="loader-overlay">
                    <img src={loader} alt="Loading..." className="loader-img" />
                </div>
            )}
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container fluid>
                    <Navbar.Brand href="#">Trading Platform </Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100%' }}
                        >
                            <Nav.Link href="#home">Home</Nav.Link>
                            <Nav.Link href="#portfolio">Portfolio</Nav.Link>
                            <Nav.Link href="#orders">Orders</Nav.Link>
                            <NavDropdown title="More" id="navbarScrollingDropdown">
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
                        <Button variant="outline-danger" className="my-0 logout-btn" onClick={logout}>Logout</Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>


            {/* Kotak OTP Modal */}
            <KotakOtpModal show={showKotakModal} setIsKotakIntegrated={setIsKotakIntegrated} onHide={() => setShowKotakModal(false)} />

            {/* Finvasia Success Modal */}
            <Finvasia show={showFinvasiaModal} onHide={() => setShowFinvasiaModal(false)} />
        </>
    );
}
