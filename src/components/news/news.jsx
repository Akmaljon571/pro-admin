import { useContext, useEffect, useState } from 'react';
import { Popconfirm, message } from 'antd';
import { Admin, api } from '../../context';
import { Button } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MarkunreadIcon from '@mui/icons-material/Markunread';
import NewsCreate from './news-create';
import AddIcon from '@mui/icons-material/Add';
import './news.scss';

function News() {
  const [news, setNews] = useState([]);
  const { token } = useContext(Admin);
  const [newsCreate, setNewsCreate] = useState(false);
  const [update, setUpdate] = useState({});

  useEffect(() => {
    fetch(api + '/admin/news', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((re) => re.json())
      .then((data) => setNews(data.news));
  }, [token, newsCreate]);

  const del = (id) => {
    message.loading("O'chirilmoqda...");
    fetch(api + `/admin/news/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((re) => re.json())
      .then((data) => {
        if (data.ok) {
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
      .then((data) => setUpdate(data.new));
  };

  return (
    <div className="news">
      {newsCreate ? (
        <NewsCreate setNewsCreate={setNewsCreate} updNews={update} />
      ) : (
        <>
          <div className="top">
            <h2 className="title">Yangiliklar</h2>
            <Button onClick={() => setNewsCreate(true)} variant="contained">
              <AddIcon /> Add Video
            </Button>
          </div>
          <ul className="list">
            {news.length
              ? news.map((e, i) => (
                  <li onClick={() => setUpdate(e)} key={i}>
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
    </div>
  );
}

export default News;
