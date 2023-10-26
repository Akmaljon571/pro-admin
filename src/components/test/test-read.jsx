import { Cascader } from 'antd';
import { useContext, useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Admin, api } from '../../context';
import { Button } from '@mui/material';

function TestRead({ course, count, setRead }) {
  //   const [update, setUpdate] = useState(false);
  const { token } = useContext(Admin);
  const [test, setTest] = useState([]);

  useEffect(() => {
    if (course) {
      fetch(api + `/admin/course/${course}/test`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((re) => re.json())
        .then((data) => setTest(data));
    }
  }, [count, course, token]);

  return (
    <div className="test_read">
      <div className="top">
        <h2 className="title">Course Yakuniy testlar</h2>
        <Button onClick={() => setRead(false)} variant="contained">
          <AddIcon /> Add Test
        </Button>
      </div>
      <ul className="list">
        {test.length ? (
          test.map((e) => <li key={e}></li>)
        ) : (
          <Cascader.Panel style={{ marginTop: '0px' }} className="not_fount" />
        )}
      </ul>
    </div>
  );
}

export default TestRead;
