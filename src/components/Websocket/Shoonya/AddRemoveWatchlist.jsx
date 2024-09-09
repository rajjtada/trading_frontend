import React, { useState, useEffect } from 'react';
import { Button, Form, ListGroup, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import debounce from 'lodash.debounce'; 
import "./AddRemoveWatchlist.css"

const StockWatchlist = () => {
    const [stocks, setStocks] = useState(['google', 'apple', 'tesla']);
    const [search, setSearch] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearchChange = debounce((value) => {
        setSearch(value);
        if (value.trim().length > 0) {
            fetchSuggestions(value);
        } else {
            setSuggestions([]);
        }
    }, 300); 

    const fetchSuggestions = async (query) => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/search-stocks?query=${query}`);
            setSuggestions(res.data);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        } finally {
            setLoading(false);
        }
    };

    const addStock = (stock) => {
        setStocks([...stocks, stock]);
        setSuggestions([]);
    };

    const removeStock = (stockToRemove) => {
        setStocks(stocks.filter((stock) => stock !== stockToRemove));
    };

    return (
        <div className="watchlist-container">
            <h2>Stock Watchlist</h2>
            <InputGroup className="mb-3 search-bar">
                <Form.Control
                    type="text"
                    placeholder="Search and add a stock..."
                    onChange={(e) => handleSearchChange(e.target.value)}
                />
                <Button className="addbtn" variant="primary" disabled={!search}>
                    +
                </Button>
            </InputGroup>

            {/* Stock Suggestions */}
            {loading && <p>Loading...</p>}
            {suggestions.length > 0 && (
                <ListGroup className="suggestions-list">
                    {suggestions.map((stock, index) => (
                        <ListGroup.Item
                            key={index}
                            onClick={() => addStock(stock.name)}
                        >
                            {stock.name} - {stock.price}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}

            {/* Watchlisted Stocks */}
            <ListGroup className="watchlist">
                {stocks.map((stock, index) => (
                    <ListGroup.Item key={index} className="watchlist-item">
                        <span>{stock}</span>
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => removeStock(stock)}
                            className="removebtn"
                        >
                            X
                        </Button>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export default StockWatchlist;
