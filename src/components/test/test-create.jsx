import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';
import { useContext, useRef, useState } from 'react';
import { message } from 'antd';
import { Admin, api } from '../../context';
import { testLang } from './test.lang';

function TestCreate({ setRead, setCount, course }) {
  const title = useRef();
  const des = useRef();
  const { token, l } = useContext(Admin);
  const [list, setList] = useState([1]);

  const click = () => {
    message.loading("Ma'lumot tekshirilmoqda");

    try {
      const questions = list.map((e) => {
        const questionInput = document.querySelector(
          `input[name="question${e}`,
        );
        const optionsInputs = document.querySelectorAll(`input[name="quiz${e}`);
        const optionsRadios = document.querySelectorAll(
          `input[name="quiz_radio${e}`,
        );

        const content = questionInput.value;
        const variants = [];
        for (let i = 0; i < 3; i++) {
          if (questionInput.value && optionsInputs[i].value) {
            variants.push({
              content: optionsInputs[i].value,
              is_correct: optionsRadios[i].checked,
            });
          } else {
            throw new Error("Ma'lumot hato");
          }
        }

        return { content, variants };
      });
      const obj = {
        title: title.current.value,
        description: des.current.value,
        questions,
      };

      if (!title.current.value || !des.current.value) {
        throw new Error("Ma'lumot hato");
      } else {
        fetch(api + `/admin/course/${course}/test`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(obj),
        })
          .then((re) => re.json())
          .then((data) => {
            if (data.ok) {
              message.destroy();
              message.success('Test yaratildi');
              setCount(Math.floor(Math.random()));
              setRead(true);
            } else {
              throw new Error("Ma'lumot hato");
            }
          });
      }
    } catch (error) {
      message.destroy();
      message.error(error.message);
    }
  };

  return (
    <div className="test_create">
      <div className="title">
        <div className="top">
          <h2>{testLang[l].t7}</h2>
          <Button onClick={() => setRead(true)} variant="contained">
            <ArrowBackIcon />
          </Button>
        </div>
        <hr />
        <label>
          <span>{testLang[l].t8}</span>
          <input placeholder={testLang[l].t8} ref={title} type="text" />
        </label>
        <hr />
        <label>
          <span>{testLang[l].t9}</span>
          <input placeholder={testLang[l].t9} ref={des} type="text" />
        </label>
      </div>
      <div className="savol">
        <ul>
          {list.map((e) => (
            <li key={e}>
              <div className="quiz">
                <span className="seq">{e})</span>
                <label>
                  <span>{testLang[l].t10}</span>
                  <input
                    placeholder={testLang[l].t10}
                    name={`question${e}`}
                    type="text"
                  />
                </label>
              </div>
              <div className="option">
                <label>
                  <span>A</span>
                  <input placeholder="option" name={`quiz${e}`} type="text" />
                  <input defaultChecked name={`quiz_radio${e}`} type="radio" />
                </label>
                <label>
                  <span>B</span>
                  <input placeholder="option" name={`quiz${e}`} type="text" />
                  <input name={`quiz_radio${e}`} type="radio" />
                </label>
                <label>
                  <span>C</span>
                  <input placeholder="option" name={`quiz${e}`} type="text" />
                  <input name={`quiz_radio${e}`} type="radio" />
                </label>
              </div>
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', gap: '50px' }}>
          <span
            className="add"
            onClick={() => setList([...list, list?.length + 1])}
          >
            <AddIcon />
          </span>
          <span className="send" onClick={click}>
            {testLang[l].t11}
          </span>
        </div>
      </div>
    </div>
  );
}

export default TestCreate;
