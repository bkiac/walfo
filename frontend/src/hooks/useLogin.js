import { useContext, useEffect, useState } from 'react';
import { authApi } from '../api';
import { UserContext } from '../contexts';
import useApiCallback from './useApiCallback';

function useLogin() {
  const userContext = useContext(UserContext);
  const [credentials, setCredentials] = useState();
  const [response, login] = useApiCallback(authApi.login);

  useEffect(() => {
    if (credentials) {
      login(credentials);
    }
  }, [credentials]);

  if (!response.isLoading && !response.hasError && response.data !== undefined) {
    userContext.storeUser(response.data);
  }

  return [response, setCredentials];
}

export default useLogin;
