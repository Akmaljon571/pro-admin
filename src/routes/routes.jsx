import { Route, Routes } from 'react-router-dom';
import {
  Home,
  Login,
  Course,
  Video,
  Users,
  Workbook,
  Test,
  News,
  Take,
} from '../page';

function Routers() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/course" element={<Course />} />
      <Route path="/video" element={<Video />} />
      <Route path="/users" element={<Users />} />
      <Route path="/workbook" element={<Workbook />} />
      <Route path="/test" element={<Test />} />
      <Route path="/take" element={<Take />} />
      <Route path="/news" element={<News />} />
    </Routes>
  );
}

export default Routers;
