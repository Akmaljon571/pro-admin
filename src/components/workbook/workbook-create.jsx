import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@mui/material';
import { Admin, api } from '../../context';
import { useContext, useRef, useState } from 'react';
import MenuBookTwoToneIcon from '@mui/icons-material/MenuBookTwoTone';
import { message } from 'antd';
import { bookLang } from './workbook.lang';

function WorkbookCreate({ setWorkbookCreate, course, count, setCount }) {
  const { token, l } = useContext(Admin);
  const [vid, setVid] = useState('');
  const [workbook, setWorkbook] = useState('');
  const [messageApi, contextHolder] = message.useMessage();
  const title = useRef();

  const showError = (errorMessage) => {
    messageApi.destroy();
    messageApi.open({
      type: 'error',
      content: errorMessage,
      duration: 2.5,
    });
    setTimeout(messageApi.destroy, 2500);
  };

  const sendWorkbook = (e) => {
    const formData = new FormData();
    formData.append('workbook', e.target.files[0]);

    messageApi.open({
      type: 'loading',
      content: 'Action in progress..',
      duration: 0,
    });

    fetch(api + '/customer/file', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((re) => re.json())
      .then((data) => {
        if (data.ok) {
          messageApi.destroy();
          messageApi.open({
            type: 'success',
            content: 'workbook saqlandi',
            duration: 0,
          });
          setTimeout(messageApi.destroy, 2500);
          setVid(URL.createObjectURL(e.target.files[0]));
          setWorkbook(data.files.workbook);
        } else {
          showError("Hato Ma'lumot");
        }
      })
      .catch(() => showError('Fail Fetch'));
  };

  const clear = () => {
    setVid('');
    setWorkbook('');
  };

  const sendData = () => {
    const obj = {
      title: title.current?.value,
      file_id: workbook,
    };
    messageApi.open({
      type: 'loading',
      content: 'Action in progress..',
      duration: 0,
    });
    fetch(api + `/admin/course/${course}/workbook`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    })
      .then((re) => re.json())
      .then((data) => {
        if (data?.ok) {
          setCount(count + 1);
          setWorkbookCreate(false);
        } else {
          showError(data.message);
        }
      });
  };

  return (
    <div className="workbook-create">
      {contextHolder}
      <div className="title">
        <div className="top">
          <h2>{bookLang[l].t8}</h2>
          <Button onClick={() => setWorkbookCreate(false)} variant="contained">
            <ArrowBackIcon />
          </Button>
        </div>
        <hr />
        <input placeholder="Sarlavha" ref={title} type="text" />
      </div>
      <div className="yukla">
        <h2>{bookLang[l].t9}</h2>
        <hr />
        <label>
          {vid ? (
            <a href={vid} target="_blank" rel="noreferrer">
              {bookLang[l].t10}
            </a>
          ) : (
            <>
              <MenuBookTwoToneIcon />
              <p>{bookLang[l].t11}</p>
            </>
          )}
          <input
            onChange={sendWorkbook}
            accept=".doc, .docx, .pdf"
            className="none"
            type="file"
          />
        </label>
        <Button onClick={clear} variant="contained">
          {bookLang[l].t12}
        </Button>
      </div>
      <div className="btns">
        <Button onClick={() => setWorkbookCreate(false)} variant="outlined">
          {bookLang[l].t13}
        </Button>
        <Button onClick={sendData} variant="contained">
          {bookLang[l].t14}
        </Button>
      </div>
    </div>
  );
}

export default WorkbookCreate;
