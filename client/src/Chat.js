import React, {useState, useEffect, useRef} from "react";
import io from "socket.io-client";
import { Camera, CameraResultType } from '@capacitor/camera';
import useLocalStorage from "./useLocalStorage";
import debounce from "lodash/debounce";
import './Chat.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import { getDocs } from "firebase/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyCjmGw6wsKZ4iPtnyg_jpOIICWl_sFzwhk",
  authDomain: "react-chat-app-85a86.firebaseapp.com",
  projectId: "react-chat-app-85a86",
  storageBucket: "react-chat-app-85a86.appspot.com",
  messagingSenderId: "690348767137",
  appId: "1:690348767137:web:bbbc7ee75a5cf058193de0"
})

const firestore = firebase.firestore();

let socket;

const Chat = () => {
  const [yourID, setYourID] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [name, setName] = useLocalStorage();
  const [dbmessages, setDbmessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesRef = firestore.collection('messages');
  const scrollpoint = useRef();
  const scrollpoint2 = useRef()
  const ENDPOINT = 'https://react-chat-jf12.herokuapp.com/'

  const socketRef = useRef();

  useEffect(() => {
    socket = io(ENDPOINT, { transports: ['websocket', 'polling', 'flashsocket'] });
    console.log(socket);

    const getDbmessages = async () => {
      const data = await getDocs(messagesRef.orderBy('createdAt', "desc").limit(20));
      setDbmessages(data.docs.map((doc) => ({ ...doc.data(), id: doc.id})));
      console.log(data);
    };

    getDbmessages();

    socketRef.current = io.connect('/');

    socket.on("your id", id => {
      setYourID(id);
    }, [])

    socket.on("message", (message) => {
      receivedMessage(message);
    })
  }, []);

  function receivedMessage(message) {
    setMessages(oldMsgs => [...oldMsgs, message]);
  }

  const sendMessage = async (e) => {
    e.preventDefault();
    const messageObject = {
      body: message,
      id: yourID,
      username: name,
    };

    socket.emit("send message", messageObject);

    await messagesRef.add({
      text: message,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      yourID,
      name,
    })

    setMessage('');
    scrollpoint.current.scrollIntoView({ behavior: 'smooth' })
  }

  function sendImage(e) {
    e.preventDefault();
    const image = Camera.pickImages({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64
    });

    var imageUrl = image.base64String;
    console.log(imageUrl)
 
  }

  function handleLogout () {
     setName('')
     window.location.reload(false);
  }

  const handleIsTyping = debounce(function () {
    setIsTyping(false);
  }, 5000);

  function handleChange(e) {
    setMessage(e.target.value);
    setIsTyping(true);
    handleIsTyping();
    console.log('change')
  }

  return (
    <div className="page">
      <div className="header">
        <h1>React Chat</h1>
        <button onClick={handleLogout} className="logout">Logout</button>
      </div>
      <div className="container">
        {dbmessages.slice().reverse().map((dbmessage) => {
          if (name === dbmessage.name) {
            return (
              <div>
                <div className="MyRow">
                  <div className="MyMessage">
                    {dbmessage.text}
                  </div>
              </div>
              <div className="my-name">
                {name}
              </div>
            </div>
            )
          }
          return (
            <div>
              <div className="PartnerRow">
                <div className="PartnerMessage">
                  {dbmessage.text}
                </div>
              </div>
              <div className="other-name">
                {dbmessage.name}
              </div>
          </div>
          )
        })}
        {messages.map((message, index) => {
          if (message.id === yourID) {
            return (
              <div>
                <div className="MyRow" key={index}> 
                  <div className="MyMessage">
                    {message.body}
                  </div>
                </div>
                <div className="my-name">
                  {name}
                </div>
                <div className="scroll" ref={scrollpoint}></div>
              </div>
            )
          }
          return (
            <div>
              <div className="PartnerRow" key={index}>
                <div className="PartnerMessage">
                  {message.body}
                </div>
              </div>
              <div className="other-name">
                {message.username}
              </div>
              <div className="scroll" ref={scrollpoint2}></div>
            </div>
          )
        })}
      <span className="user-typing">{isTyping === true ? <h1>User Typing...</h1> : <h1></h1>}</span>
      </div>
      <div className="footer">
        <form className="img-form" onSubmit={sendImage}>
          <button className="img-button"><img className="clip" src={require("./clip.png")} alt="paperclip" /></button>
        </form>
        <form className="form" onSubmit={sendMessage}>
          <textarea className="textarea" value={message} onChange={handleChange} placeholder="Say something..." required />
          <button className="button">Send</button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
