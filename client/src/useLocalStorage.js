import React, {useState, useEffect} from "react";

const PREFIX = 'react-chat-'

export default function useLocalStorage(key, initalValue) {
    const prefixedkey = PREFIX + key
    const [value, setValue] = useState(() => {
        const nameValue = localStorage.getItem(prefixedkey)
        if (nameValue != null) return nameValue
        if (typeof initalValue === 'function') {
            return initalValue()
        } else {
            return initalValue
        }
    })

    useEffect(() => {
        localStorage.setItem(prefixedkey, value)
    }, [prefixedkey, value])

    return [value, setValue]
}

