import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Avatar as MUIAvatar, ListItemText, ListItemAvatar, ListItemButton } from '@mui/material';
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

const getDetails = (conversation, currentUserId) => {
  const otherParticipants = conversation.participants.filter((participant) => participant.id !== currentUserId);
  const displayNames = otherParticipants.reduce((names, participant) => [...names, participant.name], []).join(', ');
  let displayText = '';
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  if (lastMessage) {
    const sender = lastMessage.senderId === currentUserId ? 'You: ' : '';
    const message = lastMessage.contentType === 'image' ? 'Sent a photo' : lastMessage.body;
    displayText = `${sender}${message}`;
  }
  return { otherParticipants, displayNames, displayText };
};

ChatConversationItem.propTypes = {
  isSelected: PropTypes.bool,
  conversation: PropTypes.object.isRequired,
  isOpenSidebar: PropTypes.bool,
  onSelectConversation: PropTypes.func,
};

export default function ChatConversationItem({ isSelected, conversation, isOpenSidebar, onSelectConversation }) {
  // const details = getDetails(conversation, '8864c717-587d-472a-929a-8e5f298024da-0');

  const displayLastActivity = conversation.last_message.created_date;

  const isGroup = conversation.room_type === 1;
  // const isUnread = conversation.unreadCount > 0;
  // const isOnlineGroup = isGroup && details.otherParticipants.map((item) => item.status).includes('online');

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
              {conversation.room_avatar ?
               <MUIAvatar alt={conversation.room_name} src={conversation.room_avatar} />
               :
               <Avatar alt={conversation.room_name} color={createAvatar(conversation.room_name).color}>
                {createAvatar(conversation.room_name).room_name}
               </Avatar>
              }
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
