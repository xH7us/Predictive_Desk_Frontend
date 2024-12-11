import React, { useState, useEffect } from 'react';
import { Tag, Table, Button, Input, Drawer, Card, Space, Typography, Select, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, deleteUserAndTickets } from '../../appRedux/action/userAction';
import { getSelectedUserTickets } from '../../appRedux/action/ticketsAction';
import { colors } from '../../utils/colors';

const { Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const EmployeeListPage = () => {
  const dispatch = useDispatch();
  const { allUsers } = useSelector((state) => state.users);
  const { userTickets } = useSelector((state) => state.tickets);
  const [employees, setEmployees] = useState(allUsers);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [ticketSearch, setTicketSearch] = useState('');
  const [ticketStatusFilter, setTicketStatusFilter] = useState('');

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (allUsers) {
        setEmployees(allUsers);
    }
}, [allUsers]);

useEffect(() => {
  if (userTickets) {
    setFilteredTickets(userTickets);
  }
}, [userTickets]);

  const showDrawer = async (employee) => {
    await dispatch(getSelectedUserTickets(employee._id))
    setSelectedEmployee(employee);
    if (userTickets) {
      setDrawerVisible(true);  
    }
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setSelectedEmployee(null);
    setTicketSearch('');
    setTicketStatusFilter('');
  };

  const handleTicketSearch = (value) => {
    setTicketSearch(value);
    filterTickets(value, ticketStatusFilter);
  };

  const handleTicketStatusFilter = (status) => {
    setTicketStatusFilter(status);
    filterTickets(ticketSearch, status);
  };

  const filterTickets = (search, status) => {
    const filtered = userTickets?.filter(ticket => {
      const matchesStatus = status ? ticket.status === status : true;
      const matchesSearch = ticket.name.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
    setFilteredTickets(filtered);
  };

  const handleDeleteEmployee = (employee) => {
    confirm({
      title: 'Are you sure you want to delete this employee?',
      content: 'Deleting this employee will also delete all associated tickets.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        dispatch(deleteUserAndTickets(employee._id));
        setEmployees(employees.filter(emp => emp._id !== employee._id));
        closeDrawer();
      },
    });
  };

  const handleRefresh = () => {
    dispatch(getAllUsers());
    setEmployees(employees);
  };

  const handleSearch = (value) => {
    if (value.trim()) {
      const filteredEmployees = allUsers.filter(emp =>
        emp.email.toLowerCase().includes(value.toLowerCase())
      );
      setEmployees(filteredEmployees);
    } else {
      setEmployees(allUsers);
    }
  };
  

  const columns = [
    {
      title: 'Employee Name',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      filters: [
        { text: 'Client', value: 'client' },
        { text: 'Admin', value: 'admin' },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type='danger'
            onClick={() => showDrawer(record)}
            icon={<EyeOutlined />}
          >
          </Button>
          <Button
            type="danger"
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteEmployee(record)}
          >
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space style={{ marginBottom: 16 }}>
          <Input.Search
            placeholder="Filter by name"
            onChange={(e) => handleSearch(e.target.value)}
            onSearch={handleSearch}
            allowClear
          />
          <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
            Refresh
          </Button>
        </Space>
        <Table
          columns={columns}
          dataSource={employees}
          rowKey="id"
        />
      </Space>

      <Drawer
        title={`Tickets for ${selectedEmployee?.email}`}
        width={400}
        onClose={closeDrawer}
        visible={drawerVisible}
      >
        <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
          <Input.Search
            placeholder="Search Tickets"
            value={ticketSearch}
            onChange={e => handleTicketSearch(e.target.value)}
            style={{ marginBottom: 8 }}
          />
          <Select
            placeholder="Filter by Status"
            value={ticketStatusFilter}
            onChange={handleTicketStatusFilter}
            style={{ width: '100%' }}
            allowClear
          >
            <Option value="pending">Pending</Option>
            <Option value="active">Active</Option>
            <Option value="resolved">Resolved</Option>
          </Select>
        </Space>

        {filteredTickets.map(ticket => (
          <Card
            key={ticket.id}
            title={ticket.name}
            style={{ marginBottom: 16}}
            headStyle={{
              backgroundColor: colors.statusColors[ticket.status],
            }}
            // actions={[
            //   <Button disabled={true} type="link" onClick={() => console.log('Edit ticket')}><EyeOutlined />Open</Button>,
            //   <Button disabled={true} type="link" onClick={() => console.log('Edit ticket')}><EditOutlined />Edit</Button>
            // ]}
          >
            <p><Text strong>Status:</Text> <Tag>{ticket.status}</Tag></p>
            <p><Text strong>Description:</Text> {ticket.description}</p>
          </Card>
        ))}
      </Drawer>
    </div>
  );
};

export default EmployeeListPage;
