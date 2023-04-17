import { useEffect, useState, useContext } from 'react';
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
  addRecipients,
  onSendMessage,
  getConversation,
  getParticipants,
  markConversationAsRead,
  resetActiveConversation,
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
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { pathname } = useLocation();

  const {user} = useAuth();

  const { id } = useParams();

  const [roomInfo, setRoomInfo] = useState();
  
  const [messages, setMessages] = useState([]);

  const ws = useContext(WebSocketContext);

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
          setMessages(response.data.results);
        } catch (error) {
          console.error(error);
        }
      };
      getRoomInfo();
      getMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (ws) {
      ws.addEventListener('message', event => {
        if (event.data.id === Number(id) || event.data.id === id) {
          setMessages([...messages, event.data.last_message]);
        }
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ws]);

  // useEffect(() => {
  //   if (activeConversationId) {
  //     dispatch(markConversationAsRead(activeConversationId));
  //   }
  // }, [dispatch, activeConversationId]);

  // const handleAddRecipients = (recipients) => {
  //   dispatch(addRecipients(recipients));
  // };

  const handleSendMessage = async (value) => {
    try {
      dispatch(onSendMessage(value));
    } catch (error) {
      console.error(error);
    }
  };

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

      <Divider />

      <Box sx={{ flexGrow: 1, display: 'flex', overflow: 'hidden' }}>
        <Stack sx={{ flexGrow: 1 }}>
          {/* <ChatMessageList conversation={conversation} /> */}
          <ChatMessageList messages={messages} />

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
