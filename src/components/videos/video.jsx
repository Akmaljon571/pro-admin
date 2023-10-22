import { useContext, useEffect } from 'react';
import { useState } from 'react';
import { Admin, api } from '../../context';
import VideoCRUD from './video-crud';
import VideoCreate from './video-create';
import './video.scss';

function Video() {
  const [courses, setcourses] = useState([]);
  const [course, setCourse] = useState('');
  const [videoCreate, setVideoCreate] = useState(false);
  const { token } = useContext(Admin);
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch(api + '/admin/course', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((re) => re.json())
      .then((data) => {
        setCourse(data.courses[0]?._id);
        setcourses(data.courses);
      });
  }, [token]);

  return (
    <div className="material">
      <select className="course" onChange={(e) => setCourse(e.target.value)}>
        {courses.length
          ? courses.map((e) => (
              <option key={e._id} value={e._id}>
                {e.level}. {e.title}
              </option>
            ))
          : null}
      </select>
      {videoCreate ? (
        <VideoCreate
          setVideoCreate={setVideoCreate}
          course={course}
          count={count}
          setCount={setCount}
        />
      ) : (
        <VideoCRUD course={course} setVideoCreate={setVideoCreate} />
      )}
    </div>
  );
}

export default Video;
