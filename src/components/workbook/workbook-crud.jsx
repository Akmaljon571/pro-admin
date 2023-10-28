import AddIcon from '@mui/icons-material/Add';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import ImageSearchTwoToneIcon from '@mui/icons-material/ImageSearchTwoTone';
import poster from '../../img/login_background.png';
import { Button } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { Admin, api } from '../../context';
import { Card, Cascader, Popconfirm, message } from 'antd';
import { src } from '../../func/src';
import { bookLang } from './workbook.lang';

function WorkbookCRUD({ setWorkbookCreate, course }) {
  const [workbooks, setWorkbooks] = useState([]);
  const { token, l } = useContext(Admin);
  const [workbookSrc, setWorkbookSrc] = useState('');
  const [count, setCount] = useState(0);
  const [notFount, setNotFount] = useState(false);

  useEffect(() => {
    if (course) {
      setNotFount(false);
      fetch(api + `/admin/course/${course}/workbook`, {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
      })
        .then((re) => re.json())
        .then((data) =>
          setWorkbooks(data.workbooks.sort((a, b) => a.sequence - b.sequence)),
        );
      setTimeout(() => {
        setNotFount(true);
      }, 2000);
    }
  }, [token, course, count]);

  const remove = (id) => {
    fetch(api + `/admin/course/${course}/workbook/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((re) => re.json())
      .then((data) => {
        if (data.ok) {
          message.success('Delete workbook');
          setCount(count + 1);
        } else {
          message.error('Error');
        }
      });
  };

  const cancel = () => {
    message.error('Click on No');
  };

  return (
    <div className="workbook">
      <div className="top">
        <h2 className="title">{bookLang[l].t1}</h2>
        <Button onClick={() => setWorkbookCreate(true)} variant="contained">
          <AddIcon /> {bookLang[l].t2}
        </Button>
      </div>
      <ul className="list">
        {workbooks?.length ? (
          workbooks.map((e, i) => (
            <li key={i}>
              <span
                className="workbook-get"
                onClick={() => window.open(src(e?.file_id))}
              >
                <ImageSearchTwoToneIcon />
              </span>
              <h4>{e.title}</h4>
              <span>
                {e.sequence} {bookLang[l].t3}
              </span>
              <div>
                <Popconfirm
                  title={bookLang[l].t4}
                  description={bookLang[l].t5}
                  onConfirm={() => remove(e._id)}
                  onCancel={cancel}
                  okText={bookLang[l].t6}
                  cancelText={bookLang[l].t7}
                >
                  <DeleteForeverTwoToneIcon />
                </Popconfirm>
              </div>
            </li>
          ))
        ) : (
          <>
            {notFount ? (
              <Cascader.Panel
                style={{ marginTop: '0px' }}
                className="not_fount"
              />
            ) : (
              <Card
                style={{
                  width: '100%',
                  marginTop: 16,
                }}
                className="load"
                loading={true}
              ></Card>
            )}
          </>
        )}
      </ul>
      {workbookSrc ? (
        <div className="fullScrean">
          <span onClick={() => setWorkbookSrc('')}></span>
          <workbook
            id="workbookElement"
            width={500}
            height={500}
            className="fullScrean"
            poster={poster}
            controls
          >
            <source src={workbookSrc} type="workbook/mp4" />
          </workbook>
        </div>
      ) : null}
    </div>
  );
}

export default WorkbookCRUD;
