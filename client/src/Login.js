import React, {useRef} from "react";
import './Login.css';

// Reload window when logging in to fix 2x button press bug
export default function Login( {onNameSubmit} ) {
    const nameRef = useRef();
  
    function handleSubmit(e) {
      e.preventDefault();
      onNameSubmit(nameRef.current.value)
      window.location.reload(false);
    }
  
    return (
      <div class="page">
        <div class="login-header">
          <h1>React Chat</h1>
        </div>
        <div class="login-container">
          <form onSubmit={handleSubmit}>
            <label>Enter Your Name:</label>
            <input type="text" ref={nameRef} required></input>
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    )
  }
