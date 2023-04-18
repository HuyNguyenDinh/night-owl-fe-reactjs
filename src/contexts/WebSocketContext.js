import PropTypes from 'prop-types';
import {createContext, useEffect, useState} from 'react';
import useAuth from '../hooks/useAuth';

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {

    const {user} = useAuth();

    const [message, setMessage] = useState('');

    const [ws, setWs] = useState();
    useEffect(() => {
        if (user) {
            const access = localStorage.getItem("accessToken");
            if (access) {
                setWs(new WebSocket(`wss://nom.nguyendinhhuy.dev/ws/user/connection/?token=${access}`))
            }
        }
    }, [user])

    useEffect(() => {
        if (ws) {
            ws.onmessage = (event) => {
                setMessage(JSON.parse(event.data));
            }
        }
    }, [ws]);

    return (
        <WebSocketContext.Provider value={{
            ws, 
            message,
        }}
        >
            {children}
        </WebSocketContext.Provider>
    );
};

WebSocketProvider.propTypes = {
    children: PropTypes.node,
};

export default WebSocketContext;