/* eslint-disable */
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import HSWebSocket from '../hslib';
const WebSocketComponent = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    let handshakeServerId = 'server7'
    let token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6WyJUcmFkZSJdLCJleHAiOjE3MjY2ODQyMDAsImp0aSI6Ijg2YWRiNzk3LWY2YWItNDBiNS05YWQ4LTQ4ZjE3NGQ2OWYxOSIsImlhdCI6MTcyNjY0MjI1OSwiaXNzIjoibG9naW4tc2VydmljZSIsInN1YiI6ImM0MDRhMWZjLTMzZjMtNDBmNC04YzM1LWNhMDk5ZTRjNTY2OCIsInVjYyI6IllUV0pPIiwibmFwIjoiIiwieWNlIjoiZVlcXDYgXCI5NT13XHUwMDA2XGZcdTAwMDN9XHUwMDAwXHUwMDEwYiIsImZldGNoY2FjaGluZ3J1bGUiOjAsImNhdGVnb3Jpc2F0aW9uIjoiIn0.giYlgCsCVguJLTle5fDck7N87u_1YdwilZbtCdCDUMj0z2ByeWJLymjWlU7MiiCjyFaYHc7yEsMxxDQtp23Zbg1CgrkjdY5KpPq1tTbYYHKO6fF1jLatDg2Vj4-qj1SzzrJFEnenzxTjiDcyy7l_EkZM3gpnVxaOAURGTtg3dOZyz60oRz71kNGvq2ZImmiVWLma3Qc9gyLatHwmnVZpG59RZcYTg86nIt07XjtaS3ydBqS0mqt-Dubs1pMaiBq8AUr6yjA-T-2mik0US7c3HDKKYakYEWbN6e0N2qWrSafx80Wl4LXX8wmccfRnTCPhEWxI-b6kJ7MyJxVWxx856g"
    let sid = "314a26d2-19fb-465d-8c79-be2b511ac35d"

    let url = "wss://mlhsm.kotaksecurities.com";
    let userWS = new HSWebSocket(url);
    // console.log(document.getElementById('channel_number').value)


    userWS.onopen = function () {
        console.log('[Socket]: Connected to "' + url + '"\n');
        let jObj = {};
        jObj["Authorization"] = token;
        jObj["Sid"] = sid; 
        jObj["type"] = "cn";
        userWS.send(JSON.stringify(jObj));

        jObj = {"type":'mws', "scrips":"nse_cm|11536&nse_cm|1594&nse_cm|3456", "channelnum":"1"};
        userWS.send(JSON.stringify(jObj));
    }

    userWS.onclose = function () {
        console.log("[Socket]: Disconnected !\n");
    }

    userWS.onerror = function () {
        console.log("[Socket]: Error !\n");
    }

    userWS.onmessage = function (msg) {
        const result= JSON.parse(msg);
        console.log('[Res]: ' + msg + "\n");
    }
   
      
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
