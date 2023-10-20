import { useLocation } from 'react-router-dom';
import { Layout } from './components';
import Routers from './routes/routes';
import './App.scss';

function App() {
  const path = useLocation().pathname;
  return (
    <>
      {path === '/' || path === '/course' || path === '/video' ? (
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
