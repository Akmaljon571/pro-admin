import { useContext, useEffect, useState } from 'react';
import { Popconfirm, message } from 'antd';
import { Admin, api } from '../../context';
import { Button } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MarkunreadIcon from '@mui/icons-material/Markunread';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import NewsCreate from './news-create';
import AddIcon from '@mui/icons-material/Add';
import './news.scss';
import NewsModal from './news-modal';

function News() {
  const [news, setNews] = useState([]);
  const { token } = useContext(Admin);
  const [newsCreate, setNewsCreate] = useState(false);
  const [update, setUpdate] = useState({ ok: false });
  const [edit, setEdit] = useState({});
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetch(api + '/admin/news', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((re) => re.json())
      .then((data) => setNews(data.news));
  }, [token, newsCreate, count]);

  const del = (id) => {
    message.loading("O'chirilmoqda...");
    fetch(api + `/admin/news/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((re) => re.json())
      .then((data) => {
        if (data.ok) {
          setCount(count + 1);
          message.destroy();
          message.success("Ma'lumot o'chirildi");
        } else {
          message.destroy();
          message.error("Ma'lumot Hato");
        }
      });
  };

  const see = (id) => {
    message.loading('Loading...');
    fetch(api + `/admin/news/${id}`, {
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

  const upd = (id) => {
    message.loading('Loading...');
    fetch(api + `/admin/news/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((re) => re.json())
      .then((data) => {
        message.destroy();
        setEdit(data.news);
        setNewsCreate(true);
      });
  };

  return (
    <div className="news">
      {newsCreate ? (
        <NewsCreate setNewsCreate={setNewsCreate} updNews={edit} />
      ) : (
        <>
          <div className="top">
            <h2 className="title">Yangiliklar</h2>
            <Button
              onClick={() => {
                setNewsCreate(true);
                setEdit({});
              }}
              variant="contained"
            >
              <AddIcon /> Add Video
            </Button>
          </div>
          <ul className="list">
            {news.length
              ? news.map((e, i) => (
                  <li onClick={() => setUpdate({ ok: false })} key={i}>
                    <span className="workbook-get">
                      <MarkunreadIcon />
                    </span>
                    <h4>{e.title}</h4>
                    <p>
                      {new Date(e.created_at).toLocaleString().split(', ')[0]}
                    </p>
                    <div>
                      <VisibilityIcon
                        onClick={() => see(e._id)}
                        className="see"
                      />
                      <BorderColorIcon
                        onClick={() => upd(e._id)}
                        className="edit"
                      />
                      <Popconfirm
                        title="News o'chiriladi"
                        description="Ishonchingiz komilmi ?"
                        onConfirm={() => del(e._id)}
                        okText="Ha"
                        cancelText="Yoq"
                      >
                        <DeleteForeverIcon
                          style={{ color: 'red', cursor: 'pointer' }}
                        />
                      </Popconfirm>
                    </div>
                  </li>
                ))
              : null}
          </ul>
        </>
      )}
      {update.ok ? <NewsModal update={update} /> : null}
    </div>
  );
}

export default News;
