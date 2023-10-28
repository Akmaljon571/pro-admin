import { useContext, useEffect, useState } from 'react';
import { Card, Cascader, Popconfirm, message } from 'antd';
import { Admin, api } from '../../context';
import { Button } from '@mui/material';
import { src } from '../../func/src';
import DriveFileRenameOutlineTwoToneIcon from '@mui/icons-material/DriveFileRenameOutlineTwoTone';
import DeleteForeverTwoToneIcon from '@mui/icons-material/DeleteForeverTwoTone';
import AddIcon from '@mui/icons-material/Add';
import player from '../../img/video-player.svg';
import poster from '../../img/login_background.png';
import { videoLang } from './video.lang';

function VideoCRUD({ setVideoCreate, course }) {
  const [videos, setVideos] = useState([]);
  const { token, l } = useContext(Admin);
  const [videoSrc, setVideoSrc] = useState('');
  const [count, setCount] = useState(0);
  const { setUpdVideo } = useContext(Admin);
  const [notFount, setNotFount] = useState(false);

  useEffect(() => {
    if (course) {
      setNotFount(false);
      fetch(api + `/admin/course/${course}/video`, {
        headers: {
          Authorization: `Bearer: ${token}`,
        },
      })
        .then((re) => re.json())
        .then((data) =>
          setVideos(data.videos.sort((a, b) => a.sequence - b.sequence)),
        );
      setTimeout(() => {
        setNotFount(true);
      }, 2000);
    }
  }, [token, course, count]);

  const remove = (id) => {
    fetch(api + `/admin/course/${course}/video/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
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

  return (
    <div className="video">
      <div className="top">
        <h2 className="title">{videoLang[l].t1}</h2>
        <Button
          onClick={() => {
            setVideoCreate(true);
            setUpdVideo({});
          }}
          variant="contained"
        >
          <AddIcon /> {videoLang[l].t2}
        </Button>
      </div>
      <ul className="list">
        {videos?.length ? (
          videos.map((e, i) => (
            <li key={i}>
              <img
                onClick={() => setVideoSrc(src(e?.file_id))}
                src={player}
                alt="Video_player"
              />
              <h4>{e.title}</h4>
              <span>
                {e.sequence} {videoLang[l].t3}
              </span>
              <div>
                <DriveFileRenameOutlineTwoToneIcon
                  onClick={() => {
                    setUpdVideo(e);
                    setVideoCreate(true);
                  }}
                  className="edit"
                />
                <Popconfirm
                  title={videoLang[l].t4}
                  description={videoLang[l].t5}
                  onConfirm={() => remove(e._id)}
                  onCancel={cancel}
                  okText={videoLang[l].t6}
                  cancelText={videoLang[l].t7}
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
      {videoSrc ? (
        <div className="fullScrean">
          <span onClick={() => setVideoSrc('')}></span>
          <video
            id="videoElement"
            width={500}
            height={500}
            className="fullScrean"
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
