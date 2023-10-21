import { Route, Routes } from 'react-router-dom';
import { Home, Login, Course, Video, Users, Workbook } from '../page';

function Routers() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/course" element={<Course />} />
      <Route path="/video" element={<Video />} />
      <Route path="/users" element={<Users />} />
      <Route path="/workbook" element={<Workbook />} />
    </Routes>
  );
}

export default Routers;
