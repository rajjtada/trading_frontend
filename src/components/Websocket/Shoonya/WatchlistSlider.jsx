import React from 'react';
import Slider from 'react-slick';
import "./WatchlistSlider.css";

const StockSlider = () => {

    const stockData = [
        { name: 'NIFTY 50', price: '25,356.50', change: '-32.40', percentage: '-0.13%' },
        { name: 'SENSEX', price: '82,890.94', change: '-71.77', percentage: '-0.09%' },
        { name: 'BANKNIFTY', price: '51,938.05', change: '+165.65', percentage: '+0.32%' },
        { name: 'MSFT', price: '295', change: '+5.30', percentage: '+1.8%' },
        { name: 'BANKNIFTY', price: '51,938.05', change: '+165.65', percentage: '+0.32%' },
        { name: 'SENSEX', price: '82,890.94', change: '-71.77', percentage: '-0.09%' },
        { name: 'BANKNIFTY', price: '51,938.05', change: '+165.65', percentage: '+0.32%' },
        { name: 'SENSEX', price: '82,890.94', change: '-71.77', percentage: '-0.09%' },
        { name: 'BANKNIFTY', price: '51,938.05', change: '+165.65', percentage: '+0.32%' },
        { name: 'MSFT', price: '295', change: '+5.30', percentage: '+1.8%' },
        { name: 'MSFT', price: '295', change: '+5.30', percentage: '+1.8%' }
        ];

    const settings = {
        // dots: true,
        // infinite: true,
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

    return (
        <div className="stock-slider">
            <Slider {...settings}>
                {stockData.map((stock, index) => (
                    <div key={index} className="stock-box" style={{ marginRight: "10px" }}>
                        <div className="stock-name">{stock.name}</div>
                        <span className="stock-price">{stock.price}</span>&nbsp;&nbsp;
                        <span className={`stock-change ${stock.change.startsWith('-') ? 'negative' : 'positive'}`}>
                            {stock.change} ({stock.percentage})
                        </span>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default StockSlider;
