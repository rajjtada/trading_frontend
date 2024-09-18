/* eslint-disable */
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import HSWebSocket from '../hslib';

const WebSocketComponent = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState({}); 

  useEffect(() => {
    let handshakeServerId = 'server7';
    let token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...";
    let sid = "314a26d2-19fb-465d-8c79-be2b511ac35d";

    let url = "wss://mlhsm.kotaksecurities.com";
    let userWS = new HSWebSocket(url);

    userWS.onopen = function () {
      console.log('[Socket]: Connected to "' + url + '"\n');
      setIsConnected(true);

      let jObj = {
        "Authorization": token,
        "Sid": sid,
        "type": "cn"
      };

      if (userWS.readyState === WebSocket.OPEN) {
        userWS.send(JSON.stringify(jObj));

        jObj = { "type": 'mws', "scrips": "nse_cm|11536&nse_cm|1594&nse_cm|3456", "channelnum": "1" };
        userWS.send(JSON.stringify(jObj));
      } else {
        console.error('WebSocket is not open yet');
      }
    };

    userWS.onclose = function () {
      console.log("[Socket]: Disconnected!\n");
      setIsConnected(false);
    };

    userWS.onerror = function () {
      console.log("[Socket]: Error!\n");
      setIsConnected(false);
    };

    userWS.onmessage = function (msg) {
      const result = JSON.parse(msg);
      console.log('[Res]: ' + msg + "\n");

      // Update the state with the new data (overwrites existing value if key exists)
      setMessages(prev => ({
        ...prev, 
        [result.scrip_code]: result // Use some unique identifier from the message (e.g., scrip_code)
      }));
    };

    return () => {
      if (userWS) {
        userWS.close();
      }
    };
  }, []); // Runs once on component mount

  return (
    <div>
      <h2>WebSocket Status: {isConnected ? 'Connected' : 'Disconnected'}</h2>
      <div>
        <h3>Messages:</h3>
        <ul>
          {Object.keys(messages).map((key, index) => (
            <li key={index}>
              {key}: {JSON.stringify(messages[key])}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WebSocketComponent;
