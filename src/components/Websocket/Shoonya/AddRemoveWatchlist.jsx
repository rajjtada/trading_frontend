import React, { useState, useEffect, useCallback } from 'react';
import { Button, Form, ListGroup, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './AddRemoveWatchlist.css';
import Cookies from 'js-cookie';
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
  const [watchlist, setWatchlist] = useState([
    { symbol: 'AAPL', price: 150.50 },
    { symbol: 'TSLA', price: 700.00 },
    { symbol: 'AAPL', price: 150.50 },
    { symbol: 'AAPL', price: 150.50 },
    { symbol: 'AAPL', price: 150.50 },
    { symbol: 'TSLA', price: 700.00 },
    { symbol: 'TSLA', price: 700.00 },
    { symbol: 'TSLA', price: 700.00 },
  ]);
  const [newStock, setNewStock] = useState('');
  const [suggestions, setSuggestions] = useState([
    { symbol: 'AAPL', price: 150.50, exchange: 'NSE' },
    { symbol: 'TSLA', price: 700.00, exchange: 'BSE' },
    { symbol: 'AAPL', price: 150.50, exchange: 'NSE' },
    { symbol: 'TSLA', price: 700.00, exchange: 'FNO' },
    { symbol: 'TSLA', price: 700.00, exchange: 'BSE' },
    { symbol: 'AAPL', price: 150.50, exchange: 'NSE' },
    { symbol: 'TSLA', price: 700.00, exchange: 'FNO' },
    { symbol: 'AAPL', price: 150.50, exchange: 'NSE' },
    { symbol: 'TSLA', price: 700.00, exchange: 'FNO' },
    { symbol: 'TSLA', price: 700.00, exchange: 'BSE' },
    { symbol: 'TSLA', price: 700.00, exchange: 'BSE' },
  ]);
  const [showWatchlist, setShowWatchlist] = useState(true);
  const [loading, setLoading] = useState(false);

  const exchangeStyles = {
    NSE: { backgroundColor: '#ffedee', color: 'red' },
    BSE: { backgroundColor: '#eef4ff', color: '#6880b0' },
    default: { backgroundColor: '#f0eced', color: '#77787a' }
  };

  // Handle search input change and debounce the search
  const handleSearchChange = (value) => {
    setNewStock(value);
    if (value.trim().length > 0) {
      debouncedFetchSuggestions(value, setLoading, setSuggestions);
      setShowWatchlist(false); // Hide watchlist when searching
    } else {
      setSuggestions([]);
      setShowWatchlist(true); // Show watchlist if input is cleared
    }
  };

  // Add stock to the watchlist
  const addStock = (stock) => {
    setWatchlist([...watchlist, { symbol: stock.symbol.toUpperCase(), price: stock.price || 0 }]);
    setNewStock('');
    setSuggestions([]);
    setShowWatchlist(true); // Show watchlist after adding a stock
  };

  // Remove stock from the watchlist
  const removeStock = (symbol) => {
    setWatchlist(watchlist.filter((stock) => stock.symbol !== symbol));
  };

  return (
    <div className="watchlist-sidebar">
      <h2 className="watchlist-title">Stock Watchlist</h2>

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
      {!showWatchlist && suggestions.length > 0 && (
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
      {showWatchlist && (
        <ListGroup className="stocks-list">
          {watchlist.map((stock) => (
            <div className="stock-item" key={stock.symbol}>
              <div className="stock-info">
                <span className="stock-symbol">{stock.symbol}</span>
                <span className="stock-price">₹{stock.price.toFixed(2)}</span>
              </div>
              <button className="remove-btn" onClick={() => removeStock(stock.symbol)}>
              <FontAwesomeIcon icon={faTrash} className="trash-icon" />
              </button>
            </div>
          ))}
        </ListGroup>
      )}
    </div>
  );
};

export default StockWatchlist;
