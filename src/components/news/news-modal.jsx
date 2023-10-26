import { Modal } from 'antd';
import { useState } from 'react';
import { src } from '../../func/src';

function NewsModal({ update: { ok, news } }) {
  const [isModalOpen, setIsModalOpen] = useState(ok);

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      title="News"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      className="news_modal"
    >
      {news?.image ? <img src={src(news.image)} alt="" /> : null}
      <h3>{news.title}</h3>
      <p>{news.description}</p>
    </Modal>
  );
}

export default NewsModal;
