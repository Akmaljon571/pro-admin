import { Modal, message } from 'antd';
import { useContext, useState } from 'react';
import VerifiedIcon from '@mui/icons-material/Verified';
import EditIcon from '@mui/icons-material/Edit';
import DownloadDoneIcon from '@mui/icons-material/DownloadDone';
import { Admin, api } from '../../context';

function TestUpdate({ setCount, test, setUpdate, course }) {
  const [isModalOpen, setIsModalOpen] = useState(test.ok);
  const [change, setChange] = useState('');
  const [questions, setQuestions] = useState(test.test.questions);
  const { token } = useContext(Admin);

  const handleOk = () => {
    setIsModalOpen(false);
    setUpdate({ ok: false });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setUpdate({ ok: false });
  };

  const update = (updatedQuestion, bool = false) => {
    const updatedQuestions = questions.map((question) => {
      if (question._id === updatedQuestion._id) {
        return updatedQuestion;
      }
      return question;
    });

    setQuestions(updatedQuestions);
    if (bool) {
      setChange('');
      message.loading("Ma'lumot tekshirilmoqda");
      console.log(updatedQuestion);

      updatedQuestion.variants.forEach((variant) => {
        delete variant._id;
      });

      const newObj = { ...updatedQuestion };
      delete newObj._id;

      fetch(
        api +
          `/admin/course/${course}/test/${test.test._id}/question/${updatedQuestion._id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newObj),
        },
      )
        .then((re) => re.json())
        .then((data) => {
          if (data.ok) {
            setCount(Math.floor(Math.random()));
            message.destroy();
            message.success("Ma'lumot o'zgartirildi");
          } else {
            message.destroy();
            message.error("Ma'lumot Hato");
          }
        });
    }
  };

  const handleInputChange = (e, question) => {
    const updatedQuestion = { ...question, content: e.target.value };
    update(updatedQuestion);
  };

  const handleVariantInputChange = (e, question, index) => {
    const updatedQuestion = { ...question };
    updatedQuestion.variants[index].content = e.target.value;
    update(updatedQuestion);
  };

  return (
    <Modal
      title={test.test.title}
      open={isModalOpen}
      className="test_update"
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div className="list">
        {questions.length
          ? questions.map((question, i) => (
              <div className="item" key={i}>
                <div className="top">
                  <span>{i + 1})</span>
                  <h4>
                    {change === question._id ? (
                      <input
                        type="text"
                        value={question.content}
                        onChange={(e) => handleInputChange(e, question)}
                      />
                    ) : (
                      question.content
                    )}{' '}
                    {change === question._id ? (
                      <DownloadDoneIcon
                        onClick={() => update(question, true)}
                        className="ok"
                        style={{ fill: 'green' }}
                      />
                    ) : (
                      <EditIcon
                        onClick={() => setChange(question._id)}
                        className="edit"
                      />
                    )}
                  </h4>
                </div>
                <ul className="bottom">
                  {question.variants.map((variant, vIndex) => (
                    <li key={vIndex}>
                      {variant.is_correct ? (
                        <VerifiedIcon style={{ fill: 'blue', width: '17px' }} />
                      ) : null}{' '}
                      {String.fromCharCode(65 + vIndex)}){' '}
                      {change === question._id + vIndex + 1 ? (
                        <input
                          type="text"
                          value={variant.content}
                          onChange={(e) =>
                            handleVariantInputChange(e, question, vIndex)
                          }
                        />
                      ) : (
                        variant.content
                      )}{' '}
                      {change === question._id + vIndex + 1 ? (
                        <DownloadDoneIcon
                          onClick={() => update(question, true)}
                          className="ok"
                          style={{ fill: 'green' }}
                        />
                      ) : (
                        <EditIcon
                          onClick={() => setChange(question._id + vIndex + 1)}
                          className="edit"
                        />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          : null}
      </div>
    </Modal>
  );
}

export default TestUpdate;
