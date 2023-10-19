import { Route, Routes } from 'react-router-dom';
import { Home, Login } from '../page';

function Routers() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default Routers;
