import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';
// @mui
import { styled } from '@mui/material/styles';
import { Avatar, Box, Typography } from '@mui/material';
import useAuth from '../../../hooks/useAuth';
// components
import Image from '../../../components/Image';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(3),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 320,
  padding: theme.spacing(1.5),
  marginTop: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral,
}));

const InfoStyle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(0.75),
  color: theme.palette.text.secondary,
}));

// ----------------------------------------------------------------------

ChatMessageItem.propTypes = {
  message: PropTypes.object.isRequired,
  // conversation: PropTypes.object.isRequired,
  // onOpenLightbox: PropTypes.func,
};

export default function ChatMessageItem({ message }) {
  const {user} = useAuth

  const sender = message.creator;

  const isMe = sender?.id === user?.id;
  // const isImage = message.contentType === 'image';
  // const firstName = senderDetails.name && senderDetails.name.split(' ')[0];

  return (
    <RootStyle>
      <Box
        sx={{
          display: 'flex',
          ...(isMe && {
            ml: 'auto',
          }),
        }}
      >
        {!isMe && (
          <Avatar alt={sender.first_name} src={sender.avatar} sx={{ width: 32, height: 32, mr: 2 }} />
        )}

        <div>
          <InfoStyle
            variant="caption"
            sx={{
              ...(isMe ? { justifyContent: 'flex-end' } : {justifyContent: 'flex-start'}),
            }}
          >
            {!isMe && `${sender.first_name},`}&nbsp;
            {formatDistanceToNowStrict(new Date(message.created_date), {
              addSuffix: true,
            })}
          </InfoStyle>

          <ContentStyle
            sx={{
              ...(isMe && { color: 'grey.800', bgcolor: 'primary.lighter' }),
              // ...(isImage && { p: 0 }),
            }}
          >
            {/* {isImage ? (
              <Image
                alt="attachment"
                src={message.body}
                onClick={() => onOpenLightbox(message.body)}
                sx={{ borderRadius: 1, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
              />
            ) : ( */}
              <Typography variant="body2">{message.content}</Typography>
            {/* )} */}
          </ContentStyle>
        </div>
      </Box>
    </RootStyle>
  );
}
