import React, { useState, useEffect } from "react";
//import { GoogleLogin } from "react-google-login";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import jwt_decode from "jwt-decode";
const base64 = require("base-64");


function App() {
  //const [bids, setBids] = useState([0]);
  const [date, setDate] = useState(0);
  const [wss, setWss] = useState(0);

  const [socketId, setSocketId] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState([]);
  const [devices, setDevices] = useState([]);
  const [accessToken, setAccessToken] = useState([]);
  const userID = "gtwmobmaster@gmail.com";
  //const API_KEY='AIzaSyCzaRAJl1ls_7Q32xLsOhXayEoBRykEBeE';
  const API_KEY = "AIzaSyCMI0gPPQ5cgOk4eWthA842gR4vxRBEDZY";

  //const baseUrl = `https://gmail.googleapis.com/gmail/v1/users/${userID}/`;
  //const userIDx = "gtwmobmaster%40gmail.com";
  const baseUrl = `https://gmail.googleapis.com/gmail/v1/users/${userID}/`;

  //const ws = new WebSocket('ws://192.168.43.249:8080');

  const onClick = (p) => {
    //    setDate(Date.now());
    //alert(wss);
  };

  function handleCallbackResponse(response){
    console.log(response);
    console.log("Encoded JWT ID token: "+response.credential);
    var userObject=jwt_decode(response.credential);
    setAccessToken(response.credential);
    console.log(userObject);
  }

  useEffect(() => {
    /* global google */

      
    google.accounts.id.initialize({
      
      client_id:"905496662113-boh40h527g6t2abj8vrr94b02agqi88b.apps.googleusercontent.com",
      callback:handleCallbackResponse
    });
    
    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      {theme:"outline",size:"large"}
    );
    
    //clean up function
    //return () => ws.close();

  }, []);
  /*
  const firstBids = bids.map((item, index) => (
      <div key={index}>
          <p> {item}</p>
      </div>
  ));*/

  const getConfig = (token) => {
    let _token = `Bearer ${token}`;

    const config = {
      headers: { Authorization: _token },
    };

    return config;
  };

  //let config = getConfig(accessToken);

  const handleSendMessage = async () => {
    //let accessToken = await getAccessToken();
    //console.log('token= ' + accessToken);
    let config = getConfig(accessToken);
    let response = await sendMessage(config);
    //let messages = await getMessages("Query", config);
  };

  const getMessages = async (subject, config) => {
    // GET https://gmail.googleapis.com/gmail/v1/users/gtwmob1%40gmail.com/messages?q=Subject%3AInfo%20is%3Aunread&key=[YOUR_API_KEY] HTTP/1.1

    //const query="?q=Subject%3AInfo%20is%3Aunread";
    // Subject saadaan parametrina
    const query = `?q=Subject:${subject} is:unread`;
    //console.log(query);

    const response = await axios.get(baseUrl + "messages" + query, config);
    // console.log(response.statusText);
    // console.log(response.data);
    // undefined});

    let messages = [];
    if (response.statusText !== "undefined") {
      let res = response.data.messages;
      messages = res.map((message) => message.id);
    }
    return messages;
  };

  const sendMessage = async (config) => {
    let date = Date.now();

    let data2send = {
      date: date,
      battery: "55",
      temp: "20.1",
      location: { latitude: "123.2", longitude: "213.5" },
    };
    data2send = JSON.stringify(data2send);

    let datax = (
      "From: gtwmobmaster@gmail.com\r\n" +
      "To: laakkti@gmail.com\r\n" +
      "Subject: Subject Text\r\n\r\n" +
      data2send
    )
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const _data = base64.encode(datax);
    console.log(_data);

    //xxx = xxx.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    //console.log(xxx);
    //const _data = base64.endecode(xxx);

    // https://gmail.googleapis.com/gmail/v1/users/gtwmob1%40gmail.com/messages/send?key=[YOUR_API_KEY] HTTP/1.1

    //let url = baseUrl + "messages/send" + "?key=" + API_KEY;
    let url = baseUrl + "messages/send" + "?access_token=" + accessToken;

    //console.log(url);
    let data = {
      raw: _data,
    };

    try {
      const response = await axios.post(url, data, config);
      console.log("res=" + response);
    } catch (error) {
      console.log("ERROR: " + error);
      console.log("ERROR_MSG: " + error.message);
    }
  };

/*  
    const login = useGoogleLogin({
      onSuccess: tokenResponse => console.log(tokenResponse),
    });
*/  


  return (
    <div>
      <div id="signInDiv"></div>
      {/*<GoogleOAuthProvider clientId="905496662113-boh40h527g6t2abj8vrr94b02agqi88b.apps.googleusercontent.com">
          <GoogleLogin
          onSuccess={(credentialResponse) => {
            console.log(credentialResponse);
            //alert(credentialResponse.credential);
            setAccessToken(credentialResponse.credential);
          }}
          onError={() => {
            console.log("Login Failed");
          }}
        />
        <button onClick={() => login()}>Sign in with Google 🚀 </button>
      </GoogleOAuthProvider>*/}

     <button onClick={handleSendMessage}>Message</button>
    </div>
  );
}
export default App;
