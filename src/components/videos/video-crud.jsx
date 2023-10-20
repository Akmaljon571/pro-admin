import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useContext, useEffect, useState } from 'react';
import { Admin, api } from '../../context';
import DriveFileRenameOutlineTwoToneIcon from '@mui/icons-material/DriveFileRenameOutlineTwoTone';
import player from '../../img/video-player.svg';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import { Card, Popconfirm, message } from 'antd';
import poster from '../../img/login_background.png';

function VideoCRUD({ setVideoCreate, course }) {
  const [videos, setVideos] = useState([]);
  const { token } = useContext(Admin);
  const [videoSrc, setVideoSrc] = useState('');
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (course) {
      fetch(api + `/admin/course/${course}/video`, {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
      })
        .then((re) => re.json())
        .then((data) => setVideos(data.videos.sort((a, b) => a.sequence - b.sequence)));
    }
  }, [token, course, count]);

  const remove = (id) => {
    fetch(api + `/admin/course/${course}/video/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then((re) => re.json())
      .then((data) => {
        console.log(data);
        if (data.ok) {
          message.success('Delete Video');
          setCount(count + 1);
        } else {
          message.error('Error');
        }
      });
  };

  const cancel = (e) => {
    message.error('Click on No');
  };

  const openVideo = async (link) => {
    const vid = document.getElementById('videoElement');
    try {
      const res = await fetch(api + `/admin/file/${link}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      setVideoSrc(link);
      const blob = await res.blob();
      vid.src = URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error in onLoad:', error);
    }
  };

  return (
    <div className="video">
      <div className="top">
        <h2 className="title">Video darslik yuklash</h2>
        <Button onClick={() => setVideoCreate(true)} variant="contained">
          <AddIcon /> Add Video
        </Button>
      </div>
      <ul className="list">
        {videos?.length ? (
          videos.map((e, i) => (
            <li key={i}>
              <img
                onClick={() => openVideo(e?.file_id)}
                src={player}
                alt="Video_player"
              />
              <h4>{e.title}</h4>
              <span>{e.sequence} Dars</span>
              <div>
                <DriveFileRenameOutlineTwoToneIcon className="edit" />
                <Popconfirm
                  title="Videoni o'chirmoqchimisiz"
                  description="Ishonchingiz komilmi?"
                  onConfirm={() => remove(e._id)}
                  onCancel={cancel}
                  okText="Ha"
                  cancelText="Yoq"
                >
                  <DeleteForeverTwoToneIcon />
                </Popconfirm>
              </div>
            </li>
          ))
        ) : (
          <>
            <Card
              style={{
                width: '100%',
                marginTop: 16,
              }}
              className="load"
              loading={true}
            ></Card>
          </>
        )}
      </ul>
      {videoSrc ? (
        <div className='fullScrean'>
          <span onClick={() => setVideoSrc('')}></span>
          <video
            id="videoElement"
            width={500}
            height={500}
            className='fullScrean'
            poster={poster}
            controls
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
        </div>
      ) : null}
    </div>
  );
}

export default VideoCRUD;
