import { useContext } from 'react';
import { State } from '../context/start';

function useStart() {
  const { token, setToken } = useContext(State);

  return { token, setToken };
}

export default useStart;
