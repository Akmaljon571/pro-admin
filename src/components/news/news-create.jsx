import { useContext, useRef, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ImageIcon from '@mui/icons-material/Image';
import { Button } from '@mui/material';
import { src } from '../../func/src';
import { Admin, api } from '../../context';
import { message } from 'antd';

function NewsCreate({ setNewsCreate, updNews = {} }) {
  const title = useRef();
  const text = useRef();
  const { token } = useContext(Admin);
  const [img, setImg] = useState('');

  const sendData = () => {
    if (updNews?.title) {
      const newsData = {
        title: title.current.value ? title.current.value : updNews.title,
        description: text.current.value ? text.current.value : updNews.description,
        image: img || updNews.image,
      };
  
        message.loading("Ma'lumot tekshirilmoqda...");
        fetch(api + `/admin/news/${updNews._id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newsData),
        })
          .then((re) => re.json())
          .then((data) => {
            if (data) {
              message.destroy();
              message.success("Ma'lumot o'zgardi");
              setNewsCreate(false);
            } else {
              message.destroy();
              message.error("Ma'lumot hato");
            }
          });
    } else {
      const newsData = {
        title: title.current.value,
        description: text.current.value,
        image: img,
      };
  
      if (title.current.value && text.current.value) {
        message.loading("Ma'lumot tekshirilmoqda...");
        fetch(api + '/admin/news', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newsData),
        })
          .then((re) => re.json())
          .then((data) => {
            if (data) {
              message.destroy();
              message.success("Ma'lumot saqlandi");
              setNewsCreate(false);
            } else {
              message.destroy();
              message.error("Ma'lumot hato");
            }
          });
      }
    }
  };

  const sendImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', e.target.files[0]);
      message.loading("Rasm jo'natilmoqda...");

      fetch(api + '/admin/file', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
        .then((re) => re.json())
        .then((data) => {
          if (data.ok) {
            message.destroy();
            message.success('Rasm joylandi');
            setImg(data.files.image);
          } else {
            message.destroy();
            message.error("Ma'lumot Hato");
          }
        });
    } else {
      message.destroy();
      message.error("Ma'lumot Hato");
    }
  };

  return (
    <div className="news-create">
      <div className="title">
        <div className="top">
          <h3>News Sarlavhasi</h3>
          <Button onClick={() => setNewsCreate(false)} variant="contained">
            <ArrowBackIcon />
          </Button>
        </div>
        <input
          defaultValue={updNews?.title}
          placeholder="Sarlavha"
          ref={title}
          type="text"
        />
      </div>
      <div className="yukla">
        <h3>News Rasmi (Ixtiyoriy)</h3>
        <label>
          {img || updNews?.image ? (
            <img src={src(img || updNews?.image)} alt="" />
          ) : (
            <>
              <ImageIcon />
              <p>News uchun Rasm yuklang</p>
            </>
          )}
          <input
            onChange={sendImage}
            accept="image/x-png,image/gif,image/jpeg"
            className="none"
            type="file"
          />
        </label>
      </div>
      <div className="comment">
        <h3>News comment</h3>
        <textarea
          defaultValue={updNews?.description}
          ref={text}
          cols="30"
          rows="10"
          placeholder="Izoh"
        ></textarea>
      </div>
      <div className="btns">
        <Button onClick={() => setNewsCreate(false)} variant="outlined">
          Ortga Qaytish
        </Button>
        <Button onClick={sendData} variant="contained">
          {updNews?._id ? "newsni o'zgartirish" : 'newsni joylash'}
        </Button>
      </div>
    </div>
  );
}

export default NewsCreate;
