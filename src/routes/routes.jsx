import { Route, Routes } from 'react-router-dom';
import { Home, Login } from '../page';
import Course from '../page/course/course';

function Routers() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/course" element={<Course />} />
    </Routes>
  );
}

export default Routers;
