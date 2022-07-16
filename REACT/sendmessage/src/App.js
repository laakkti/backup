// https://developers.google.com/gmail/api/quickstart/js

import React, { useState, useEffect } from "react";
//import { GoogleLogin } from "react-google-login";
import { GoogleOAuthProvider } from "@react-oauth/google";
//import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import jwt_decode from "jwt-decode";
//import ScriptTag from 'react-script-tag';
import { Helmet } from "react-helmet";

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

  const CLIENT_ID =
    "905496662113-boh40h527g6t2abj8vrr94b02agqi88b.apps.googleusercontent.com";
  //const API_KEY = '<YOUR_API_KEY>';

  // Discovery doc URL for APIs used by the quickstart
  const DISCOVERY_DOC =
    "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest";

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  const SCOPES = "https://mail.google.com/";

  let tokenClient;

  const onClick = (p) => {
    //    setDate(Date.now());
    //alert(wss);
  };

  function handleCallbackResponse(response) {
    console.log(response);
    console.log("Encoded JWT ID token: " + response.credential);
    var userObject = jwt_decode(response.credential);
    setAccessToken(response.credential);
    console.log(userObject);
  }

  async function intializeGapiClient() {
    console.log("#############");
    await window.gapi.client.init({
      apiKey: API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
  }

  // kokeile async-await
  function gapiLoaded() {
    window.gapi.load("client", intializeGapiClient);
  }

  function callback(){
    console.log("callback called");
  }

  function gisLoaded() {
    // tsekkaa neristä initTokenClinet ja mikä on callbackin merkitys
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: "callback", // defined later
    });
  }

  useEffect(() => {
    /* global google */

    // voisi tehdä luokan/komponentin
    gapiLoaded();
    gisLoaded();

    /*
    google.accounts.id.initialize({
      client_id:
        "905496662113-boh40h527g6t2abj8vrr94b02agqi88b.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });
    */
    //clean up function
    //return () => ws.close();
  }, []);

// ei tarvita JS_virityksen jälkeen, oli axios:sta varten
  const getConfig = (token) => {
    let _token = `Bearer ${token}`;

    const config = {
      headers: { Authorization: _token },
    };

    return config;
  };

  //let config = getConfig(accessToken);

  const getAuthConfig = () => {
    // headers: {  http://localhost:3000 },
    const config = {
      headers: {
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Origin": "*",
      },
    };

    return config;
  };


  // laita palauttamaan true/false
  async function sendMessage(auth, from, to, subject, content) {
    // The Gmail API requires url safe Base64 
    // (replace '+' with '-', and '/' with '_')
    var encodedEmail = new Buffer(
      'From: ' + from + '\r\n' +
      'To: ' + to + '\r\n' +
      'Subject: ' + subject + '\r\n\r\n' +
   
      content 
    ).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
   

    // poistettu auth: auth,
    let response;
    try {
      response = await window.gapi.client.gmail.users.messages.send({        
        userId: "me",
        resource: {
          raw: encodedEmail
        }
      });
    } catch (err) {
      return;
    }

    /*
    var gmail = google.gmail('v1');
    
    // poistettu   auth: auth,
    var request = gmail.users.messages.send({    
      userId: 'me',
      resource: {
        raw: encodedEmail
      }
    }, function (err, result) {
      console.log('result:', result);
    });*/
   };


  async function sendMessagexxx(){
    let response;
    try {
      response = await window.gapi.client.gmail.users.messages.send({
        userId: "me",
      });
    } catch (err) {
      return;
    }
    //const messages = response.result.messages;
    //alert(messages.length);
  }

  async function listMessages(){
    let response;
    try {
      response = await window.gapi.client.gmail.users.messages.list({
        userId: "me",
      });
    } catch (err) {
      return;
    }
    const messages = response.result.messages;
    alert(messages.length);
    
    /*if (!labels || labels.length == 0) {
      console.log("error");
      return;
    }
    // Flatten to string to display
    const output = labels.reduce(
      (str, label) => `${str}${label.name}\n`,
      "Labels:\n"
    );
    console.log(output);
    */
  }

  async function listLabels() {
    let response;
    try {
      response = await window.gapi.client.gmail.users.labels.list({
        userId: "me",
      });
    } catch (err) {
      return;
    }

    const labels = response.result.labels;
    if (!labels || labels.length == 0) {
      console.log("error");
      return;
    }
    // Flatten to string to display
    const output = labels.reduce(
      (str, label) => `${str}${label.name}\n`,
      "Labels:\n"
    );

    console.log(output);
  }

  const handleGapi = () => {
    console.log("--------------------xxxxxxxxx " + tokenClient);
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw resp;
      }

      //await listLabels();
      await listMessages();
    };

    if (window.gapi.client.getToken() === null) {
      // Prompt the user to select a Google Account and ask for consent to share their data
      // when establishing a new session.
      tokenClient.requestAccessToken({ prompt: "consent" });
    } else {
      // Skip display of account chooser and consent dialog for an existing session.
      tokenClient.requestAccessToken({ prompt: "" });
    }

    //window.gapi.load('client', intializeGapiClient);
    //console.log("tokenClient= "+JSON.stringify(tokenClient));
    //console.log("tokenClient= "+tokenClient.requestAccessToken);
    /*for(let item in tokenClient){

      console.log("xxx "+item);
   }*/
  };

  const handleAuth = async () => {
    //const url="https://accounts.google.com/o/oauth2/auth?scope=https://mail.google.com/&response_type=code&access_type=offline&client_id=905496662113-boh40h527g6t2abj8vrr94b02agqi88b.apps.googleusercontent.com";
    const url =
      "https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=https%3A%2F%2Fdevelopers.google.com%2Foauthplayground&prompt=consent&response_type=code&client_id=407408718192.apps.googleusercontent.com&scope=https%3A%2F%2Fmail.google.com%2F&access_type=offline";
    //const url="https://accounts.google.com/o/oauth2/auth?scope=https://mail.google.com/&response_type=code&access_type=offline&redirect_uri=http://localhost:3000/&client_id=905496662113-boh40h527g6t2abj8vrr94b02agqi88b.apps.googleusercontent.com";

    //const response = await axios.get(url,getAuthConfig());
    //try{
    // "Access-Control-Allow-Origin": "*" ,
    const response = await axios.get(url, {
      headers: {
        crossorigin: true,
      },
    });
    console.log(response);
    //  }catch(e){
    //    console.log(e.message);
    //  }
  };

  const handleSendMessage = async () => {
    //let accessToken = await getAccessToken();
    //console.log('token= ' + accessToken);
    //let config = getConfig(accessToken);
    //let response = await xxxxsendMessage(config);
    //let messages = await getMessages("Query", config);
    const auth=tokenClient;
    const from="gtwmobmaster@gmail.com";
    const to="laakkti@gmail.com";
    const subject="query";
    const content="heipä hei this a test message";
    await sendMessage(auth, from, to, subject, content);
    
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

  const xxxxsendMessage = async (config) => {
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

    let url = baseUrl + "messages/send" + "?key=" + API_KEY;
    //let url = baseUrl + "messages/send" + "?access_token=" + accessToken;

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

      <Helmet>
        <script async defer src="https://apis.google.com/js/api.js"></script>
        <script
          async
          defer
          src="https://accounts.google.com/gsi/client"
        ></script>
      </Helmet>

      <button onClick={handleSendMessage}>SendMessage</button>
      <button onClick={handleAuth}>Authorization</button>
      <button onClick={handleGapi}>Token</button>
      
    </div>
  );
}
export default App;
