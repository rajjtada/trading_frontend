import React, { useState, useEffect } from 'react';
import './OptionChain.css'; 

const OptionChain = () => {
  const [data, setData] = useState([
    { callOi: 2.5, callLtp: 1518.00, strikePrice: 23900, putLtp: 1518.00, putOi: 7.5, putOiChg: 11},
    { callOi: 1.3, callLtp: 1478.75, strikePrice: 23950, putLtp: 1478.75, putOi: 2.7, putOiChg: 3.1},
    { callOi: 3.3, callLtp: 1416.75, strikePrice: 24000, putLtp: 1416.75, putOi: 51.8, putOiChg: 18},
    { callOi: 2.1, callLtp: 1380.00, strikePrice: 24050, putLtp: 1380.00, putOi: 30, putOiChg: -2.5},
    { callOi: 4.3, callLtp: 1320.00, strikePrice: 24100, putLtp: 1320.00, putOi: 27.7, putOiChg: 68},
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData =>
        prevData.map(row => ({
          ...row,
          callLtp: +(row.callLtp * (1 + (Math.random() - 0.5) * 0.01)).toFixed(2),
          putLtp: +(row.putLtp * (1 + (Math.random() - 0.5) * 0.01)).toFixed(2),
          callOi: Math.floor(row.callOi * (1 + (Math.random() - 0.5) * 0.005)),
          putOi: Math.floor(row.putOi * (1 + (Math.random() - 0.5) * 0.005)),
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="option-chain-container">
      <h2 className="title">NIFTY Bank Option Chain</h2>
      <div className="table-container">
        <table className="option-chain-table">
          <thead>
            <tr>
              <th colSpan="3" className="table-header CallHeader">CALLS</th>
              <th className="table-header strike-price-cell"></th>
              <th colSpan="4" className="table-header PutHeader">PUTS</th>
            </tr>
            <tr>
              <th className="table-header">OI Chg%</th>
              <th className="table-header">OI (lakh)</th>
              <th className="table-header">LTP</th>
              <th className="table-header strike-price-cell">Strike Price</th>
              <th className="table-header">LTP</th>
              <th className="table-header">OI (lakh)</th>
              <th className="table-header">OI Chg%</th>

            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td className="table-cell call-cell">{row.putOiChg}%</td>
                <td className="table-cell call-cell">{row.callOi}</td>
                <td className="table-cell call-cell">{row.callLtp}</td>
                <td className="strike-price-cell">{row.strikePrice.toFixed(2)}</td>
                <td className="table-cell put-cell">{row.putLtp}</td>
                <td className="table-cell put-cell">{row.putOi}</td>
                <td className="table-cell put-cell">{row.putOiChg}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OptionChain;
