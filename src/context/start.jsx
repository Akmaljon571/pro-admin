import { createContext, useState } from 'react';

export const State = createContext();

export const api = 'http://localhost:1000';

export const StatePriveder = ({ children }) => {
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem('access_token')) || {},
  );

  const data = { token, setToken };

  return <State.Provider value={data}>{children}</State.Provider>;
};
