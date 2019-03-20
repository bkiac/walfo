import { useEffect, useReducer, useRef, useState } from 'react';

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

function useApiCallback(apiMethod) {
  const isInitialMount = useRef(true);
  const [data, setData] = useState();
  const [fetchState, dispatch] = useReducer(fetchReducer, {
    isLoading: false,
    hasError: false,
    data: undefined,
  });

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

    // Send request if component is not currently unmounting
    // console.log({ isCancelled, isInitialMount: isInitialMount.current, shouldFetchOnInit });
    if (!isCancelled && !isInitialMount.current) {
      sendRequest();
    }

    if (isInitialMount.current) {
      isInitialMount.current = false;
    }

    // Cleanup function on unmount
    return () => {
      isCancelled = true;
    };
  }, [data]);

  return [fetchState, setData];
}

export default useApiCallback;
