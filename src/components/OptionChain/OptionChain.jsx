import React, { useState, useEffect } from 'react';

const NiftyBankOptionChain = () => {
  const [data, setData] = useState([
    { oi: 22491, callPrice: 567.15, strikePrice: 51400, putPrice: 1.25, putOi: 55949 },
    { oi: 45333, callPrice: 493.40, strikePrice: 51500, putPrice: 1.50, putOi: 133396 },
    { oi: 23629, callPrice: 424.70, strikePrice: 51600, putPrice: 1.82, putOi: 63731 },
    { oi: 49913, callPrice: 361.15, strikePrice: 51700, putPrice: 2.38, putOi: 83977 },
    { oi: 98311, callPrice: 303.60, strikePrice: 51800, putPrice: 3.60, putOi: 61613 },
  ]);

  const updateValue = (index, field, value) => {
    const newData = [...data];
    newData[index][field] = parseFloat(value);
    setData(newData);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prevData =>
        prevData.map(row => ({
          ...row,
          callPrice: +(row.callPrice * (1 + (Math.random() - 0.5) * 0.01)).toFixed(2),
          putPrice: +(row.putPrice * (1 + (Math.random() - 0.5) * 0.01)).toFixed(2),
          oi: Math.floor(row.oi * (1 + (Math.random() - 0.5) * 0.005)),
          putOi: Math.floor(row.putOi * (1 + (Math.random() - 0.5) * 0.005)),
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>NIFTY Bank Option Chain</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={tableHeaderStyle}>OI</th>
            <th style={tableHeaderStyle}>CALL PRICE</th>
            <th style={tableHeaderStyle}>STRIKE PRICE</th>
            <th style={tableHeaderStyle}>PUT PRICE</th>
            <th style={tableHeaderStyle}>OI</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td style={tableCellStyle}>
                <input
                  type="number"
                  value={row.oi}
                  onChange={(e) => updateValue(index, 'oi', e.target.value)}
                  style={inputStyle}
                  readOnly
                />
              </td>
              <td style={tableCellStyle}>
                <input
                  type="number"
                  value={row.callPrice}
                  onChange={(e) => updateValue(index, 'callPrice', e.target.value)}
                  style={inputStyle}
                  readOnly
                />
              </td>
              <td style={tableCellStyle}>{row.strikePrice.toFixed(2)}</td>
              <td style={tableCellStyle}>
                <input
                  type="number"
                  value={row.putPrice}
                  onChange={(e) => updateValue(index, 'putPrice', e.target.value)}
                  style={inputStyle}
                  readOnly
                />
              </td>
              <td style={tableCellStyle}>
                <input
                  type="number"
                  value={row.putOi}
                  onChange={(e) => updateValue(index, 'putOi', e.target.value)}
                  style={inputStyle}
                  readOnly
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const tableHeaderStyle = {
  backgroundColor: '#f3f4f6',
  padding: '0.5rem',
  textAlign: 'left',
  fontWeight: 'bold',
  borderBottom: '1px solid #e5e7eb',
};

const tableCellStyle = {
  padding: '0.5rem',
  borderBottom: '1px solid #e5e7eb',
};

const inputStyle = {
  width: '100%',
  padding: '0.25rem',
  border: '1px solid #d1d5db',
  borderRadius: '0.25rem',
};

export default NiftyBankOptionChain;