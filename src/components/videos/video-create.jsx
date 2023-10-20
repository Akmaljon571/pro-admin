import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TheatersIcon from '@mui/icons-material/Theaters';
import { Button } from '@mui/material';
import { Admin, api } from '../../context';
import { useContext, useRef, useState } from 'react';
import { message } from 'antd';
import './video.scss';

function VideoCreate({ setVideoCreate, course, count, setCount }) {
  const { token } = useContext(Admin);
  const [vid, setVid] = useState('');
  const [video, setVideo] = useState('');
  const [messageApi, contextHolder] = message.useMessage();
  const title = useRef();
  const text = useRef();
  const seq = useRef();

  const item = [];
  for (let i = 1; i < 50; i++) {
    item.push(i);
  }

  const showError = (errorMessage) => {
    messageApi.destroy();
    messageApi.open({
      type: 'error',
      content: errorMessage,
      duration: 2.5,
    });
    setTimeout(messageApi.destroy, 2500);
  };

  const sendVideo = (e) => {
    const formData = new FormData();
    formData.append('video', e.target.files[0]);

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
            content: 'Video saqlandi',
            duration: 0,
          });
          setTimeout(messageApi.destroy, 2500);
          setVid(URL.createObjectURL(e.target.files[0]));
          setVideo(data.files.video);
        } else {
          showError("Hato Ma'lumot");
        }
      })
      .catch(() => showError('Fail Fetch'));
  };

  const clear = () => {
    setVid('');
    setVideo('');
  };

  const sendData = () => {
    const obj = {
      title: title.current?.value,
      description: text.current?.value,
      sequence: seq.current?.value,
      file_id: video,
    };
    console.log(video);
    messageApi.open({
      type: 'loading',
      content: 'Action in progress..',
      duration: 0,
    });
    console.log(obj);
    fetch(api + `/admin/course/${course}/video`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(obj),
    })
      .then((re) => re.json())
      .then((data) => {
        console.log(data);
        if (data?.ok) {
          setCount(count + 1);
          setVideoCreate(false);
        } else {
          showError(data.message);
        }
      });
  };

  return (
    <div className="video-create">
      {contextHolder}
      <div className="title">
        <div className="top">
          <h3>Video Sarlavhasi</h3>
          <Button onClick={() => setVideoCreate(false)} variant="contained">
            <ArrowBackIcon />
          </Button>
        </div>
        <input placeholder="Sarlavha" ref={title} type="text" />
      </div>
      <div className="level">
        <h3>Video Ketma-ketligi</h3>
        <select ref={seq}>
          {item.map((e) => (
            <option key={e} value={e}>
              {e}-dars
            </option>
          ))}
        </select>
      </div>
      <div className="yukla">
        <h2>Video yuklash</h2>
        <hr />
        <label>
          {vid ? (
            <video controls src={vid}></video>
          ) : (
            <>
              <TheatersIcon />
              <p>Video kursni yuklang</p>
            </>
          )}
          <input
            onChange={sendVideo}
            accept="video/*"
            className="none"
            type="file"
          />
        </label>
        <Button onClick={clear} variant="contained">
          Videoni o'chirish
        </Button>
      </div>
      <div className="comment">
        <h2>Video comment</h2>
        <hr />
        <textarea ref={text} cols="30" rows="10" placeholder="Izoh"></textarea>
      </div>
      <div className="btns">
        <Button onClick={() => setVideoCreate(false)} variant="outlined">
          Ortga Qaytish
        </Button>
        <Button onClick={sendData} variant="contained">
          Videoni joylash
        </Button>
      </div>
    </div>
  );
}

export default VideoCreate;
