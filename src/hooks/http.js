import { useReducer, useCallback } from 'react';

const initialState = {
  loading: false,
  error: null,
  data: null,
  reqExtra: null,
  reqIdentifier: null
};

const httpStateReducer = (httpPrevState, action) => {
  switch (action.type) {
    case 'SEND':
      return { ...httpPrevState, loading: true, data: null, reqIdentifier: action.reqIdentifier  }
    case 'RESPONSE':
      return { ...httpPrevState, loading: false, data: action.data, reqExtra: action.reqExtra }
    case 'ERROR':
      return { loading: false, error: action.errorMessage }
    case 'CLEAR':
      return initialState;
    default:
      throw new Error('Should not go there');
  }
}

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpStateReducer, initialState);

  const clearError = useCallback(() => {
    dispatchHttp({type: 'CLEAR'});
  }, []);

  const sendRequest = useCallback((url, method, body, extra, reqIdentifier) => {
    dispatchHttp({ type: 'SEND', reqIdentifier: reqIdentifier });
    fetch(url, {
      method: method,
      body: body,
      headers: {"Content-type": "application/json"}
    }).then(response => response.json())
      .then(responseData => {
        dispatchHttp({ type: 'RESPONSE', data: responseData, reqExtra: extra });
      }).catch(error => {
        dispatchHttp({ type: 'ERROR', errorMessage: 'Oops! Something went wrong!' });
      });
  }, []); 

  return {
    loading: httpState.loading,
    error: httpState.error,
    data: httpState.data,
    sendRequest: sendRequest,
    reqExtra: httpState.reqExtra,
    reqIdentifier: httpState.reqIdentifier,
    clearError: clearError
  }
}

export default useHttp;