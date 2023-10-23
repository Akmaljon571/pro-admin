import { useContext, useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Admin, api } from '../../context';
import {
  Avatar,
  Card,
  Cascader,
  Modal,
  Pagination,
  Popconfirm,
  Select,
  Skeleton,
  message,
} from 'antd';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { Button } from '@mui/material';
import tell from '../../func/tell';
import { createArray } from '../../func/array';
import { src } from '../../func/src';
import Search from 'antd/es/input/Search';
import './users.scss';
const { Meta } = Card;

function Users() {
  const [users, setUsers] = useState([]);
  const { token } = useContext(Admin);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [image, setImage] = useState('');
  const [count, setCount] = useState(0);
  const [reset, setReset] = useState({});
  const [status, setStatus] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [pageSize, setPageSize] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [notFount, setNotFount] = useState(false);
  const name = useRef();
  const last = useRef();

  useEffect(() => {
    setNotFount(false);
    fetch(
      api +
        `/admin/user?role=Customer${
          pageNumber ? '&page_number=' + pageNumber : ''
        }${status ? '&status=' + status : ''}${
          searchEmail ? '&email=' + searchEmail : ''
        }${searchPhone ? '&phone_number=' + searchPhone : ''}${
          pageSize ? '&page_size=' + pageSize : ''
        }`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then((re) => re.json())
      .then((data) => {
        if (data?.users?.length) {
          setUsers(data.users);
        } else {
          setUsers([]);
        }
      });
    setTimeout(() => {
      setNotFount(true);
    }, 2000);
  }, [
    setUsers,
    token,
    count,
    searchEmail,
    status,
    searchPhone,
    pageSize,
    pageNumber,
  ]);

  const showModal = (e) => {
    setReset(e);
    setIsModalOpen(true);
  };

  const codeFilter = (e) => {
    const number = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
    if (!number.includes(Number(e.key)) && e.key !== 'Backspace') {
      e.preventDefault();
    }
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
      <Search
        placeholder="E-Mail search"
        onChange={(e) => setSearchEmail(e.target.value)}
        loading={users?.length || notFount ? false : true}
        className="search"
        style={{
          width: 200,
          color: '#00f',
        }}
      />
      <Search
        placeholder="Phone Number search"
        onChange={(e) => setSearchPhone(e.target.value)}
        onKeyDown={codeFilter}
        className="search"
        loading={users?.length || notFount ? false : true}
        style={{
          width: 200,
          marginLeft: '30px',
          color: 'blue !importent',
        }}
      />
      <Select
        defaultValue="Status"
        style={{ width: 120, marginLeft: '30px' }}
        onChange={(e) => setStatus(e)}
        options={[
          { value: 'Active', label: 'Active' },
          { value: 'Blocked', label: 'Blocked' },
        ]}
      />
      <Select
        defaultValue="Ro'yxat uzunligi"
        style={{ width: 150, marginLeft: '30px' }}
        onChange={(e) => setPageSize(e)}
        options={[
          { value: '10', label: '10' },
          { value: '15', label: '15' },
          { value: '20', label: '20' },
          { value: '25', label: '25' },
        ]}
      />
      <div className="list">
        {users?.length ? (
          users.map((e) => (
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
                            ro'yxatga tushgach <br /> ortga qaytarish imkoni yoq
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
                      <b>{e?.last_name}</b> <span>{e.email}</span>
                      <i>{tell(e.phone_number)}</i><br />
                      <code>status: {e.status}</code>
                      <span className='course_data'>Jami Kurs: {e.total_course} ta</span>
                      <span className='course_data1'>Jami foyda: {e.total_amount} so'm</span>
                    </>
                  }
                />
              </Skeleton>
            </Card>
          ))
        ) : (
          <>
            {notFount ? (
              <Cascader.Panel className="not_fount" />
            ) : (
              createArray(4).map((e) => (
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
              ))
            )}
          </>
        )}
      </div>
      {!notFount ? (
        <Pagination
          className="pagination"
          current={pageNumber}
          onChange={(e) => setPageNumber(e)}
          total={users.length}
        />
      ) : null}
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
