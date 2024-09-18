import React, { useState, useEffect } from 'react';
import { Button, Form, ListGroup, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './AddRemoveWatchlist.css';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HSWebSocket from '../hslib'; // Ensure HSWebSocket is imported correctly
import apiBaseUrl from '../../../constants/globaldata';

const debouncedFetchSuggestions = debounce(async (query, setLoading, setSuggestions) => {
  setLoading(true);
  try {
    const res = await axios.get(`${apiBaseUrl}token/utils/search/?query=${query}`, {
      headers: {
        Authorization: Cookies.get("access_token"),
        'bypass-tunnel-reminder': "true"
      }
    });
    setSuggestions(res.data);
  } catch (error) {
    console.error('Error fetching suggestions:', error);
  } finally {
    setLoading(false);
  }
}, 300);

const StockWatchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [newStock, setNewStock] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedWatchlistId, setSelectedWatchlistId] = useState(null);
  const [watchlists, setWatchlists] = useState([]);
  const [ltpData, setLtpData] = useState({}); // Store LTP data from WebSocket

  const exchangeStyles = {
    NSE: { backgroundColor: '#ffedee', color: 'red' },
    BSE: { backgroundColor: '#eef4ff', color: '#6880b0' },
    default: { backgroundColor: '#f0eced', color: '#77787a' }
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
        setWatchlists(fetchedWatchlists);

        // Automatically select the first watchlist and load its data
        if (fetchedWatchlists.length > 0) {
          const firstWatchlist = fetchedWatchlists[0];
          setSelectedWatchlistId(firstWatchlist.id);
          loadWatchlist(firstWatchlist.id);
        } else {
          setWatchlist([]); // Set watchlist to empty array if no watchlists are available
        }
      } catch (error) {
        console.error('Error loading watchlists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialWatchlists();
  }, []);

  const loadWatchlist = async (watchlistId) => {
    setWatchlist([]);
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
      setWatchlist(fetchedWatchlist);

      // Subscribe to WebSocket for live LTP
      if (fetchedWatchlist.length > 0) {
        const scrips = fetchedWatchlist
          .map(stock => stock.exchange === "NSE"
            ? `nse_cm|${stock.token}`
            : stock.exchange === "BSE"
              ? `bse_cm|${stock.token}`
              : null)
          .filter(Boolean)
          .join('&');
        subscribeToWebSocket(scrips);
      }
    } catch (error) {
      console.error('Error loading watchlist:', error);
      setWatchlist([]);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToWebSocket = (scrips) => {
    let handshakeServerId = 'server7';
    let token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJUcmFkZSJdLCJleHAiOjE3MjY2ODQyMDAsImp0aSI6Ijg2YWRiNzk3LWY2YWItNDBiNS05YWQ4LTQ4ZjE3NGQ2OWYxOSIsImlhdCI6MTcyNjY0MjI1OSwiaXNzIjoibG9naW4tc2VydmljZSIsInN1YiI6ImM0MDRhMWZjLTMzZjMtNDBmNC04YzM1LWNhMDk5ZTRjNTY2OCIsInVjYyI6IllUV0pPIiwibmFwIjoiIiwieWNlIjoiZVlcXDYgXCI5NT13XHUwMDA2XGZcdTAwMDN9XHUwMDAwXHUwMDEwYiIsImZldGNoY2FjaGluZ3J1bGUiOjAsImNhdGVnb3Jpc2F0aW9uIjoiIn0.giYlgCsCVguJLTle5fDck7N87u_1YdwilZbtCdCDUMj0z2ByeWJLymjWlU7MiiCjyFaYHc7yEsMxxDQtp23Zbg1CgrkjdY5KpPq1tTbYYHKO6fF1jLatDg2Vj4-qj1SzzrJFEnenzxTjiDcyy7l_EkZM3gpnVxaOAURGTtg3dOZyz60oRz71kNGvq2ZImmiVWLma3Qc9gyLatHwmnVZpG59RZcYTg86nIt07XjtaS3ydBqS0mqt-Dubs1pMaiBq8AUr6yjA-T-2mik0US7c3HDKKYakYEWbN6e0N2qWrSafx80Wl4LXX8wmccfRnTCPhEWxI-b6kJ7MyJxVWxx856g";
    let sid = "314a26d2-19fb-465d-8c79-be2b511ac35d";

    let url = "wss://mlhsm.kotaksecurities.com";
    let userWS = new HSWebSocket(url);

    userWS.onopen = () => {
      console.log('[Socket]: Connected');
      const connectionObj = {
        "Authorization": token,
        "Sid": sid,
        "type": "cn"
      };

      if (userWS.readyState === WebSocket.OPEN) {
        userWS.send(JSON.stringify(connectionObj));

        const subscribeObj = { "type": 'mws', "scrips": scrips, "channelnum": "1" };
        console.log(scrips);
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

  const handleSearchChange = (value) => {
    setNewStock(value);
    if (value.trim().length > 0) {
      debouncedFetchSuggestions(value, setLoading, setSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const addStock = (stock) => {
    setNewStock('');
    setSuggestions([]);

    const data = {
      user_id: Cookies.get("user_id"),
      token: stock.token,
      watchlist_id: selectedWatchlistId.toString(),
    };

    axios.post(`${apiBaseUrl}token/watchlist/process/`, data, {
      headers: {
        Authorization: Cookies.get("access_token"),
        'bypass-tunnel-reminder': "true"
      }
    }).then((res) => {
      if (res.status === 200) {
        toast.success("Added to Watchlist");
        loadWatchlist(selectedWatchlistId)
      }
    }).catch((error) => {
      console.error('Error adding stock:', error);
      toast.error('Failed to add stock.');
    });
  };

  const removeStock = (symbol) => {
    const data = {
      user_id: Cookies.get("user_id"),
      token: symbol,
      watchlist_id: selectedWatchlistId.toString(),
    };

    axios.request({
      url: `${apiBaseUrl}token/watchlist/process/`,
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${Cookies.get("access_token")}`,
        'bypass-tunnel-reminder': "true"
      },
      data: data
    }).then((res) => {
      if (res.status === 200) {
        loadWatchlist(selectedWatchlistId)
        toast.success("Removed from Watchlist");
      }
    }).catch((error) => {
      console.error('Error removing stock:', error);
      toast.error('Failed to remove stock.');
    });
  };

  useEffect(() => {
    console.log(ltpData);
  }, [ltpData]);


  return (
    <div className="watchlist-sidebar">
      <ToastContainer />
      <h2 className="watchlist-title">Stock Watchlist</h2>

      {/* Dynamic Watchlist Selector */}
      <div className="watchlist-button-container">
        {watchlists.map((watchlist) => (
          <Button
            key={watchlist.id}
            variant={selectedWatchlistId === watchlist.id ? 'primary' : 'secondary'}
            onClick={() => {
              setSelectedWatchlistId(watchlist.id);
              loadWatchlist(watchlist.id); // Load the selected watchlist
            }}
            className="watchlist-button"
          >
            {watchlist.name || `Watchlist ${watchlist.id}`}
          </Button>
        ))}
      </div>

      {/* Search Input with Suggestions */}
      <InputGroup className="stock-add mb-3">
        <Form.Control
          type="text"
          placeholder="Search and add a stock..."
          value={newStock}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="stock-input"
        />
      </InputGroup>

      {/* Loading spinner or suggestions */}
      {loading && <p>Loading...</p>}
      {suggestions.length > 0 && (
        <ListGroup className="suggestions-list">
          {suggestions.map((stock, index) => (
            <ListGroup.Item
              key={index}
              onClick={() => addStock(stock)}
              className="suggestion-item"
            >
              <span className="stockSuggestionSymbol">{stock.symbol}</span>
              <span
                style={exchangeStyles[stock.exchange] || exchangeStyles.default}
                className="stockExchange"
              >
                {stock.exchange}
              </span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      {/* Watchlist Stocks with Real-Time LTP */}
      {watchlist.length > 0 ? (
        <ListGroup className="stock-list">
        {watchlist.map((stock, index) => (
          <ListGroup.Item key={index} className="stock-item">
            <div className="stock-header">
              <span className="stock-symbol">{stock.symbol}</span>
              <span className="stock-price">
                {ltpData[stock.token] ? ltpData[stock.token] : 'Fetching...'}
              </span>
            </div>
            <div className="stock-header">
            <p className="stock-name">{stock.name}</p>
            <Button
              variant="link"
              className="remove-btn"
              onClick={() => removeStock(stock.token)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>      
      ) : (
          <p>No stocks in watchlist.</p>
        )}
    </div>
  );
};

export default StockWatchlist;
