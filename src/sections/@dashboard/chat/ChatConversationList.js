import PropTypes from 'prop-types';
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// @mui
import { List } from '@mui/material';
// contexts
import WebSocketContext from '../../../contexts/WebSocketContext';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { SkeletonConversationItem } from '../../../components/skeleton';
// redux
import { pushConversationToTop } from '../../../redux/slices/chat'
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
  const dispatch = useDispatch();

  const handleSelectConversation = (conversationId) => {
    navigate(PATH_DASHBOARD.chat.view(conversationId));
  };

  const { message } = useContext(WebSocketContext);
  
  useEffect(() => {
    if (message) {
      dispatch(pushConversationToTop(message));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

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
