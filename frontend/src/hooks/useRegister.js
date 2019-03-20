import { useContext, useEffect, useState } from 'react';
import useApi from './useApi';
import { authApi } from '../api';
import { UserContext } from '../contexts';

function useRegister() {
  const userContext = useContext(UserContext);
  const [credentials, setCredentials] = useState();
  const [response, fetch] = useApi(authApi.register, undefined, false);

  useEffect(() => {
    if (credentials) {
      fetch(credentials);
    }
  }, [credentials]);

  if (!response.isLoading && !response.hasError && response.data !== undefined) {
    userContext.storeUser(response.data);
  }

  return [response, setCredentials];
}

export default useRegister;
