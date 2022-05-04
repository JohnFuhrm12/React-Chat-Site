import React, {useState, useEffect, useRef} from "react";
import Login from './Login';
import Chat from './Chat';
import useLocalStorage from "./useLocalStorage";

const App = () => {
    const [name, setName] = useLocalStorage()

    return (
        <>
            {name ? <Chat name={name} /> : <Login onNameSubmit={setName}/>}
        </>
    )
}

export default App;