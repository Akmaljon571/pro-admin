import { createContext, useState } from 'react';

export const Admin = createContext();

export const api = 'http://167.71.97.24/api';

export const AdminPriveder = ({ children }) => {
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem('admin_token')) || '',
  );
  const data = { token, setToken };

  return <Admin.Provider value={data}>{children}</Admin.Provider>;
};
