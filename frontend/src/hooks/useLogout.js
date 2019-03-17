import { useContext } from 'react';
import { UserContext } from '../contexts';

function useLogout() {
  const userContext = useContext(UserContext);
  return userContext.removeUser;
}

export default useLogout;
