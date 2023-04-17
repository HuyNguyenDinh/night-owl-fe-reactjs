import PropTypes from 'prop-types';
// import { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
// @mui
import { List } from '@mui/material';
// contexts
// import WebSocketContext from '../../../contexts/WebSocketContext';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { SkeletonConversationItem } from '../../../components/skeleton';
// redux
// import {getRoomChat} from '../../../redux/slices/chat'
//
import ChatConversationItem from './ChatConversationItem';

// ----------------------------------------------------------------------

ChatConversationList.propTypes = {
  conversations: PropTypes.array,
  isOpenSidebar: PropTypes.bool,
  activeConversationId: PropTypes.string,
  sx: PropTypes.object,
};

export default function ChatConversationList({ conversations, isOpenSidebar, activeConversationId, sx, ...other }) {
  const navigate = useNavigate();
  // const dispatch = useDispatch();

  const handleSelectConversation = (conversationId) => {
    navigate(PATH_DASHBOARD.chat.view(conversationId));
  };

  // const ws = useContext(WebSocketContext);
  // const [message, setMessage] = useState('');

  // useEffect(() => {
  //   if (ws) {
  //     ws.addEventListener('message', event => {
  //       setMessage(event.data.last_message);
  //     });
  //   }
  // }, [ws]);

  // useEffect(() => {
  //   console.log(message);
  // }, [message])

  const loading = !conversations.length;

  return (
    <List disablePadding sx={sx} {...other}>
      {conversations && conversations.map((conversation) =>
        <ChatConversationItem
          key={conversation.id}
          isOpenSidebar={isOpenSidebar}
          conversation={conversation}
          isSelected={activeConversationId === conversation.id}
          onSelectConversation={() => handleSelectConversation(conversation.id)}
        />
      
      )}
      
      {loading && !conversations && <SkeletonConversationItem />}
    </List>
  );
}
