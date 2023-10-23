import { useContext, useEffect, useState } from 'react';
import { Admin, api } from '../../context';
import summa from '../../func/summa';
import StaticsTable from './table';
import './dashboard.scss';

function Dashboard() {
  const { token } = useContext(Admin);
  const [dashboard, setDashboard] = useState({});

  useEffect(() => {
    fetch(api + '/admin/statics', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((re) => re.json())
      .then((data) => setDashboard(data));
  }, [token]);

  return (
    <section className="dashboard">
      <div className="top">
        <h1>Statistika</h1>
        <ul>
          <li>
            <h3>{dashboard?.customer_count} ta</h3>
            <p>O’quvchilar soni</p>
            <span></span>
          </li>
          <li>
            <h3>{dashboard.course_count} ta</h3>
            <p>Video kurslar soni</p>
            <span></span>
          </li>
          <li>
            <h3>{summa(dashboard.budget || 0)} so’m</h3>
            <p>Budjet</p>
            <span></span>
          </li>
        </ul>
      </div>
      <StaticsTable />
    </section>
  );
}

export default Dashboard;
