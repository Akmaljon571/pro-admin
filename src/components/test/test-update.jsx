import { Modal } from 'antd';
import { useState } from 'react';
import VerifiedIcon from '@mui/icons-material/Verified';
import EditIcon from '@mui/icons-material/Edit';
import DownloadDoneIcon from '@mui/icons-material/DownloadDone';

function TestUpdate({ setCount, test, setUpdate }) {
  const [isModalOpen, setIsModalOpen] = useState(test.ok);
  const [change, setChange] = useState('');

  const handleOk = () => {
    setIsModalOpen(false);
    setUpdate({ ok: false });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setUpdate({ ok: false });
  };

  const update = (e) => {
    console.log(e);
    
    // write you update function code up
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
        {test?.test?.questions.length
          ? test?.test?.questions.map((e, i) => (
              <div className="item" key={i}>
                <div className="top">
                  <span>{i + 1})</span>
                  <h4>
                  {change === e._id ? (
                      <input type="text" defaultValue={e.content} />
                    ) : (
                      e.content
                    )}{' '}
                    {change === e._id ? (
                      <DownloadDoneIcon
                        onClick={() => update(e)}
                        className="ok"
                        style={{ fill: 'green' }}
                      />
                    ) : (
                      <EditIcon
                        onClick={() => setChange(e._id)}
                        className="edit"
                      />
                    )}
                  </h4>
                </div>
                <ul className="bottom">
                  <li>
                    {e.variants[0].is_correct ? (
                      <VerifiedIcon style={{ fill: 'blue', width: '17px' }} />
                    ) : null}{' '}
                    A){' '}
                    {change === e._id + 1 ? (
                      <input type="text" defaultValue={e.variants[0].content} />
                    ) : (
                      e.variants[0].content
                    )}{' '}
                    {change === e._id + 1 ? (
                      <DownloadDoneIcon
                        onClick={() => update(e)}
                        className="ok"
                        style={{ fill: 'green' }}
                      />
                    ) : (
                      <EditIcon
                        onClick={() => setChange(e._id + 1)}
                        className="edit"
                      />
                    )}
                  </li>
                  <li>
                    {e.variants[1].is_correct ? (
                      <VerifiedIcon style={{ fill: 'blue', width: '17px' }} />
                    ) : null}{' '}
                    B){' '}
                    {change === e._id + 2 ? (
                      <input type="text" defaultValue={e.variants[1].content} />
                    ) : (
                      e.variants[1].content
                    )}{' '}
                    {change === e._id + 2 ? (
                      <DownloadDoneIcon
                        onClick={() => update(e)}
                        className="ok"
                        style={{ fill: 'green' }}
                      />
                    ) : (
                      <EditIcon
                        onClick={() => setChange(e._id + 2)}
                        className="edit"
                      />
                    )}
                  </li>
                  <li>
                    {e.variants[2].is_correct ? (
                      <VerifiedIcon style={{ fill: 'blue', width: '17px' }} />
                    ) : null}{' '}
                    C){' '}
                    {change === e._id + 3 ? (
                      <input type="text" defaultValue={e.variants[2].content} />
                    ) : (
                      e.variants[2].content
                    )}{' '}
                    {change === e._id + 3 ? (
                      <DownloadDoneIcon
                        onClick={() => update(e)}
                        className="ok"
                        style={{ fill: 'green' }}
                      />
                    ) : (
                      <EditIcon
                        onClick={() => setChange(e._id + 3)}
                        className="edit"
                      />
                    )}
                  </li>
                </ul>
              </div>
            ))
          : null}
      </div>
    </Modal>
  );
}

export default TestUpdate;
