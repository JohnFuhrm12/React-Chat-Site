import React, {useState, useEffect, useRef} from "react";
import Login from './Login';
import Chat from './Chat';
import useLocalStorage from "./useLocalStorage";

// Gets names from localstorage, if no name display login
const App = () => {
    const [name, setName] = useLocalStorage()

    return (
        <>
        {name==='' ? <Login onNameSubmit={setName} /> : <Chat name={name} onNameSubmit={setName}/>}
        </>
    )
}

export default App;