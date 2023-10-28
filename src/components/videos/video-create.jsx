import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import TheatersIcon from '@mui/icons-material/Theaters';
import { Button } from '@mui/material';
import { Admin, api } from '../../context';
import { useContext, useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import { src } from '../../func/src';
import './video.scss';
import { videoLang } from './video.lang';

function VideoCreate({ setVideoCreate, course, count, setCount }) {
  const { token, l } = useContext(Admin);
  const [vid, setVid] = useState('');
  const [video, setVideo] = useState('');
  const [messageApi, contextHolder] = message.useMessage();
  const [item, setItem] = useState([]);
  const { updVideo } = useContext(Admin);
  const title = useRef();
  const text = useRef();
  const seq = useRef();

  useEffect(() => {
    if (!updVideo?._id) {
      fetch(api + `/admin/course/${course}/video`, {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
      })
        .then((re) => re.json())
        .then((data) => {
          if (data.ok) {
            const arr = [];
            for (let i = 1; i < 50; i++) {
              if (!data.videos.find((e) => e.sequence === i)) {
                arr.push(i);
              }
            }
            setItem(arr);
          }
        });
    } else {
      const arr = [];
      for (let i = 1; i < 50; i++) {
        arr.push(i);
      }
      setItem(arr);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course]);

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
    if (updVideo?._id) {
      const obj = {
        title: title.current?.value ? title.current?.value : updVideo.title,
        description: text.current?.value
          ? text.current?.value
          : updVideo.description,
        sequence: Number(seq.current?.value)
          ? seq.current?.value
          : updVideo.sequence,
        file_id: video ? video : updVideo.file_id,
      };

      messageApi.open({
        type: 'loading',
        content: "Ma'lumotlar tekshirilmoqda",
        duration: 0,
      });

      fetch(api + `/admin/course/${course}/video/${updVideo._id}`, {
        method: 'PUT',
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
            setVideoCreate(false);
          } else {
            showError(data.message);
          }
        });
    } else {
      const obj = {
        title: title.current?.value,
        description: text.current?.value,
        sequence: seq.current?.value,
        file_id: video,
      };
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
    }
  };

  return (
    <div className="video-create">
      {contextHolder}
      <div className="title">
        <div className="top">
          <h3>{videoLang[l].t8}</h3>
          <Button onClick={() => setVideoCreate(false)} variant="contained">
            <ArrowBackIcon />
          </Button>
        </div>
        <input
          defaultValue={updVideo?.title}
          placeholder={videoLang[l].t8}
          ref={title}
          type="text"
        />
      </div>
      <div className="level">
        <h3>
          {videoLang[l].t9}
          {updVideo?.sequence
            ? `. ${videoLang[l].t10} ${updVideo?.sequence}-${videoLang[l].t11}`
            : ''}
        </h3>
        <select ref={seq}>
          <option type="others" hidden>
            {videoLang[l].t12}
          </option>
          {item.map((e) => (
            <option key={e} value={e}>
              {e}-{videoLang[l].t11}
            </option>
          ))}
        </select>
      </div>
      <div className="yukla">
        <h2>{videoLang[l].t13}</h2>
        <hr />
        <label>
          {vid || updVideo?.file_id ? (
            <video controls src={src(updVideo.file_id) || vid}></video>
          ) : (
            <>
              <TheatersIcon />
              <p>{videoLang[l].t14}</p>
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
          {videoLang[l].t15}
        </Button>
      </div>
      <div className="comment">
        <h2>{videoLang[l].t16}</h2>
        <hr />
        <textarea
          defaultValue={updVideo.description}
          ref={text}
          cols="30"
          rows="10"
          placeholder="Izoh"
        ></textarea>
      </div>
      <div className="btns">
        <Button onClick={() => setVideoCreate(false)} variant="outlined">
          {videoLang[l].t17}
        </Button>
        <Button onClick={sendData} variant="contained">
          {updVideo?._id ? videoLang[l].t18 : videoLang[l].t19}
        </Button>
      </div>
    </div>
  );
}

export default VideoCreate;
