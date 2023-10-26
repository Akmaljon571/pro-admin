import { useContext, useEffect } from 'react';
import { useState } from 'react';
import { Admin, api } from '../../context';
import TestRead from './test-read';
import TestCreate from './test-create';
import './test.scss';

function Test() {
  const [courses, setcourses] = useState([]);
  const [course, setCourse] = useState('');
  const { token } = useContext(Admin);
  const [read, setRead] = useState(true);
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
    <>
      <div className="test">
        <select className="course" onChange={(e) => setCourse(e.target.value)}>
          {courses.length
            ? courses.map((e) => (
                <option key={e._id} value={e._id}>
                  {e.level}. {e.title}
                </option>
              ))
            : null}
        </select>
        {read ? (
          <TestRead
            setCount={setCount}
            course={course}
            count={count}
            setRead={setRead}
          />
        ) : (
          <TestCreate setCount={setCount} setRead={setRead} course={course} />
        )}
      </div>
    </>
  );
}

export default Test;
