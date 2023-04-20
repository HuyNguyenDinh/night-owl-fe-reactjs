import PropTypes from 'prop-types';
// import { useContext, useEffect, useState } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Avatar as MUIAvatar, ListItemText, ListItemAvatar, ListItemButton } from '@mui/material';
// context
// import WebSocketContext from '../../../contexts/WebSocketContext';
// hook
import useAuth from '../../../hooks/useAuth';
// utils
import createAvatar from '../../../utils/createAvatar';
//
import Avatar from '../../../components/Avatar';
import BadgeStatus from '../../../components/BadgeStatus';

// ----------------------------------------------------------------------

const AVATAR_SIZE = 48;
const AVATAR_SIZE_GROUP = 32;

const RootStyle = styled(ListItemButton)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  transition: theme.transitions.create('all'),
}));

const AvatarWrapperStyle = styled('div')({
  position: 'relative',
  width: AVATAR_SIZE,
  height: AVATAR_SIZE,
  '& .MuiAvatar-img': { borderRadius: '50%' },
  '& .MuiAvatar-root': { width: '100%', height: '100%' },
});

// ----------------------------------------------------------------------

// const getDetails = (conversation, currentUserId) => {
//   const otherParticipants = conversation.participants.filter((participant) => participant.id !== currentUserId);
//   const displayNames = otherParticipants.reduce((names, participant) => [...names, participant.name], []).join(', ');
//   let displayText = '';
//   const lastMessage = conversation.messages[conversation.messages.length - 1];
//   if (lastMessage) {
//     const sender = lastMessage.senderId === currentUserId ? 'You: ' : '';
//     const message = lastMessage.contentType === 'image' ? 'Sent a photo' : lastMessage.body;
//     displayText = `${sender}${message}`;
//   }
//   return { otherParticipants, displayNames, displayText };
// };

ChatConversationItem.propTypes = {
  isSelected: PropTypes.bool,
  conversation: PropTypes.object.isRequired,
  isOpenSidebar: PropTypes.bool,
  onSelectConversation: PropTypes.func,
};

export default function ChatConversationItem({ isSelected, conversation, isOpenSidebar, onSelectConversation }) {

  const displayLastActivity = conversation.last_message.created_date;

  const isGroup = conversation.room_type === 1;

  const { user } = useAuth();

  // const {message} = useContext(WebSocketContext);

  // const [messageCover, setMessageCover] = useState(conversation.last_message.content);

  // useEffect(() => {
  //   if (Number(message.id === Number(conversation.id))) {
  //     setMessageCover(message.last_message.content);
  //   }
  // }, [message, conversation.id])

  const renderCover = () => {
    if (conversation.type && conversation.type === "chat_message") {
      if (conversation.last_message.creator.id === user?.id) {
        if (conversation.room_avatar) {
          return (<MUIAvatar alt={conversation.room_name} src={conversation.room_avatar} />)
        }
        return (
          <Avatar alt={conversation.room_name} color={createAvatar(conversation.room_name).color}>
            {createAvatar(conversation.room_name).name}
          </Avatar>
        )
      }
      if (conversation.another_room_avatar) {
        return (<MUIAvatar alt={conversation.another_room_name} src={conversation.another_room_avatar} />)
      }
      return (
        <Avatar alt={conversation.another_room_name} color={createAvatar(conversation.another_room_name).color}>
        {createAvatar(conversation.another_room_name).name}
      </Avatar>
      )
    }
    if (conversation.room_avatar) {
      return (<MUIAvatar alt={conversation.room_name} src={conversation.room_avatar} />)
    }
    return (
      <Avatar alt={conversation.room_name} color={createAvatar(conversation.room_name).color}>
        {createAvatar(conversation.room_name).name}
      </Avatar>
    )
  }

  const getRoomName = () => {
    if (conversation.type && conversation.type === "chat_message") {
      if (conversation.last_message.creator.id === user?.id) {
        return conversation.room_name
      }
      return conversation.another_room_name
    }
    return conversation.room_name
  }

  return (
    <RootStyle
      onClick={onSelectConversation}
      sx={{
        ...(isSelected && { bgcolor: 'action.selected' }),
      }}
    >
      <ListItemAvatar>
        <Box
          sx={{
            ...(isGroup && {
              position: 'relative',
              width: AVATAR_SIZE,
              height: AVATAR_SIZE,
              '& .avatarWrapper': {
                position: 'absolute',
                width: AVATAR_SIZE_GROUP,
                height: AVATAR_SIZE_GROUP,
                '&:nth-of-type(1)': {
                  left: 0,
                  zIndex: 9,
                  bottom: 2,
                  '& .MuiAvatar-root': {
                    border: (theme) => `solid 2px ${theme.palette.background.paper}`,
                  },
                },
                '&:nth-of-type(2)': { top: 2, right: 0 },
              },
            }),
          }}
        >
          {isGroup && conversation.user.slice(0, 2).map((participant) => (
            <AvatarWrapperStyle className="avatarWrapper" key={participant.id}>
              <MUIAvatar alt={participant.first_name} src={participant.avatar} />
              {!isGroup && (
                <BadgeStatus status="online" sx={{ right: 2, bottom: 2, position: 'absolute' }} />
              )}
            </AvatarWrapperStyle>
          ))}
          {!isGroup && 
            <AvatarWrapperStyle className="avatarWrapper">
              {renderCover()}

              {/* {!isGroup && (
                <BadgeStatus status="online" sx={{ right: 2, bottom: 2, position: 'absolute' }} />
              )} */}
            </AvatarWrapperStyle>
          }
          {/* {isOnlineGroup && <BadgeStatus status="online" sx={{ right: 2, bottom: 2, position: 'absolute' }} />} */}
        </Box>
      </ListItemAvatar>
      {/* {isOpenSidebar && 
        <ListItemText
          primary={conversation.room_name}
          primaryTypographyProps={{
            noWrap: true,
            variant: 'subtitle2',
          }}
          secondary={conversation.last_message.content}
          secondaryTypographyProps={{
            noWrap: true,
            variant: 'body2',
            color: 'textPrimary',
          }}
        />
      } */}

      {isOpenSidebar && (
        <>
          <ListItemText
            primary={getRoomName()}
            primaryTypographyProps={{
              noWrap: true,
              variant: 'subtitle2',
            }}
            // secondary={messageCover}
            secondary={conversation.last_message.content}
            secondaryTypographyProps={{
              noWrap: true,
              variant: 'body2',
              color: 'textPrimary',
            }}
          />

          <Box
            sx={{
              ml: 2,
              height: 44,
              display: 'flex',
              alignItems: 'flex-start',
              flexDirection: 'column',
            }}
          >
            <br />
            <Box
              sx={{
                mb: 1.25,
                fontSize: 12,
                lineHeight: '22px',
                whiteSpace: 'nowrap',
                color: 'text.disabled',
              }}
            >
              {formatDistanceToNowStrict(new Date(displayLastActivity), {
                addSuffix: false,
              })}
            </Box>
            {/* {isUnread && <BadgeStatus status="unread" size="small" />} */}
          </Box>
        </>
      )}
    </RootStyle>
  );
}
