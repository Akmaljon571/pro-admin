import React, { useContext, useEffect, useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button } from 'antd';
import bg from '../../img/logo.svg';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { Admin } from '../../context';
import './layout.scss';

function LayoutPage({ children }) {
  const { Header, Sider, Content } = Layout;
  const [collapsed, setCollapsed] = useState(false);
  const { token, setToken } = useContext(Admin);
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
          <h2 className="-h2">LinCor</h2>
        </Link>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={[
            path === '/' ? '1' : path === '/credit' ? '2' : '3',
          ]}
          items={[
            {
              key: '1',
              icon: <HomeOutlined />,
              label: 'Dashboard',
              onClick: () => navigate('/'),
            },
            {
              key: '2',
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-cash-coin"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M11 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm5-4a5 5 0 1 1-10 0 5 5 0 0 1 10 0z"
                  />
                  <path d="M9.438 11.944c.047.596.518 1.06 1.363 1.116v.44h.375v-.443c.875-.061 1.386-.529 1.386-1.207 0-.618-.39-.936-1.09-1.1l-.296-.07v-1.2c.376.043.614.248.671.532h.658c-.047-.575-.54-1.024-1.329-1.073V8.5h-.375v.45c-.747.073-1.255.522-1.255 1.158 0 .562.378.92 1.007 1.066l.248.061v1.272c-.384-.058-.639-.27-.696-.563h-.668zm1.36-1.354c-.369-.085-.569-.26-.569-.522 0-.294.216-.514.572-.578v1.1h-.003zm.432.746c.449.104.655.272.655.569 0 .339-.257.571-.709.614v-1.195l.054.012z" />
                  <path d="M1 0a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h4.083c.058-.344.145-.678.258-1H3a2 2 0 0 0-2-2V3a2 2 0 0 0 2-2h10a2 2 0 0 0 2 2v3.528c.38.34.717.728 1 1.154V1a1 1 0 0 0-1-1H1z" />
                  <path d="M9.998 5.083 10 5a2 2 0 1 0-3.132 1.65 5.982 5.982 0 0 1 3.13-1.567z" />
                </svg>
              ),
              label: 'Kredit',
              onClick: () => {
                navigate('/credit');
              },
            },
            {
              key: '3',
              icon: <AssignmentIcon />,
              label: 'Arizalar',
              onClick: () => {
                navigate('/petitions');
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
          <span className="footer-text">Chiqish</span>
        </footer>
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff' }}>
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
        </Header>
        <Content>
          <main className="main">{children}</main>
        </Content>
      </Layout>
    </Layout>
  );
}

export default LayoutPage;
