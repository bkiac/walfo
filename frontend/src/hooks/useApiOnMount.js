import { useEffect, useReducer, useState } from 'react';

const FetchActionType = Object.freeze({
  REQUEST: 'REQUEST',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
});

function fetchReducer(state, action) {
  switch (action.type) {
    case FetchActionType.REQUEST:
      return {
        ...state,
        isLoading: true,
        hasError: false,
      };
    case FetchActionType.SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasError: false,
        data: action.payload,
      };
    case FetchActionType.FAILURE:
      return {
        ...state,
        isLoading: false,
        hasError: true,
        data: action.payload,
      };

    default:
      throw new Error();
  }
}

function useApiOnMount(apiMethod, data) {
  const [fetchState, dispatch] = useReducer(fetchReducer, {
    isLoading: true,
    hasError: false,
    data: undefined,
  });
  const [numOfCalls, setNumOfCalls] = useState(1);

  function repeatCall() {
    setNumOfCalls(numOfCalls + 1);
  }

  useEffect(() => {
    let isCancelled = false;

    async function sendRequest() {
      dispatch({ type: FetchActionType.REQUEST });
      try {
        const res = await apiMethod(data);
        dispatch({ type: FetchActionType.SUCCESS, payload: res.data });
      } catch (err) {
        dispatch({ type: FetchActionType.FAILURE, payload: err.response.data });
      }
    }

    if (!isCancelled) {
      sendRequest();
    }

    // Cleanup function on unmount
    return () => {
      isCancelled = true;
    };
  }, [data, numOfCalls]);

  return [fetchState, repeatCall];
}

export default useApiOnMount;
