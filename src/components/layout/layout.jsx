import { useContext, useEffect, useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Admin } from '../../context';
import GroupIcon from '@mui/icons-material/Group';
import PlayLessonIcon from '@mui/icons-material/PlayLesson';
import PhotoAlbumIcon from '@mui/icons-material/PhotoAlbum';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import QuizIcon from '@mui/icons-material/Quiz';
import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import bg from '../../img/logo.svg';
import { language } from './laylout.lang';
import './layout.scss';

function LayoutPage({ children }) {
  const { Header, Sider, Content } = Layout;
  const [collapsed, setCollapsed] = useState(false);
  const { token, setToken, l, setLang } = useContext(Admin);
  const path = useLocation().pathname;
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const chiqish = () => {
    setToken('');
    localStorage.clear();
  };

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <Link className="logo" to={'/'}>
          <img src={bg} alt="Company Logo" />
        </Link>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[
            path === '/'
              ? '1'
              : path === '/users'
                ? '2'
                : path === '/course'
                  ? '3'
                  : path === '/video'
                    ? '4'
                    : path === '/workbook'
                      ? '5'
                      : path === '/test'
                        ? '6'
                        : '7'
          ]}
          items={[
            {
              key: '1',
              icon: <HomeOutlined />,
              label: language[l].t1,
              onClick: () => navigate('/'),
            },
            {
              key: '2',
              icon: <GroupIcon style={{ fontSize: '16px' }} />,
              label: language[l].t2,
              onClick: () => {
                navigate('/users');
              },
            },
            {
              key: '3',
              icon: <PhotoAlbumIcon style={{ fontSize: '16px' }} />,
              label: language[l].t3,
              onClick: () => {
                navigate('/course');
              },
            },
            {
              key: '4',
              icon: <PlayLessonIcon style={{ fontSize: '16px' }} />,
              label: language[l].t4,
              onClick: () => {
                navigate('/video');
              },
            },
            {
              key: '5',
              icon: <AutoStoriesIcon style={{ fontSize: '16px' }} />,
              label: language[l].t5,
              onClick: () => {
                navigate('/workbook');
              },
            },
            {
              key: '6',
              icon: <QuizIcon style={{ fontSize: '16px' }} />,
              label: language[l].t6,
              onClick: () => {
                navigate('/test');
              },
            },
            {
              key: '7',
              icon: <MapsUgcIcon style={{ fontSize: '16px' }} />,
              label: language[l].t8,
              onClick: () => {
                navigate('/news');
              },
            },
          ]}
        />
        <footer onClick={chiqish} className="footer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="currentColor"
            className="bi bi-box-arrow-left"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z"
            />
            <path
              fillRule="evenodd"
              d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z"
            />
          </svg>
          <span className="footer-text">{language[l].t9}</span>
        </footer>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingRight: '25px',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <select className="select" onChange={(e) => setLang(e.target.value)}>
            <option value="uz">Uzb</option>
            <option value="kr">Kor</option>
          </select>
        </Header>
        <Content>
          <main className="main">{children}</main>
        </Content>
      </Layout>
    </Layout>
  );
}

export default LayoutPage;
