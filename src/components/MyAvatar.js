// hooks
import useAuth from '../hooks/useAuth';
// utils
import createAvatar from '../utils/createAvatar';
//
import Avatar from './Avatar';

// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }) {
  const { user } = useAuth();

  return (
    <Avatar
      src={user?.avatar}
      alt={user?.first_name}
      color={user?.avatar ? 'default' : createAvatar(user?.first_name).color}
      {...other}
    >
      {createAvatar(user?.first_name).name}
    </Avatar>
  );
}
