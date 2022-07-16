import React, { useState, useEffect } from "react";
//import { GoogleLogin } from "react-google-login";
//import { GoogleOAuthProvider } from "@react-oauth/google";
//import { GoogleLogin } from "@react-oauth/google";
//import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
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

  function handleCallbackResponse(response){
    console.log("Encoded JWT ID token: "+response.crediential);
  }

  //useEffect(() => {
    /* global google */

    /*
    console.log("UseEffect");

    try{
    google.account.id.initialize({
      
      client_id:"905496662113-boh40h527g6t2abj8vrr94b02agqi88b.apps.googleusercontent.com",
      callback:handleCallbackResponse
    });
    
    google.account.id.renderButton(
      document.getElementById("signInDiv"),
      {theme:"outline",size:"large"}
    );
    }catch(error){
      console.log(error);
    }
    */
    //clean up function
    //return () => ws.close();

  //}, []);
  /*
  const firstBids = bids.map((item, index) => (
      <div key={index}>
          <p> {item}</p>
      </div>
  ));*/

  

  return (
    <div>
      <button>Message</button>
    </div>
  );
}
export default App;
