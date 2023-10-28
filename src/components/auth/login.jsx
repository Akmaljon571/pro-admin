import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import { Admin, api } from '../../context';
import './auth.scss';
import { loginLang } from './login.lang';

function Login() {
  const number = useRef();
  const pass = useRef();
  const codeRef = useRef();
  const [messageApi, contextHolder] = message.useMessage();
  const { setToken, token, l, setLang } = useContext(Admin);
  const [login, setLogin] = useState('');
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState(0);

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  const phone = (e) => {
    const number = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    if (number.includes(Number(e.key))) {
      const length = e.target.value?.length;
      if (length === 2) {
        const value = e.target.value.split('(')[1];
        e.target.value =
          value === undefined ? `(${e.target.value}) ` : e.target.value;
      } else if (length === 3) {
        const value = e.target.value.split('(')[1];
        e.target.value = Number(value) ? `${e.target.value}) ` : e.target.value;
      } else if (length === 4 || length === 8 || length === 11) {
        e.target.value = `${e.target.value} `;
      } else if (length > 13) {
        e.preventDefault();
      }
    } else if (e.key !== 'Backspace') {
      e.preventDefault();
    }
  };

  const codeFilter = (e) => {
    const number = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    if (!number.includes(Number(e.key)) && e.key !== 'Backspace') {
      e.preventDefault();
    }
  };

  const click = () => {
    if (!login) {
      const tell = number.current?.value;
      const password = pass.current?.value;
      messageApi.open({
        type: 'loading',
        content: 'Action in progress..',
        duration: 0,
      });

      if (tell?.length === 14 && password?.length === 8) {
        const phone = tell.split(' ').join('');
        const phone_number =
          '998' + phone.split('(').join('').split(')').join('');

        fetch(api + '/auth/login', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phone_number,
            password,
          }),
        })
          .then((re) => re.json())
          .then((data) => {
            if (data?.ok) {
              if (data.user.role === 'Admin') {
                messageApi.destroy();
                messageApi.open({
                  type: 'success',
                  content: 'Muaffaqiyatli tekshiruv',
                });
                setPhoneNumber(phone_number);
                number.current.value = '';
                setLogin(data.access_token);
                fetch(api + '/auth/resend', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    phone_number,
                  }),
                })
                  .then((re) => re.json())
                  .then((data) => {
                    if (data?.ok) {
                      messageApi.destroy();
                      messageApi.open({
                        type: 'success',
                        content: "Kod jo'natildi",
                      });
                    } else {
                      messageApi.destroy();
                      messageApi.open({
                        type: 'error',
                        content: "Ma'lumot xato",
                        duration: 0,
                      });
                    }
                  });
              } else {
                messageApi.destroy();
                messageApi.open({
                  type: 'error',
                  content: "Ma'lumot xato",
                  duration: 0,
                });
              }
            } else {
              messageApi.destroy();
              messageApi.open({
                type: 'error',
                content: "Ma'lumot xato",
                duration: 0,
              });
            }
          });
      } else {
        messageApi.destroy();
        messageApi.open({
          type: 'error',
          content: "Ma'lumotlarni to'ldiring",
        });
      }
    } else {
      const code = codeRef.current.value;
      message.loading('Kod tekshirilmoqda');
      fetch(api + '/auth/verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_number: phoneNumber,
          code,
        }),
      })
        .then((re) => re.json())
        .then((data) => {
          if (data?.ok) {
            message.destroy();
            messageApi.open({
              type: 'success',
              content: 'Muaffaqiyatli tekshiruv',
            });
            localStorage.setItem('admin_token', JSON.stringify(login));
            setToken(login);
            navigate('/');
          } else {
            messageApi.destroy();
            messageApi.open({
              type: 'error',
              content: 'Kod Xato',
              duration: 0,
            });
          }
        });
    }
  };

  return (
    <div className="login">
      {contextHolder}
      <div className="login_form">
        <h1>{loginLang[l].t1}</h1>
        <p>
          {loginLang[l].t2}
          <select onChange={(e) => setLang(e.target.value)}>
            <option value="uz">Uz</option>
            <option value="kr">Kr</option>
          </select>
        </p>
        {!login ? (
          <>
            <label>
              <span>{loginLang[l].t3}</span>
              <input ref={number} onKeyDown={phone} type="text" />
            </label>
            <label>
              <span>{loginLang[l].t4}</span>
              <input ref={pass} maxLength={8} type="password" />
            </label>
          </>
        ) : (
          <>
            <label>
              <span>{loginLang[l].t5}</span>
              <input
                defaultValue={''}
                onKeyDown={codeFilter}
                ref={codeRef}
                maxLength={4}
                type="text"
              />
            </label>
          </>
        )}
        <Button
          style={login ? { marginTop: '100px' } : {}}
          onClick={click}
          className="btn"
          variant="contained"
        >
          {loginLang[l].t6}
        </Button>
      </div>
    </div>
  );
}

export default Login;
