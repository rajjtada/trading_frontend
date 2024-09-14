/* eslint-disable */
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
// import "../hslib.js"
// import {HSIWebSocket} from '../hslib.js';
const WebSocketComponent = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // const url = "wss://mlhsi.kotaksecurities.com/realtime?sId=server1";
    // ws = new HSIWebSocket(url)
    // const myScript = document.createElement('script');
    // myScript.src = '../hslib.js';
    // document.body.appendChild(myScript);
        // if (HSIWebSocket) {
        //   console.log('HSIWebSocket is loaded and ready to use.');

        //   // Function to connect to WebSocket
        //   const connectHsi = (token, sid, handshakeServerId) => {
        //     const hsWs = new window.HSIWebSocket(url);

        //     hsWs.onopen = () => {
        //       console.log('[Socket]: Connected to "' + url + '"');
        //       const hsijObj = {
        //         type: "cn",
        //         Authorization: token,
        //         Sid: sid,
        //         source: "WEB"
        //       };
        //       hsWs.send(JSON.stringify(hsijObj));
        //       setIsConnected(true);
        //     };

        //     hsWs.onclose = () => {
        //       console.log("[Socket]: Disconnected !");
        //       setIsConnected(false);
        //     };

        //     hsWs.onerror = () => {
        //       console.log("[Socket]: Error !");
        //       setIsConnected(false);
        //     };

        //     hsWs.onmessage = (msg) => {
        //       console.log('[Res]: ', msg.data);
        //       setMessages((prevMessages) => [...prevMessages, msg.data]);
        //     };

        //     return hsWs;
        //   };

        //   // Get cookies and connect to the WebSocket
        //   const token = JSON.parse(Cookies.get("kotak_access_token")).auth;
        //   const sid = JSON.parse(Cookies.get("kotak_access_token")).sid;
        //   const handshakeServerId = JSON.parse(Cookies.get("kotak_access_token")).sld;

        //   const ws = connectHsi(token, sid, handshakeServerId);

        //   return () => {
        //     ws.close(); // Clean up the WebSocket connection
        //   };
        // } else {
        //   console.error("HSIWebSocket is not available!");
        // }
   
      
  }, []); // Runs once on component mount

  return (
    <div>
      <h2>WebSocket Status: {isConnected ? 'Connected' : 'Disconnected'}</h2>
      <div>
        <h3>Messages:</h3>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WebSocketComponent;
