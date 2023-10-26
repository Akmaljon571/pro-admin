import { useLocation } from 'react-router-dom';
import { Layout } from './components';
import Routers from './routes/routes';
import './App.scss';

function App() {
  const path = useLocation().pathname;
  return (
    <>
      {path === '/' ||
      path === '/users' ||
      path === '/course' ||
      path === '/video' ||
      path === '/workbook' ||
      path === '/test' ? (
        <Layout>
          <Routers />
        </Layout>
      ) : (
        <Routers />
      )}
    </>
  );
}

export default App;
