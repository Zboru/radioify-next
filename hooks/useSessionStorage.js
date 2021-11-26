import {useState, useEffect} from "react";

function getStorageValue(key, defaultValue) {
    if (typeof window !== 'undefined') {
        const saved = window.sessionStorage.getItem(key);
        if (saved != null) {
            return JSON.parse(saved);
        }
        return defaultValue;
    }
}

export const useSessionStorage = (key, defaultValue) => {
    const [value, setValue] = useState(() => {
        return getStorageValue(key, defaultValue);
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.sessionStorage.setItem(key, JSON.stringify(value));
        }
    }, [key, value]);

    return [value, setValue];
};
