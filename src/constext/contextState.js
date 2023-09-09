import React, { memo } from 'react';
import Component       from './userContext'

const contextState = memo((props) => {

  const CloseSession = (history) => {
    localStorage.removeItem('token');
    history.push("/");
  };

  return (
    <Component.Provider value={CloseSession}>
      {props.children}
    </Component.Provider>
  );
});

export default contextState;