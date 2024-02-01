import { useMemo } from 'react';
import {io} from 'socket.io-client'
import React from 'react';

const socketContext = React.createContext(null);
export const useSocket = () =>{
    return React.useContext(socketContext)
}


const socketPr = (props)=>{
    const socket = useMemo(()=>io('http://localhost:3001'),[])
    return (
        <socketContext.Provider value={{socket}}>
        {props.children}
        </socketContext.Provider>
    )

}
export default socketPr;