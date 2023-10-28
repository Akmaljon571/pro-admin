import { Cascader, Popconfirm, message } from 'antd';
import { useContext, useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Admin, api } from '../../context';
import { Button } from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TestUpdate from './test-update';
import { testLang } from './test.lang';

function TestRead({ course, count, setCount, setRead }) {
  const [update, setUpdate] = useState({ ok: false });
  const { token, l } = useContext(Admin);
  const [test, setTest] = useState([]);

  useEffect(() => {
    if (course) {
      fetch(api + `/admin/course/${course}/test`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((re) => re.json())
        .then((data) => setTest(data.tests));
    }
  }, [count, course, token]);

  const del = (id) => {
    message.loading("Ma'lumot o'chirilmoqda");
    fetch(api + `/admin/course/${course}/test/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((re) => re.json())
      .then(() => {
        message.destroy();
        message.success("Test to'lliq ochirildi");
        setCount(count + 1);
      });
  };

  const cancel = () => {
    message.error('Click on No');
  };

  const edit = (id) => {
    message.loading('Loading...');
    fetch(api + `/admin/course/${course}/test/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((re) => re.json())
      .then((data) => {
        message.destroy();
        setUpdate(data);
      });
  };

  return (
    <div className="test_read">
      <div className="top">
        <h2 className="title">{testLang[l].t1}</h2>
        <Button onClick={() => setRead(false)} variant="contained">
          <AddIcon /> {testLang[l].t2}
        </Button>
      </div>
      <ul className="list">
        {test.length ? (
          test.map((e, i) => (
            <li key={i}>
              <span className="workbook-get">
                <QuizIcon />
              </span>
              <h4>{e.title}</h4>
              <span style={{ maxWidth: '250px' }}>{e.description}</span>
              <span>{e.question_count}20 ta</span>
              <div>
                <VisibilityIcon onClick={() => edit(e._id)} className="see" />
                <Popconfirm
                  title={testLang[l].t3}
                  description={testLang[l].t4}
                  onConfirm={() => del(e._id)}
                  onCancel={cancel}
                  okText={testLang[l].t5}
                  cancelText={testLang[l].t6}
                >
                  <DeleteForeverIcon
                    style={{ color: 'red', cursor: 'pointer' }}
                  />
                </Popconfirm>
              </div>
            </li>
          ))
        ) : (
          <Cascader.Panel style={{ marginTop: '0px' }} className="not_fount" />
        )}
      </ul>
      {update.ok ? (
        <TestUpdate
          course={course}
          test={update}
          setCount={setCount}
          setUpdate={setUpdate}
        />
      ) : null}
    </div>
  );
}

export default TestRead;
