import React, { useContext, useEffect, useState } from 'react';
import { Table } from 'antd';
import { Admin, api } from '../../context';
import Search from 'antd/es/input/Search';
import { src } from '../../func/src';
import tell from '../../func/tell';
import summa from '../../func/summa';
import { dashboardLang } from './dashboard.lang';

const columns = [
  {
    title: 'Image',
    dataIndex: 'img',
    key: 'img',
  },
  {
    title: 'First Name',
    dataIndex: 'name',
    key: 'first_name',
  },
  {
    title: 'Last Name',
    dataIndex: 'last_name',
    key: 'last_name',
  },
  {
    title: 'E-Mail',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Phone Number',
    dataIndex: 'phone',
    key: 'phone_number',
  },
  {
    title: 'Jami Kurs',
    dataIndex: 'course',
    key: 'total_course',
  },
  {
    title: 'Jami pul',
    dataIndex: 'price',
    key: 'total_amount',
  },
  {
    title: 'Active',
    dataIndex: 'status',
    key: 'status',
  },
];

function StaticsTable() {
  const [users, setUsers] = useState([]);
  const { token, l } = useContext(Admin);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch(api + '/admin/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((re) => re.json())
      .then((data) => {
        if (data.ok) {
          for (let i = 0; i < data.users.length; i++) {
            data.users[i].key = data.users[i]?._id;
            data.users[i].name = <b>{data.users[i]?.first_name}</b>;
            data.users[i].img = (
              <img
                style={{ width: 47, height: 47, borderRadius: '50%' }}
                src={src(data.users[i]?.image)}
                alt="Img"
              />
            );
            data.users[i].course = data.users[i]?.total_course + ' ta';
            data.users[i].phone = tell(data.users[i]?.phone_number);
            data.users[i].price = summa(data.users[i]?.total_amount) + " so'm";
          }
          if (search) {
            setUsers(
              data.users.filter(
                (e) =>
                  e.first_name.toLowerCase().includes(search.toLowerCase()) &&
                  e.role !== 'Admin',
              ),
            );
          } else {
            setUsers(data.users.filter((e) => e.role !== 'Admin'));
          }
        }
      });
  }, [token, search]);

  return (
    <div className="bottom">
      <div className="head">
        <div>
          <h3>{dashboardLang[l].t5}</h3>
          <p>{dashboardLang[l].t6}</p>
        </div>
        <Search
          placeholder="User search"
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: 200,
          }}
        />
      </div>
      <div className="table">
        <Table columns={columns} dataSource={users} />
      </div>
    </div>
  );
}

export default StaticsTable;
