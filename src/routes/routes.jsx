import { Route, Routes } from 'react-router-dom';
import { Home, Login, Course, Video } from '../page';

function Routers() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/course" element={<Course />} />
      <Route path="/video" element={<Video />} />
    </Routes>
  );
}

export default Routers;
