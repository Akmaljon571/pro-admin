import { useContext, useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Admin, api } from '../../context';
import { Avatar, Card, Modal, Popconfirm, Skeleton, message } from 'antd';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { Button } from '@mui/material';
import tell from '../../func/tell';
import './users.scss';
import { createArray } from '../../func/array';
import { src } from '../../func/src';
const { Meta } = Card;

function Users() {
  const [users, setUsers] = useState([]);
  const { token } = useContext(Admin);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState('');
  const [count, setCount] = useState(0);
  const [reset, setReset] = useState({});
  const name = useRef();
  const last = useRef();

  useEffect(() => {
    fetch(api + '/admin/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((re) => re.json())
      .then((data) => {
        if (data?.users?.length) {
          setUsers(data.users.filter((e) => e.role !== 'Admin'));
        } else {
          setUsers([]);
        }
      });
  }, [setUsers, token, count]);

  const showModal = (e) => {
    setReset(e);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    const obj = {
      first_name: name.current?.value || reset.first_name,
      last_name: last.current?.value || reset.last_name,
      image: image || reset.image,
    };

    message.loading("Ma'lumot jo'natildi");
    fetch(api + `/admin/user/${reset?._id}`, {
      method: 'PUT',
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
          message.success("Ma'lumot O'zgartirildi");
          setCount(count + 1);
          setImage('');
          name.current.value = '';
          last.current.value = '';
        } else {
          message.error("Ma'lumot Hato");
        }
      });

    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const file = (e) => {
    const formData = new FormData();
    formData.append('image', e.target.files[0]);

    message.loading("Rasm jo'natildi");
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
          message.destroy();
          message.success('Rasm joylandi');
          setImage(data.files.image);
        }
      });
  };

  const cancel = (e) => {
    message.error('Click on No');
  };

  const remove = (id) => {
    fetch(api + `/admin/user/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((re) => re.json())
      .then((data) => {
        if (data?.ok) {
          setCount(count + 1);
          message.success('Click on Yes');
        } else {
          message.error('Muammo chiqdi ?');
        }
      });
  };

  return (
    <div className="users">
      <h2>Users</h2>
      <div className="list">
        {users?.length
          ? users.map((e) => (
              <Card
                key={e._id}
                style={{
                  width: 300,
                  marginTop: 16,
                }}
                className="item"
                actions={[
                  <Button onClick={() => showModal(e)} variant="text">
                    <BorderColorIcon style={{ fill: '#888' }} key="edit" />
                  </Button>,
                  <>
                    {e.status === 'Active' ? (
                      <>
                        <Popconfirm
                          title="Foydalanuvchini Block qilish"
                          description={
                            <span>
                              Ishonchingiz komilmi? <br /> Foydanaluvchini qora
                              ro'yxatga tushgach <br /> ortga qaytarish imkoni
                              yoq
                            </span>
                          }
                          onConfirm={() => remove(e._id)}
                          onCancel={cancel}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button variant="text">
                            <DeleteForeverIcon key="ellipsis" />
                          </Button>
                        </Popconfirm>
                      </>
                    ) : (
                      <Button className="noActive" variant="contained">
                        <DeleteForeverIcon key="ellipsis" />
                      </Button>
                    )}
                  </>,
                ]}
              >
                <Skeleton loading={users?.length ? false : true} avatar active>
                  <Meta
                    className="top"
                    avatar={
                      <Avatar
                        className="img"
                        src={
                          e?.image
                            ? src(e?.image)
                            : 'https://i.stack.imgur.com/l60Hf.png'
                        }
                      />
                    }
                    title={<h5>{e?.first_name}</h5>}
                    description={
                      <>
                        <b>{e?.last_name}</b> <span>{e.email}</span>{' '}
                        <i>{tell(e.phone_number)}</i>{' '}
                        <code>status: {e.status}</code>
                      </>
                    }
                  />
                </Skeleton>
              </Card>
            ))
          : createArray(4).map((e) => (
              <Card
                key={e}
                style={{
                  width: 300,
                  marginTop: 16,
                }}
                actions={[
                  <Button onClick={showModal} variant="text">
                    <BorderColorIcon style={{ fill: '#888' }} key="edit" />
                  </Button>,
                  <Button
                    className={e.status !== 'Active' ? 'noActive' : ''}
                    variant={e.status === 'Active' ? 'text' : 'contained'}
                  >
                    <DeleteForeverIcon key="ellipsis" />
                  </Button>,
                ]}
              >
                <Skeleton
                  style={{ height: '150px' }}
                  loading={true}
                  avatar
                  active
                ></Skeleton>
              </Card>
            ))}
      </div>
      <Modal
        className="users-edit"
        title="Foydalanuvchini habari yo'q"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="users-edit-content">
          <label>
            <span>Ismi</span>
            <input defaultValue={reset?.first_name} ref={name} type="text" />
          </label>
          <label>
            <span>Familiya</span>
            <input defaultValue={reset?.last_name} ref={last} type="text" />
          </label>
          <label>
            <span>Rasmi</span>
            <input onChange={file} type="file" />
          </label>
        </div>
      </Modal>
    </div>
  );
}

export default Users;
