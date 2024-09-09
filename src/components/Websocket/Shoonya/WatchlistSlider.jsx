import React from 'react';
import Slider from 'react-slick';
import "./WatchlistSlider.css";

const StockSlider = () => {
    
    const stockData = [
        { name: 'AAPL', price: '$150' },
        { name: 'GOOGL', price: '$2800' },
        { name: 'TSLA', price: '$700' },
        { name: 'AMZN', price: '$3300' },
        { name: 'MSFT', price: '$295' },
        { name: 'AAPL', price: '$150' },
        { name: 'GOOGL', price: '$2800' },
        { name: 'TSLA', price: '$700' },
        { name: 'AMZN', price: '$3300' },
        { name: 'MSFT', price: '$295' }
    ];
    
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4, 
        slidesToScroll: 1, 
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
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            }
        ]
    };


    return (
        <div className="stock-slider">
            <Slider {...settings}>
                {stockData.map((stock, index) => (
                    <div key={index} className="stock-box">
                        <div className="stock-name">{stock.name}</div>
                        <div className="stock-price">{stock.price}</div>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default StockSlider;
