import { createContext, useState } from 'react';

export const Admin = createContext();

export const api = 'https://api.lincor.uz';

export const AdminPriveder = ({ children }) => {
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem('admin_token')) || '',
  );
  const [updVideo, setUpdVideo] = useState([]);
  const [l, setLang] = useState('uz');

  const data = { token, setToken, updVideo, setUpdVideo, l, setLang };
  return <Admin.Provider value={data}>{children}</Admin.Provider>;
};
