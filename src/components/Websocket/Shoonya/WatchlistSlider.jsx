import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import Cookies from 'js-cookie';
import "./WatchlistSlider.css";
import HSWebSocket from '../hslib'; // Ensure HSWebSocket is imported correctly
import apiBaseUrl from '../../../constants/globaldata';

// Initialize WebSocket URL and credentials (replace these with actual values)
const WEBSOCKET_URL = "wss://mlhsm.kotaksecurities.com";
const TOKEN = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJUcmFkZSJdLCJleHAiOjE3MjY2ODQyMDAsImp0aSI6Ijg2YWRiNzk3LWY2YWItNDBiNS05YWQ4LTQ4ZjE3NGQ2OWYxOSIsImlhdCI6MTcyNjY0MjI1OSwiaXNzIjoibG9naW4tc2VydmljZSIsInN1YiI6ImM0MDRhMWZjLTMzZjMtNDBmNC04YzM1LWNhMDk5ZTRjNTY2OCIsInVjYyI6IllUV0pPIiwibmFwIjoiIiwieWNlIjoiZVlcXDYgXCI5NT13XHUwMDA2XGZcdTAwMDN9XHUwMDAwXHUwMDEwYiIsImZldGNoY2FjaGluZ3J1bGUiOjAsImNhdGVnb3Jpc2F0aW9uIjoiIn0.giYlgCsCVguJLTle5fDck7N87u_1YdwilZbtCdCDUMj0z2ByeWJLymjWlU7MiiCjyFaYHc7yEsMxxDQtp23Zbg1CgrkjdY5KpPq1tTbYYHKO6fF1jLatDg2Vj4-qj1SzzrJFEnenzxTjiDcyy7l_EkZM3gpnVxaOAURGTtg3dOZyz60oRz71kNGvq2ZImmiVWLma3Qc9gyLatHwmnVZpG59RZcYTg86nIt07XjtaS3ydBqS0mqt-Dubs1pMaiBq8AUr6yjA-T-2mik0US7c3HDKKYakYEWbN6e0N2qWrSafx80Wl4LXX8wmccfRnTCPhEWxI-b6kJ7MyJxVWxx856g"; // Your actual token here
const SID = "314a26d2-19fb-465d-8c79-be2b511ac35d";

const StockSlider = () => {
    const [stockData, setStockData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [watchlist, setWatchlist] = useState([]);
    const [ltpData, setLtpData] = useState({});

    const settings = {
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 2,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    useEffect(() => {
        const fetchInitialWatchlists = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${apiBaseUrl}token/watchlist/?user_id=${Cookies.get("user_id")}`, {
                    headers: {
                        Authorization: Cookies.get("access_token"),
                        'bypass-tunnel-reminder': "true",
                    }
                });
                const fetchedWatchlists = Array.isArray(res.data) ? res.data : [];
                setWatchlist(fetchedWatchlists);

                if (fetchedWatchlists.length > 0) {
                    const firstWatchlist = fetchedWatchlists[0];
                    loadWatchlist(firstWatchlist.id);
                } else {
                    setStockData([]);
                }
            } catch (error) {
                console.error('Error loading watchlists:', error);
            } finally {
                setLoading(false);
            }
        };

        const loadWatchlist = async (watchlistId) => {
            setLoading(true);
            try {
                const res = await axios.post(`${apiBaseUrl}token/watchlist/gettokens/`, {
                    user_id: Cookies.get("user_id"),
                    watchlist_id: watchlistId.toString(),
                }, {
                    headers: {
                        Authorization: Cookies.get("access_token"),
                        'bypass-tunnel-reminder': "true",
                    }
                });
                const fetchedWatchlist = Array.isArray(res.data) ? res.data : [];
                setStockData(fetchedWatchlist);
                const scrips = fetchedWatchlist
                    .map(stock => stock.exchange === "NSE"
                        ? `nse_cm|${stock.token}`
                        : stock.exchange === "BSE"
                            ? `bse_cm|${stock.token}`
                            : null)
                    .filter(Boolean)
                    .join('&');
                subscribeToWebSocket(scrips);
            } catch (error) {
                console.error('Error loading watchlist:', error);
                setStockData([]);
            } finally {
                setLoading(false);
            }
        };

        const subscribeToWebSocket = (scrips) => {
            let userWS = new HSWebSocket(WEBSOCKET_URL);

            userWS.onopen = () => {
                console.log('[Socket]: Connected');
                const connectionObj = {
                    "Authorization": TOKEN,
                    "Sid": SID,
                    "type": "cn"
                };

                if (userWS.readyState === WebSocket.OPEN) {
                    userWS.send(JSON.stringify(connectionObj));

                    const subscribeObj = { "type": 'mws', "scrips": scrips, "channelnum": "1" };
                    userWS.send(JSON.stringify(subscribeObj));
                } else {
                    console.error('WebSocket is not open yet');
                }
            };

            userWS.onmessage = (msg) => {
                try {
                    const resultArray = JSON.parse(msg);
                    if (Array.isArray(resultArray)) {
                        resultArray.forEach(result => {
                            if (result.tk && result.ltp) {
                                setLtpData(prev => ({
                                    ...prev,
                                    [result.tk]: result.ltp
                                }));
                                setStockData(prevData => prevData.map(stock =>
                                    stock.token === result.tk
                                        ? {
                                            ...stock,
                                            price: result.ltp,
                                            change: result.cng || '0', // Default to '0' if undefined
                                            percentage: result.nc || '0%' // Default to '0%' if undefined
                                        }
                                        : stock
                                ));
                            }
                        });
                    }
                } catch (error) {
                    console.error("Error parsing WebSocket message:", error);
                }
            };

            userWS.onerror = () => {
                console.error("[Socket]: Error!");
            };

            userWS.onclose = () => {
                console.log("[Socket]: Disconnected!");
                setTimeout(() => subscribeToWebSocket(scrips), 1000);
            };
        };

        fetchInitialWatchlists();
    }, []);

    return (
        <div className="stock-slider">
            <Slider {...settings}>
                {stockData.map((stock, index) => (
                    <div key={index} className="stock-box" style={{ marginRight: "10px" }}>
                        <div className="stock-name">{stock.name}</div>
                        <span className="stock-price">{stock.price}</span>&nbsp;&nbsp;
                        <span className={`stock-change ${stock.change && stock.change.startsWith('-') ? 'negative' : 'positive'}`}>
                            {stock.change || '0'} ({stock.percentage || '0%'})
                        </span>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default StockSlider;
