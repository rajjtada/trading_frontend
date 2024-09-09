import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import WatchlistSlider from '../Websocket/Shoonya/WatchlistSlider';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cookies from "js-cookie";
import { useEffect } from 'react';
import { useState } from 'react';
import Navigation from '../Navigation/navigation';


export default function Dashboard() {

    // const [isShoonyaConnected, setIsShoonyaConnected] = useState(false)


    // useEffect(() => {
    //     if (Cookies.get("finvasia_access_token")) {
    //         setIsShoonyaConnected(true)
    //     }
    // }, [])

    return (
        <>
            <Navigation />
            <WatchlistSlider/>
            {/* {isShoonyaConnected ? <StockWatchlist /> : <></>} */}
        </>
    );
}
