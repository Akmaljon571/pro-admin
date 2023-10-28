import { useContext, useState } from 'react';
import { useEffect } from 'react';
import { Admin, api } from '../../context';
import { Cascader, Select, message } from 'antd';
import { src } from '../../func/src';
import { Button } from '@mui/material';
import summa from '../../func/summa';
import tell from '../../func/tell';
import './take.scss';
import { takeLang } from './take.lang';

function Take() {
  const { token, l } = useContext(Admin);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState({});
  const [course, setCourse] = useState({});

  useEffect(() => {
    fetch(api + '/admin/user?role=Customer&status=Active', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((re) => re.json())
      .then((data) => {
        for (let i = 0; i < data.users?.length; i++) {
          data.users[i].value = data.users[i]._id;
          data.users[i].label = tell(data.users[i].phone_number);
        }
        setUsers(data.users);
      });
    fetch(api + '/admin/course', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((re) => re.json())
      .then((data) => {
        for (let i = 0; i < data.courses?.length; i++) {
          data.courses[i].value = data.courses[i]._id;
          data.courses[i].label = data.courses[i].title;
        }
        setCourses(data.courses);
      });
  }, [token]);

  const selectUser = (e) => {
    fetch(api + '/admin/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((re) => re.json())
      .then((data) => {
        if (data.ok) {
          setUser(data.users.find((el) => el._id === e));
        }
      });
  };

  const selectCourse = (e) => {
    fetch(api + `/admin/course/${e}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((re) => re.json())
      .then((data) => setCourse(data.course));
  };

  const sendData = () => {
    if (user?._id && course?._id) {
      message.loading("Ma'lumot tekshirilmoqda");
      fetch(api + `/admin/user/${user?._id}/course/${course?._id}/take`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((re) => re.json())
        .then((data) => {
          if (data.ok) {
            message.destroy();
            message.success('Course user uchun ochiq');
            setCourse({});
            setUser({});
          } else {
            message.destroy();
            message.error("Ma'lumotda hatolik");
          }
        });
    } else {
      message.error("Ma'lumotlarni tanlang");
    }
  };

  return (
    <div className="take">
      <h1>{takeLang[l].take}</h1>
      <div className="top">
        <Select
          showSearch
          style={{
            width: 200,
          }}
          placeholder="Search to User phone"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? '').includes(input)
          }
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '')
              .toLowerCase()
              .localeCompare((optionB?.label ?? '').toLowerCase())
          }
          options={users}
          onChange={selectUser}
        />
        <Select
          showSearch
          style={{
            width: 200,
          }}
          placeholder={takeLang[l].t2}
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? '').includes(input)
          }
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '')
              .toLowerCase()
              .localeCompare((optionB?.label ?? '').toLowerCase())
          }
          options={courses}
          onChange={selectCourse}
        />
      </div>
      <div className="bottom">
        {user?._id ? (
          <div className="user">
            <img src={src(user?.image)} alt="Loading" />
            <div className="list-bottom">
              <h3>{user.first_name}</h3>
              <p>{user.last_name}</p>
              <p>{tell(user.phone_number)}</p>
              <span>{user.email}</span>
              <span>{takeLang[l].t3}: {user.total_course} {takeLang[l].ta}</span>
              <span>{takeLang[l].t4}: {user.total_amount} {takeLang[l].som}</span>
            </div>
          </div>
        ) : (
          <Cascader.Panel className="defualt" />
        )}
        {course?._id ? (
          <div className="course">
            <img src={src(course?.image)} alt="Loading" />
            <div className="list-bottom">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <span>{course.videos?.length} {takeLang[l].t5}</span>
              <div>{summa(course.price)}{takeLang[l].som}</div>
            </div>
          </div>
        ) : (
          <Cascader.Panel className="defualt" />
        )}
      </div>
      <Button onClick={sendData} variant="contained">
        {takeLang[l].t6}
      </Button>
    </div>
  );
}

export default Take;
