import { Button } from '@mui/material';
import { useContext, useEffect, useRef, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { Admin, api } from '../../context';
import { Modal, message } from 'antd';
import './course.scss';

function Course() {
  const [course, setCourse] = useState([]);
  const [count, setCount] = useState(0);
  const { token } = useContext(Admin);
  const [img, setImg] = useState('');
  const [imgString, setImgString] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const titleRef = useRef();
  const priceRef = useRef();
  const desRef = useRef();
  const seqRef = useRef();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    const title = titleRef.current?.value;
    const price = priceRef.current?.value;
    const level = seqRef.current?.value;
    const description = desRef.current?.value;

    messageApi.open({
      type: 'loading',
      content: 'Action in progress..',
      duration: 0,
    });

    if (title && price && level && description && imgString) {
      fetch(api + '/admin/course', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          price,
          level,
          description,
          image: imgString,
        }),
      })
        .then((re) => re.json())
        .then((data) => {
          if (data.ok) {
            messageApi.destroy();
            messageApi.open({
              type: 'success',
              content: 'Course yaratildi',
              duration: 0,
            });

            titleRef.current.value = '';
            priceRef.current.value = '';
            seqRef.current.value = '';
            desRef.current.value = '';

            setImgString('');
            setImg('');
            setIsModalOpen(false);
            setCount(count + 1);
            setTimeout(messageApi.destroy, 2500);
          } else {
            messageApi.destroy();
            messageApi.open({
              type: 'error',
              content: 'Error in file upload',
              duration: 0,
            });
            setTimeout(messageApi.destroy, 2500);
          }
        });
    } else {
      messageApi.destroy();
      messageApi.open({
        type: 'error',
        content: 'Error in file upload',
        duration: 0,
      });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const sendImage = (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);

    messageApi.open({
      type: 'loading',
      content: 'Action in progress..',
      duration: 0,
    });

    fetch(api + '/customer/file', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((re) => re.json())
      .then((data) => {
        if (data.ok) {
          messageApi.destroy();
          messageApi.open({
            type: 'success',
            content: 'Rasm saqlandi',
            duration: 0,
          });
          setImg(URL.createObjectURL(e.target.files[0]));
          setImgString(data.files.image);
        } else {
          messageApi.destroy();
          messageApi.open({
            type: 'error',
            content: 'Error in file upload',
            duration: 0,
          });
        }
      });
  };

  useEffect(() => {
    fetch(api + '/admin/course', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((re) => re.json())
      .then((data) => setCourse(data?.courses));
  }, [count, setCourse, token]);

  return (
    <div className="course">
      {contextHolder}
      <div className="top">
        <h2>Kurslar</h2>
        <Button onClick={showModal} variant="contained">
          <AddIcon />
        </Button>
      </div>
      <ul>{course?.length ? course.map((e) => 
            <li key={e._id}>
                elarijbcrifbrifurhfuirfhur
            </li>
        ) : null}</ul>
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        className="course-add-modal"
        onCancel={handleCancel}
      >
        <label>
          <span>Sarlavha</span>
          <input ref={titleRef} type="text" />
        </label>
        <label>
          <span>Narxi</span>
          <input ref={priceRef} type="number" />
        </label>
        <label>
          <span>Ketma-Ketlik</span>
          <input ref={seqRef} type="number" />
        </label>
        <label>
          <span>Izoh</span>
          <textarea
            ref={desRef}
            cols="30"
            rows="10"
            placeholder="Bugungi dars mavzusi"
          ></textarea>
        </label>
        <label className="img">
          <span>Image</span>
          <img
            src={
              img
                ? img
                : 'https://www.eclosio.ong/wp-content/uploads/2018/08/default.png    '
            }
            alt=""
          />
          <input onChange={sendImage} className="none" type="file" />
        </label>
      </Modal>
    </div>
  );
}

export default Course;
