import { useContext, useEffect, useState } from 'react';
import { Admin, api } from '../../context';
import summa from '../../func/summa';
import StaticsTable from './table';
import './dashboard.scss';
import { dashboardLang } from './dashboard.lang';

function Dashboard() {
  const { token, l } = useContext(Admin);
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
        <h1>{dashboardLang[l].t1}</h1>
        <ul>
          <li>
            <h3>
              {dashboard?.customer_count} {dashboardLang[l].ta}
            </h3>
            <p>{dashboardLang[l].t2}</p>
            <span></span>
          </li>
          <li>
            <h3>
              {dashboard.course_count} {dashboardLang[l].ta}
            </h3>
            <p>{dashboardLang[l].t3}</p>
            <span></span>
          </li>
          <li>
            <h3>
              {summa(dashboard.budget || 0)} {dashboardLang[l].som}
            </h3>
            <p>{dashboardLang[l].t4}</p>
            <span></span>
          </li>
        </ul>
      </div>
      <StaticsTable />
    </section>
  );
}

export default Dashboard;
