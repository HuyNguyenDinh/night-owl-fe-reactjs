import { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
// @mui
import { Box, Divider, Stack } from '@mui/material';
// Context
import WebSocketContext from '../../../contexts/WebSocketContext';
// hooks
import useAuth from '../../../hooks/useAuth';
// utils
import axiosInstance from '../../../utils/axios';
// redux
import { useDispatch, useSelector } from '../../../redux/store';
import {
  // addRecipients,
  onSendMessage,
  // getConversation,
  // getParticipants,
  // markConversationAsRead,
  // resetActiveConversation,
} from '../../../redux/slices/chat';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import ChatRoom from './ChatRoom';
import ChatMessageList from './ChatMessageList';
import ChatHeaderDetail from './ChatHeaderDetail';
import ChatMessageInput from './ChatMessageInput';
import ChatHeaderCompose from './ChatHeaderCompose';

// ----------------------------------------------------------------------

// const conversationSelector = (state) => {
//   const { conversations, activeConversationId } = state.chat;
//   const conversation = activeConversationId ? conversations.find(()) : null;
//   if (conversation) {
//     return conversation;
//   }
//   const initState = {
//     id: '',
//     messages: [],
//     participants: [],
//     unreadCount: 0,
//     type: '',
//   };
//   return initState;
// };

export default function ChatWindow() {
  // const dispatch = useDispatch();

  const navigate = useNavigate();

  const { pathname } = useLocation();

  const {user} = useAuth();

  const { id } = useParams();

  const [roomInfo, setRoomInfo] = useState();
  
  const [messages, setMessages] = useState([]);

  const [nextMessages, setNextMessages] = useState('');

  const { ws, message} = useContext(WebSocketContext);

  const [first, setFirst] = useState(true);

  // const { currentRoom, contacts, recipients, participants, activeConversationId } = useSelector((state) => state.chat);
  // const conversation = useSelector((state) => conversationSelector(state));

  // const mode = conversationKey ? 'DETAIL' : 'COMPOSE';
  // const displayParticipants = participants.filter((item) => item.id !== '8864c717-587d-472a-929a-8e5f298024da-0');

  useEffect(() => {
    if (id) {
      const getRoomInfo = async () => {
        try {
          const response = await axiosInstance.get(`/market/chatrooms/${id}/`);
          setRoomInfo(response.data);
        }
        catch (error) {
          console.log(error);
        }
      }
      const getMessages = async () => {
        try {
          const response = await axiosInstance.get(`/market/chatrooms/${id}/messages`);
          setMessages(response.data.results.reverse());
          if (response.data.next) {
            setNextMessages(response.data.next);
          }
          else {
            setNextMessages('');
          }
        } catch (error) {
          console.error(error);
        }
      };
      getRoomInfo();
      getMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]);

  useEffect(() => {
    if (Number(message.id) === Number(id)) {
      setMessages(state => ([...state, message.last_message]));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  const handleSendMessage = async (value) => {
    ws.send(JSON.stringify({
      "room_id": id,
      "content": value.message
    }))
  };

  const handleGetMoreMessage = async () => {
    try {
      const response = await axiosInstance.get(nextMessages);
      setFirst(false);
      setMessages((state) => ([...response.data.results.reverse(), ...state]));
      if (response.data.next) {
        setNextMessages(response.data.next);
      }
      else {
        setNextMessages('');
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Stack sx={{ flexGrow: 1, minWidth: '1px' }}>
      {/* {mode === 'DETAIL' ? (
        <ChatHeaderDetail participants={displayParticipants} />
      ) : (
        <ChatHeaderCompose
          recipients={recipients}
          contacts={Object.values(contacts.byId)}
          onAddRecipients={handleAddRecipients}
        />
      )} */}
      {/* <ChatHeaderDetail participants={displayParticipants} /> */}
      <ChatHeaderDetail roomInfo={roomInfo}/>
      <Divider />

      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
        <Stack sx={{ flexGrow: 1 }}>
          {/* <ChatMessageList conversation={conversation} /> */}

          <ChatMessageList first={first} messages={messages} isMore={nextMessages} onNextMessages={handleGetMoreMessage} />

          <Divider />

          <ChatMessageInput
            conversationId={id}
            onSend={handleSendMessage}
            disabled={pathname === PATH_DASHBOARD.chat.new}
          />
        </Stack>

        {/* {mode === 'DETAIL' && <ChatRoom conversation={conversation} participants={displayParticipants} />} */}
      </Box>
    </Stack>
  );
}
