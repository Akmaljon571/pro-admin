import './dashboard.scss';

function Dashboard() {
  return (
    <section className="dashboard">
      <div className="top">
        <h1>Statistika</h1>
        <ul>
          <li>
            <p>3 000 ta</p>
            <span>O’quvchilar soni</span>
          </li>
          <li>
            <p>250 ta</p>
            <span>Video kurslar soni</span>
          </li>
          <li>
            <p>1 200 000 so’m</p>
            <span>Budjet</span>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default Dashboard;
