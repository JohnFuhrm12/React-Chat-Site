import React, {useState, useEffect, useRef} from "react";
import io from "socket.io-client";
import './App.css';

const App = () => {
  const [yourID, setYourID] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect('/');

    socketRef.current.on("your id", id => {
      setYourID(id);
    })

    socketRef.current.on("message", (message) => {
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
    socketRef.current.emit("send message", messageObject);
    setMessage('');
  }

  function handleChange(e) {
    setMessage(e.target.value);
  }

  return (
    <div class="page">
      <div class="container">
        {messages.map((message, index) => {
          if (message.id === yourID) {
            return (
              <div class="MyRow" key={index}> 
                <div class="MyMessage">
                  {message.body}
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
      <form class="form" onSubmit={sendMessage}>
        <textarea class="textarea" value={message} onChange={handleChange} placeholder="Say something..." />
        <button class="button">Send</button>
      </form>
    </div>
  );
}

export default App;
