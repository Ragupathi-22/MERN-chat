import { createContext, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

//import for properly decode the token from asyncStorage
import { decode } from 'js-base64';
global.atob = decode;
import { jwtDecode } from "jwt-decode";

const UserType = createContext();

const UserContext = ({ children }) => {

    // const baseUrl='https://shy-gold-salmon-toga.cyclic.app';
    // const baseUrl="http://192.168.1.157:8000"
    const baseUrl='https://chat-api-gkq5.onrender.com'


    const imgDpUrl='https://cwptraining.ntplstaging.com/chat-img/chat-img/';

    const [userId, setUserId] = useState("");
    
    return (
        <UserType.Provider value={{ userId, setUserId ,baseUrl,imgDpUrl}}>
            {children}
        </UserType.Provider>
    )
}
export { UserType, UserContext }; 