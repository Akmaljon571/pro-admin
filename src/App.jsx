import { useLocation } from 'react-router-dom';
import './App.scss';
import Routers from './routes/routes';
import { Layout } from './components';

function App() {
  const path = useLocation().pathname;
  return (
    <>
      {path === '/' ? (
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
