import { Button } from '@mui/material';
import './auth.scss';

function Login() {
  return (
    <div className="login">
      <div className="login_form">
        <h1>Admin Panel</h1>
        <p>Admin Telefon nomeri orqali</p>
        <label>
          <span>Telefon Nomer</span>
          <input type="text" />
        </label>
        <label>
          <span>Parol</span>
          <input maxLength={8} type="text" />
        </label>
        <Button className="" variant="contained">
          Kirish
        </Button>
      </div>
    </div>
  );
}

export default Login;
