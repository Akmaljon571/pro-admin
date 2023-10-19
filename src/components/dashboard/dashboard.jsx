import { useEffect } from 'react';
import { useState } from 'react';
import useStart from '../../hooks/useStart';
import './dashboard.scss';

function Dashboard() {
  const [dashboard, setDashboard] = useState({});
  const {
    token: { token },
  } = useStart();

  useEffect(() => {}, [token]);

  return <section className="dashboard">Dashboard</section>;
}

export default Dashboard;
