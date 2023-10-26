import { Modal } from 'antd';
import { useState } from 'react';

function NewsModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    ></Modal>
  );
}

export default NewsModal;
