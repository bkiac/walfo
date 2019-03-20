import { useContext, useEffect, useState } from 'react';
import { authApi } from '../api';
import { UserContext } from '../contexts';
import useApiCallback from './useApiCallback';

function useRegister() {
  const userContext = useContext(UserContext);
  const [credentials, setCredentials] = useState();
  const [response, register] = useApiCallback(authApi.register);

  useEffect(() => {
    if (credentials) {
      register(credentials);
    }
  }, [credentials]);

  if (!response.isLoading && !response.hasError && response.data !== undefined) {
    userContext.storeUser(response.data);
  }

  return [response, setCredentials];
}

export default useRegister;
