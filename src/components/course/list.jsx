import { onLoad } from '../../func/onload';
import { useContext, useRef, useState } from 'react';
import { Admin, api } from '../../context';
import gif from '../../img/d9f21515b1e38d83e94fdbce88f623b6.gif';
import summa from '../../func/summa';
import { Button } from '@mui/material';
import { Modal, Popconfirm, message } from 'antd';

function CourseList({ e, setCount, count }) {
  const { token } = useContext(Admin);
  const [img, setImg] = useState('');
  const [imgString, setImgString] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [value, setValue] = useState({});
  const titleRef = useRef();
  const priceRef = useRef();
  const desRef = useRef();
  const seqRef = useRef();

  const showModal = (id) => {
    fetch(api + '/admin/course/' + id, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((re) => re.json())
      .then((data) => {
        if (data.ok) {
          setValue(data.course);
          setIsModalOpen(true);
        }
      });
  };

  const resetForm = () => {
    titleRef.current.value = '';
    priceRef.current.value = '';
    seqRef.current.value = '';
    desRef.current.value = '';
    setImgString('');
    setImg('');
    setValue({});
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showError = (errorMessage) => {
    messageApi.destroy();
    messageApi.open({
      type: 'error',
      content: errorMessage,
      duration: 2.5,
    });
    setTimeout(messageApi.destroy, 2500);
  };

  const handleOk = (e) => {
    const title = titleRef.current?.value;
    const price = priceRef.current?.value;
    const level = seqRef.current?.value;
    const description = desRef.current?.value;

    messageApi.open({
      type: 'loading',
      content: 'Action in progress..',
      duration: 0,
    });
    fetch(api + '/admin/course/' + e?._id, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title || e.title,
        price: price || e.price,
        level: level || e.level,
        description: description || e.description,
        image: imgString || e.image,
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

          resetForm();
          setIsModalOpen(false);
          setCount(count + 1);
          setTimeout(messageApi.destroy, 2500);
        } else {
          showError('Error in file upload');
        }
      });
  };

  const confirm = (id) => {
    console.log(id);
    fetch(api + '/admin/course/' + id, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((re) => re.json())
      .then((data) => {
        if (data.ok) {
          setCount(count + 1);
          message.success("Course O'chirildi");
        } else {
          message.error("Ma'lumot Xato");
        }
      });
  };

  const cancel = (e) => {
    message.error('Bekor qilindi');
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
          resetForm();
          messageApi.destroy();
          messageApi.open({
            type: 'success',
            content: 'Rasm saqlandi',
            duration: 0,
          });
          setImg(URL.createObjectURL(e.target.files[0]));
          setImgString(data.files.image);
        } else {
          showError("Hato Ma'lumot");
        }
      })
      .catch((err) => showError('Fail Fetch'));
  };

  return (
    <li className="course-list">
      {contextHolder}
      <img
        onLoad={(target) => onLoad(target, e.image, token)}
        src={gif}
        alt="Loading"
      />
      <div className="bottom">
        <h3>{e.title}</h3>
        <p>
          {e.description}u darsliklari sizning yuqori daraja olishingizga yordam
          beradi
        </p>
        <span>{e.videos?.length} Video + Workbook</span>
        <div>{summa(e.price)}so'm</div>
        <Button
          onClick={() => showModal(e._id)}
          style={{ width: '45%', marginRight: '10%' }}
          variant="outlined"
        >
          O'zgartirish
        </Button>
        <Popconfirm
          title="O'chirmoqchimisz"
          description="Ishonchingiz komilmi?"
          onConfirm={() => confirm(e._id)}
          onCancel={cancel}
          okText="Yes"
          cancelText="No"
        >
          <Button style={{ width: '45%' }} variant="contained">
            O'chirish
          </Button>
        </Popconfirm>
      </div>
      <Modal
        open={isModalOpen}
        onOk={() => handleOk(e)}
        className="course-add-modal"
        onCancel={handleCancel}
      >
        <label>
          <span>Sarlavha</span>
          <input defaultValue={value?.title} ref={titleRef} type="text" />
        </label>
        <label>
          <span>Narxi</span>
          <input defaultValue={value?.price} ref={priceRef} type="number" />
        </label>
        <label>
          <span>Ketma-Ketlik</span>
          <input defaultValue={value?.level} ref={seqRef} type="number" />
        </label>
        <label>
          <span>Izoh</span>
          <textarea
            ref={desRef}
            cols="30"
            defaultValue={value?.description}
            rows="10"
            placeholder="Bugungi dars mavzusi"
          ></textarea>
        </label>
        <label className="img">
          <span>Image</span>
          {!img && value.image ? (
            <img
              onLoad={(target) => onLoad(target, value.image, token)}
              src={gif}
              alt="Loading"
            />
          ) : (
            <img
              src={
                img
                  ? img
                  : 'https://www.eclosio.ong/wp-content/uploads/2018/08/default.png    '
              }
              alt=""
            />
          )}
          <input onChange={sendImage} className="none" type="file" />
        </label>
      </Modal>
    </li>
  );
}

export default CourseList;
