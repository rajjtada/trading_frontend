import React, { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import './StockWatchlist.css';  
import Cookies from "js-cookie";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import {shoonyaWebSocket} from "../../../constants/globaldata";

const StockWatchlist = () => {

    const [watchlist, setWatchlist] = useState([]);
    const [stockData, setStockData] = useState({});
    const [newStock, setNewStock] = useState('');
    const [isReconnecting, setIsReconnecting] = useState(false);

    const { sendMessage, lastJsonMessage, readyState } = useWebSocket(shoonyaWebSocket, {
        onOpen: () => {
            console.log('WebSocket connection opened');
            setIsReconnecting(false);  
        },
        onClose: (event) => {
            console.log('WebSocket connection closed', event);

            if(event.code===1008){
                console.error(`Unauthorized Request`);
            }
            else if (event.code !== 1000) { 
                console.error(`WebSocket closed unexpectedly with code: ${event.code}`);
                handleReconnect();
            }

        },
        onError: (error) => {
            console.error('WebSocket encountered an error:', error);
            handleReconnect();  
        },
        // shouldReconnect: () => true, 
    });
    
    const shoonya_api_access = JSON.parse(Cookies.get('finvasia_access_token')).shoonya_api_access;

    const connectionMessage = JSON.stringify({
        t: 'c',
        uid: 'FA237545',
        actid: 'FA237545',
        source: 'API',
        susertoken: shoonya_api_access,
    });

    useEffect(() => {
        if (readyState === 1) {  
            sendMessage(connectionMessage);
        }
    }, [sendMessage, connectionMessage, readyState]);

    const handleReconnect = () => {
        console.log('Attempting to reconnect...');
        setIsReconnecting(true);

        setTimeout(() => {
            sendMessage(connectionMessage);  
        }, 5000);  
    };

    const handleAddStock = () => {
        if (newStock && !watchlist.includes(newStock)) {
            setWatchlist((prev) => [...prev, newStock]);

            const subscribeMessage = JSON.stringify({
                t: 't',
                k: `NSE|${newStock}`, 
            });

            sendMessage(subscribeMessage);
        }
        setNewStock(''); 
    };

    const handleRemoveStock = (stock) => {
        setWatchlist((prev) => prev.filter(item => item !== stock));

        const unsubscribeMessage = JSON.stringify({
            t: 'u',  
            k: `NSE|${stock}`,  
        });

        sendMessage(unsubscribeMessage);

        setStockData((prev) => {
            const newData = { ...prev };
            delete newData[stock];
            return newData;
        });
    };

    useEffect(() => {
        if (lastJsonMessage) {
            const { tk, ts, lp, o, h, l, c } = lastJsonMessage;
            setStockData((prev) => ({
                ...prev,
                [tk]: {
                    name: ts,
                    latestPrice: lp,
                    open: o,
                    high: h,
                    low: l,
                    close: c,
                },
            }));
        }
    }, [lastJsonMessage]);

    const handleInputChange = (e) => {
        setNewStock(e.target.value);
    };

    return (
        <div className="stock-watchlist-container">
            <h2 className="title">My Stock Watchlist</h2>

            <div className="input-section">
                <input
                    type="text"
                    className="stock-input"
                    value={newStock}
                    onChange={handleInputChange}
                    placeholder="Enter stock token (e.g., 22)"
                />
                <button className="add-button" onClick={handleAddStock}>Add Stock</button>
            </div>

            {isReconnecting && <p className="reconnecting-message">Reconnecting...</p>}

            <div className="watchlist-section">
                <h3 className="subtitle">Current Watchlist</h3>
                <ul className="watchlist">
                    {watchlist.map((stock) => (
                        <li className="watchlist-item" key={stock}>
                            <div className="stock-info">
                                <h4>{stockData[stock]?.name || stock}</h4>
                                {stockData[stock] ? (
                                    <div>
                                        <p className="price">₹{stockData[stock].latestPrice}</p>
                                        {/* <p>Open: ₹{stockData[stock].open}</p>
                                        <p>High: ₹{stockData[stock].high}</p>
                                        <p>Low: ₹{stockData[stock].low}</p>
                                        <p>Close: ₹{stockData[stock].close}</p> */}
                                    </div>
                                ) : (
                                    <p className="loading">Loading...</p>
                                )}
                            </div>
                            <button className="remove-btn" onClick={() => handleRemoveStock(stock)}>
                                <FontAwesomeIcon icon={faTimesCircle} className="check-icon" />
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default StockWatchlist;
