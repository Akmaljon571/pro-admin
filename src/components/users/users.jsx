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
import { usersLang } from './users.lang';
const { Meta } = Card;

function Users() {
  const [users, setUsers] = useState([]);
  const { token, l } = useContext(Admin);
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
    if (name.current?.value === '') {
      name.current.value = e.first_name;
      last.current.value = e.last_name;
    }
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
    setReset({});
    name.current.value = '';
    last.current.value = '';
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
      <h2>{usersLang[l].t1}</h2>
      <Search
        placeholder={usersLang[l].t2}
        onChange={(e) => setSearchEmail(e.target.value)}
        loading={users?.length || notFount ? false : true}
        className="search"
        style={{
          width: 200,
          color: '#00f',
        }}
      />
      <Search
        placeholder={usersLang[l].t3}
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
          { value: 'Active', label: usersLang[l].t4 },
          { value: 'Blocked', label: usersLang[l].t5 },
        ]}
      />
      <Select
        defaultValue={usersLang[l].t6}
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
                        title={usersLang[l].t7}
                        description={
                          <span>
                            {usersLang[l].t8} <br /> {usersLang[l].t9} <br />{' '}
                            {usersLang[l].t10}
                          </span>
                        }
                        onConfirm={() => remove(e._id)}
                        onCancel={cancel}
                        okText={usersLang[l].t11}
                        cancelText={usersLang[l].t12}
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
                      <i>{tell(e.phone_number)}</i>
                      <br />
                      <code>
                        {usersLang[l].t13}: {e.status}
                      </code>
                      <span className="course_data">
                        {usersLang[l].t14}: {e.total_course} {usersLang[l].ta}
                      </span>
                      <span className="course_data1">
                        {usersLang[l].t15}: {e.total_amount} {usersLang[l].som}
                      </span>
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
      <Pagination
        className="pagination"
        current={pageNumber}
        onChange={(e) => setPageNumber(e)}
        total={users.length}
      />
      <Modal
        className="users-edit"
        title={usersLang[l].t16}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div className="users-edit-content">
          <label>
            <span>{usersLang[l].t17}</span>
            <input defaultValue={reset?.first_name} ref={name} type="text" />
          </label>
          <label>
            <span>{usersLang[l].t18}</span>
            <input defaultValue={reset?.last_name} ref={last} type="text" />
          </label>
          <label>
            <span>{usersLang[l].t19}</span>
            <input onChange={file} type="file" />
          </label>
        </div>
      </Modal>
    </div>
  );
}

export default Users;
