import React, { useState, useEffect } from 'react';
import {
  Row, Col, Card, Table, Button, Statistic, Typography, Space, Tag, Form, Input, Tooltip, message
} from 'antd';
import {
  EditOutlined, EyeOutlined, QuestionCircleOutlined, ControlOutlined,
  PlusOutlined, MinusCircleOutlined, PlusCircleOutlined, SearchOutlined,
  ReloadOutlined, DeleteOutlined 
} from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTickets, createTicket, updateTicket, deleteTicket } from '../../../appRedux/action/ticketsAction';
import { Select } from 'antd';
import { format } from 'date-fns';
import AddTicketModal from './addTicketModal';
import EditTicketModal from './editTicketModal';
import ViewTicketModal from './viewTicketModal';
import TicketCreationPopup from './updateAlertModal';
import { TicketStatus } from '../../../types';
import humanize from 'humanize-string';
import { colors } from '../../../utils/colors';

const { Title, Text } = Typography;
const { Option } = Select;

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { tickets, stats, loading, error } = useSelector((state) => state.tickets);
  const { user } = useSelector((state) => state.auth);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isCreatingTicket, setIsCreatingTicket] = useState(false);
  const [newTicket, setNewTicket] = useState(null);
  const [creationModalVisible, setCreationModalVisible] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [form] = Form.useForm();

  const statsData = [
    {
      title: 'Total Tickets',
      value: stats.totalTickets,
      icon: <ControlOutlined />,
      color: '#1890ff'
    },
    {
      title: 'Active Tickets',
      value: stats.activeTickets,
      icon: <PlusCircleOutlined />,
      color: '#52c41a'
    },
    {
      title: 'Resolved Tickets',
      value: stats.resolvedTickets,
      icon: <MinusCircleOutlined />,
      color: '#722ed1'
    },
    {
      title: 'Pending Tickets',
      value: stats.pendingTickets,
      icon: <QuestionCircleOutlined />,
      color: '#faad14'
    }
  ];

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  const handleAction = (record, type) => {
    setSelectedRecord(record);
    if (type === 'view') {
      setViewModalVisible(true);
    } else if (type === 'edit') {
      setIsModalVisible(true);
    }
  };

  const handleCreateTicket = () => {
    setIsCreateModalVisible(true);
    form.resetFields();
  };

  const handleFormSubmit = async (values) => {
    try {
      setIsUpdate(false);
      setIsCreatingTicket(true);
      setCreationModalVisible(true);
      const result = await dispatch(createTicket(values)).unwrap();
      setNewTicket(result);
      setIsCreateModalVisible(false);
      setIsCreatingTicket(false);
      form.resetFields();
      // console.log('called', values);
      // await dispatch(createTicket(values)).unwrap();
      // setIsCreateModalVisible(false);
      // form.resetFields();
    } catch (error) {
      setIsUpdate(false);
      setIsCreatingTicket(false);
      setCreationModalVisible(false);
      message.error('Failed to create ticket');
    }
  };

  const handleEdit = async (values) => {
    try {
      setIsUpdate(true);
      setIsCreatingTicket(true);
      setCreationModalVisible(true);
      const data = await dispatch(updateTicket({ id: values?._id, ticketData: values })).unwrap();
      setNewTicket(data);
      setIsModalVisible(false);
      await dispatch(fetchTickets());
    } catch (error) {
      setIsUpdate(false);
      setIsCreatingTicket(false);
      setCreationModalVisible(false);
      message.error('Failed to update ticket');
    }
  };

  const handleRefresh = () => {
    dispatch(fetchTickets());
    if (!error && !error?.message) {
      message.success('Ticket list refreshed');
    } else {
      message.error(error.message);
    }
  };

  const handleDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('Please select tickets to delete');
      return;
    }

    try {
      await dispatch(deleteTicket(selectedRowKeys)).unwrap();
      setSelectedRowKeys([]);
      message.success('Selected tickets deleted successfully');
      await dispatch(fetchTickets());
    } catch (error) {
      message.error('Failed to delete tickets');
    }
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  const filteredTickets = tickets.filter((ticket) =>
    ticket.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: 'Ticket Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colorMap = {
          Completed: 'green',
          Active: 'red',
          Pending: 'blue',
        };
        return (
          <Tag color={colorMap[status] || 'default'}>
            {humanize(status)}
          </Tag>
        );
      },
      filters: [
        { text: 'Active', value: TicketStatus.Active },
        { text: 'In Progress', value: TicketStatus.InProgress },
        { text: 'Pending', value: TicketStatus.Pending },
        { text: 'Resolved', value: TicketStatus.Resolved },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Urgency',
      dataIndex: 'urgency',
      key: 'urgency',
      render: (urgency) => (
        <Tag color="volcano">
          {urgency}
        </Tag>
      ),
      // filters: [
      //   { text: IssueUrgency.Critical, value: IssueUrgency.Critical },
      //   { text: IssueUrgency.High, value: IssueUrgency.High },
      //   { text: IssueUrgency.Moderate, value: IssueUrgency.Moderate },
      //   { text: IssueUrgency.Low, value: IssueUrgency.Low },
      // ],
      // onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => (
        <Tag>
          {priority}
        </Tag>
      ),
      // filters: [
      //   { text: IssueUrgency.Critical, value: IssueUrgency.Critical },
      //   { text: IssueUrgency.High, value: IssueUrgency.High },
      //   { text: IssueUrgency.Moderate, value: IssueUrgency.Moderate },
      //   { text: IssueUrgency.Low, value: IssueUrgency.Low },
      // ],
      // onFilter: (value, record) => record.status === value,
    },
    // {
    //   title: 'Description',
    //   dataIndex: 'description',
    //   key: 'description',
    //   render: (description) => (
    //     <Tooltip title={description}>
    //       {description.length > 50 ? `${description.slice(0, 50)}...` : description}
    //     </Tooltip>
    //   ),
    // },
    // {
    //   title: 'Resolution Time',
    //   dataIndex: 'actual_resolution_time',
    //   key: 'actual_resolution_time',
    // },
    {
      title: 'Expected Resolution Time',
      dataIndex: 'expected_resolution_time',
      key: 'expected_resolution_time',
      render: (expected_resolution_time) => {
        return expected_resolution_time ? format(new Date(expected_resolution_time), 'MMMM dd, yyyy | HH:mm') : 'N/A';
      },
      sorter: (a, b) => new Date(a.expected_resolution_time) - new Date(b.expected_resolution_time),
    },
    {
      title: 'Submission Time',
      dataIndex: 'date',
      key: 'date',
      render: (date) => {
        return format(new Date(date), 'MMMM dd, yyyy | HH:mm');
      },
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="View Ticket">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => handleAction(record, 'view')}
              style={{
                background: colors.buttonColor['primary'],
                border: 'none',
                color: '#fff',
              }}                  
            />
          </Tooltip>
          <Tooltip title="Edit Ticket">
            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={() => handleAction(record, 'edit')}
              disabled={record.status === TicketStatus.Resolved}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];
  return (
    <div className="dashboard-page">
      {/* <Row gutter={[16, 16]} className="stats-row">
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card 
              bordered 
              className="stat-card" 
              style={{ 
                position: 'relative',
                overflow: 'hidden',
                paddingLeft: '20px' 
              }}
            >
              <div 
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '6px',
                  backgroundColor: stat.color
                }} 
              />
              <Statistic
                title={
                  <div 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      fontSize: '18px', 
                      marginBottom: '8px',
                      gap: '8px'
                    }}
                  >
                    {stat.icon}
                    <span>{stat.title}</span>
                  </div>
                }
                value={stat.value}
                valueStyle={{ 
                  color: stat.color, 
                  textAlign: 'left', 
                  width: '100%',
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}
              />
            </Card>
          </Col>
        ))}
      </Row> */}
      <Card style={{ marginTop: 20 }} className="table-card">
        <Title level={4} style={{ textAlign: 'center' }}>
          Tickets Overview
          <Text type="secondary" style={{ display: 'block'}}>
            Add, update, delete your tickets from here
          </Text>
          </Title>
        <Row justify="space-between" align="middle" style={{ marginTop: 12 }}>
          <Col>
            <Space style={{ marginBottom: 16 }}>
              <Input
                placeholder="Search tickets"
                value={searchText}
                onChange={handleSearchChange}
                prefix={<SearchOutlined />}
              />
              <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
                Refresh
              </Button>
              <Button icon={<DeleteOutlined />} onClick={handleDelete} disabled={selectedRowKeys.length === 0}>
                Delete
              </Button>
            </Space>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreateTicket}
              style={{
                marginBottom: 16,
                background: colors.buttonColor['primary'],
                border: 'none',
                color: '#fff',
              }}
            >
              New Ticket
            </Button>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={filteredTickets}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
          rowKey="_id"
          pagination={{
            total: filteredTickets.length,
            defaultPageSize: 5,
            pageSizeOptions: ['5', '10', '20', '50', '100'],
            showSizeChanger: true,
            showQuickJumper: true,
          }}
          loading={loading}
        />
      </Card>

      <AddTicketModal
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onSubmit={handleFormSubmit}
        form={form}
      />
      <EditTicketModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleEdit}
        initialValues={selectedRecord}
      />
      <ViewTicketModal
        visible={viewModalVisible}
        onCancel={() => {
          setViewModalVisible(false);
        }}
        ticket={selectedRecord}
      />
      <TicketCreationPopup 
        isLoading={isCreatingTicket}
        visible={creationModalVisible}
        ticket={newTicket}
        onCancel={() => {
          setCreationModalVisible(false);
          setNewTicket(null);
          setIsCreatingTicket(false);
        }}
        expectedResolutionTime={newTicket?.expected_resolution_time}
        isUpdate={isUpdate}
      />
    </div>
  );
};

export default DashboardPage;
