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

  const exchangeStyles = {
    NSE: { backgroundColor: '#ffedee', color: 'red' },
    BSE: { backgroundColor: '#eef4ff', color: '#6880b0' },
    default: { backgroundColor: '#f0eced', color: '#77787a' }
  };

  // Fetch watchlists and load the first one on component mount
  useEffect(() => {
    console.log(Cookies.get("kotak_access_token"));
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
    } catch (error) {
      console.error('Error loading watchlist:', error);
      setWatchlist([]); 
    } finally {
      setLoading(false);
    }
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

    const Data = {
      user_id: Cookies.get("user_id"),
      token: stock.token,
      watchlist_id: selectedWatchlistId.toString(),
    };

    axios.post(`${apiBaseUrl}token/watchlist/process/`, Data, {
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

      {/* Watchlist Stocks */}
      <ListGroup className="stocks-list">
        {watchlist.length > 0 ? (
          watchlist.map((stock) => (
            <div className="stock-item" key={stock.symbol}>
              <div className="stock-info">
                <span className="stock-symbol">{stock.symbol}</span>
                <span className="stock-name">{stock.name}</span>
              </div>
              <button className="remove-btn" onClick={() => removeStock(stock.token)}>
                <FontAwesomeIcon icon={faTrash} className="trash-icon" />
              </button>
            </div>
          ))
        ) : (
            loading ? (
              <></>
            ) : (
                <p>No stocks in this watchlist.</p>
              )
          )}
      </ListGroup>

    </div>
  );
};

export default StockWatchlist;
