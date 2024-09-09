import React, { useState, useEffect } from 'react';
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./navigation.css";
import { useNavigate,Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiBaseUrl from "../../constants/globaldata";
import loader from "../../assets/images/loader.gif";
import sync_img from "../../assets/images/sync_img.png";
import SyncLoader from "../../assets/images/SyncLoader.gif";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import KotakOtpModal from '../Integration/kotak/kotak_otp';
import Finvasia from '../Integration/finvasia/finvasia_modal';
import Cookies from "js-cookie";

export default function Navigation({ setIsShoonyaConnected }) {
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const [SyncLoading, setSyncLoading] = useState(false);
    const [isKotakIntegrated, setIsKotakIntegrated] = useState(false);
    const [isFinvasiaIntegrated, setIsFinvasiaIntegrated] = useState(false);
    const [showKotakModal, setShowKotakModal] = useState(false);
    const [showSync, setShowSync] = useState(false);
    const [showFinvasiaModal, setShowFinvasiaModal] = useState(false);
    const [isSync, setIsSync] = useState(false);
    const [lastSync, setLastSync] = useState("");

    useEffect(() => {

        if (Cookies.get('kotak_access_token')) {
            setIsKotakIntegrated(true);
            handleSync();
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

    const handleAlreadyIntegrated = () => {
        toast.info("Already Integrated");
    };

    const handleAlreadySync = () => {
        toast.info("Already Synced");
    }

    const handleSync = () => {
        setSyncLoading(true);

        const Data = {
            // Authorization: JSON.stringify(Cookies.get("kotak_access_token")).Authorization
            Authorization: "eyJ4NXQiOiJNbUprWWpVMlpETmpNelpqTURBM05UZ3pObUUxTm1NNU1qTXpNR1kyWm1OaFpHUTFNakE1TmciLCJraWQiOiJaalJqTUdRek9URmhPV1EwTm1WallXWTNZemRtWkdOa1pUUmpaVEUxTlRnMFkyWTBZVEUyTlRCaVlURTRNak5tWkRVeE5qZ3pPVGM0TWpGbFkyWXpOUV9SUzI1NiIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJjbGllbnQxMjU2IiwiYXV0IjoiQVBQTElDQVRJT05fVVNFUiIsImF1ZCI6ImYxWDdPZkhGMnpMak10U1RUN0MxUG5MV0RkMGEiLCJuYmYiOjE3MjU3NzYyMzcsImF6cCI6ImYxWDdPZkhGMnpMak10U1RUN0MxUG5MV0RkMGEiLCJzY29wZSI6ImRlZmF1bHQiLCJpc3MiOiJodHRwczpcL1wvbmFwaS5rb3Rha3NlY3VyaXRpZXMuY29tOjQ0M1wvb2F1dGgyXC90b2tlbiIsImV4cCI6OTIyMzM3MjAzNjg1NDc3NSwiaWF0IjoxNzI1Nzc2MjM3LCJqdGkiOiJiMGI5ZTM4My1lM2Y0LTQxYTMtOGI1NC03NTE1NDQ0YmQ4NWQifQ.AILduTpZcC89AMXfMDDFy9-TCNxK3BYari3Xs4dtt1JZDBucMVjWnUZSrzLT2ckp5Di5Q_EkQG-hAtK8yp9a2CKJyULcGT8jnyj8fMRSrZYXC77PMlOPhHHiBRQ1DVPeW-N0KTNsN5QRmGplKsPtEgvTSc-E_jx63FwzxIJyMApl03opUMtl0u2s-KPp8b1rVnEyNeQpkfH5L5XHavo_XvfwwDm5toScRvSaM1lfnLWXW4zkqzs2g0_p5nypzAbIwA6nzQFT2cjsFTM4OkE28hJZ9Hv1-Zrs3eM_me0abT9k4K34FRwIxvsvx2Ckgp4mT3gQrpUSn0y0FY-K0bNu1w"
        };

        axios
            .post(`${apiBaseUrl}integrations/kotak/utils/sync/`, Data, {
                headers: {
                    Authorization: Cookies.get("access_token"),
                    'bypass-tunnel-reminder': "true"
                }
            })
            .then((res) => {
                setSyncLoading(false);
                if (res.status === 200) {
                    toast.success("Data Synced.");
                    setIsSync(true);
                    setLastSync(getTimeDifference(Date.now(), res.data.last_sync * 1000));
                }
                else if (res.status === 208) {
                    setIsSync(true);
                    setLastSync(getTimeDifference(Date.now(), res.data.last_sync * 1000));
                }
            })
            .catch((error) => {
                setSyncLoading(false);
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

    function getTimeDifference(timestamp1, timestamp2) {
        const diffInMilliseconds = Math.abs(new Date(timestamp2) - new Date(timestamp1));

        const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInSeconds < 60) {
            return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
        } else if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
        } else {
            return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
        }
    }


    return (
        <>
            <ToastContainer />
            {loading && (
                <div className="loader-overlay">
                    <img src={loader} alt="Loading..." className="loader-img" />
                </div>
            )}
            <Navbar expand="md" className="bg-body-tertiary">
                <Container fluid>
                    <Navbar.Brand className="title" href="/dashboard">Trading Platform </Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100%' }}
                        >
                            <Nav.Link as={Link} to="/watchlist">Watchlist</Nav.Link>
                            {/* <Nav.Link href="#portfolio">Portfolio</Nav.Link>
                            <Nav.Link href="#orders">Orders</Nav.Link>
                            <NavDropdown title="More" id="navbarScrollingDropdown">
                                <NavDropdown.Item href="#action/3.1">Option1</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">Option2</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Option3</NavDropdown.Item>
                            </NavDropdown> */}
                            <Nav.Link onClick={isKotakIntegrated ? handleAlreadyIntegrated : handleKotakIntegration} className={isKotakIntegrated ? "kotak_btn_integrated" : "kotak_btn"}>
                                Kotak {isKotakIntegrated ? <FontAwesomeIcon icon={faCheckCircle} className="check-icon" /> : <FontAwesomeIcon icon={faTimesCircle} className="cross-icon" />}
                            </Nav.Link>
                            <Nav.Link onClick={isFinvasiaIntegrated ? handleAlreadyIntegrated : handleFinvasiaIntegration} className={isFinvasiaIntegrated ? "finvasia_btn_integrated" : "finvasia_btn"}>
                                Finvasia {isFinvasiaIntegrated ? <FontAwesomeIcon icon={faCheckCircle} className="check-icon" /> : <FontAwesomeIcon icon={faTimesCircle} className="cross-icon" />}
                            </Nav.Link>
                            {showSync ? (
                                <Button
                                    onClick={isSync ? handleAlreadySync : handleSync}
                                    className="sync_btn"
                                    disabled={SyncLoading}
                                >
                                    {SyncLoading ? (
                                        <>
                                            <img src={SyncLoader} alt="Loading..." className="loading-spinner" />
                                            <span>  Syncing</span>
                                        </>
                                    ) : (
                                            <>
                                                <img src={sync_img} alt="Loading..." className="sync-spinner" />
                                                <span>{isSync ? "Synced " : "Sync "}{lastSync}</span></>
                                        )}
                                </Button>
                            ) : null}
                        </Nav>
                        <Button variant="outline-danger" className="my-0 logout-btn" onClick={logout}>Logout</Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <KotakOtpModal show={showKotakModal} setIsKotakIntegrated={setIsKotakIntegrated} setShowSync={setShowSync} handleSync={handleSync} onHide={() => setShowKotakModal(false)} />

            <Finvasia show={showFinvasiaModal} onHide={() => setShowFinvasiaModal(false)} />
        </>
    );
}
