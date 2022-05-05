import React, {useState, useEffect, useRef} from "react";
import io from "socket.io-client";
import { Camera, CameraResultType } from '@capacitor/camera';
import useLocalStorage from "./useLocalStorage";
import './Chat.css';

let socket;

const Chat = () => {
  const [yourID, setYourID] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [name, setName] = useLocalStorage()
  const ENDPOINT = 'https://react-chat-jf12.herokuapp.com/'

  const socketRef = useRef();

  useEffect(() => {
    socket = io(ENDPOINT, { transports: ['websocket', 'polling', 'flashsocket'] });
    console.log(socket);

    socketRef.current = io.connect('/');

    socket.on("your id", id => {
      setYourID(id);
    })

    socket.on("message", (message) => {
      receivedMessage(message);
    })
  }, []);

  function receivedMessage(message) {
    setMessages(oldMsgs => [...oldMsgs, message]);
  }

  function sendMessage(e) {
    e.preventDefault();
    const messageObject = {
      body: message,
      id: yourID,
    };
    socket.emit("send message", messageObject);
    setMessage('');
  }

  function sendImage(e) {
    e.preventDefault();
    const image = Camera.pickImages({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64
    });
  }

  function handleLogout () {
     setName('')
     window.location.reload(false);
  }

  function handleChange(e) {
    setMessage(e.target.value);
  }

  return (
    <div class="page">
      <div class="header">
        <h1>React Chat</h1>
        <button onClick={handleLogout} class="logout">Logout</button>
      </div>
      <div class="container">
        {messages.map((message, index) => {
          if (message.id === yourID) {
            return (
              <div>
                <div class="MyRow" key={index}> 
                  <div class="MyMessage">
                    {message.body}
                  </div>
                </div>
                <div class="my-name">
                  {name}
                </div>
              </div>

            )
          }
          return (
            <div class="PartnerRow" key={index}>
              <div class="PartnerMessage">
                {message.body}
              </div>
            </div>
          )
        })}
      </div>
      <div class="footer">
        <form class="img-form" onSubmit={sendImage}>
          <button class="img-button"><img class="clip" src={require("./clip.png")} alt="paperclip" /></button>
        </form>
        <form class="form" onSubmit={sendMessage}>
          <textarea class="textarea" value={message} onChange={handleChange} placeholder="Say something..." required />
          <button class="button">Send</button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
