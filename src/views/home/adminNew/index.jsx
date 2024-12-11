import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { Doughnut, Line, Bar } from 'react-chartjs-2'; // Bar chart included
import 'chart.js/auto';
import {
  QuestionCircleOutlined, ControlOutlined,
  MinusCircleOutlined, PlusCircleOutlined, ClockCircleOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMonthlyTickets, fetchAdminTopCards, getCategoriesCount, getTodayStats } from '../../../appRedux/action/ticketsAction';
import { colors } from '../../../utils/colors';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, monthlyTickets, ticketCategories, todayStats } = useSelector((state) => state.tickets);
  const [ticketsByDate, setTicketsByDate] = useState([]);

  useEffect(() => {
    dispatch(fetchMonthlyTickets());
    dispatch(fetchAdminTopCards());
    dispatch(getCategoriesCount());
    dispatch(getTodayStats());
  }, [dispatch]);

  useEffect(() => {
    if (monthlyTickets) {
      const formattedData = Object.keys(monthlyTickets).map(date => ({
        date: date,
        submissions: monthlyTickets[date],
      }));
      setTicketsByDate(formattedData);
    }
  }, [monthlyTickets]);

  const ticketStats = {
    total: stats?.totalTickets || 0,
    resolved: stats?.resolvedTickets || 0,
    pending: stats?.pendingTickets || 0,
    active: stats?.activeTickets || 0,
  };

  const statsData = [
    { title: 'Total Tickets', value: ticketStats.total, icon: <ControlOutlined />, color: '#1890ff' },
    { title: 'Active Tickets', value: ticketStats.active, icon: <PlusCircleOutlined />, color: '#722ed1' },
    { title: 'Resolved Tickets', value: ticketStats.resolved, icon: <MinusCircleOutlined />, color: '#52c41a' },
    { title: 'Pending Tickets', value: ticketStats.pending, icon: <QuestionCircleOutlined />, color: '#faad14' },
  ];

  const doughnutData = {
    labels: ['Resolved', 'Pending', 'Active'],
    datasets: [
      {
        data: [ticketStats.resolved, ticketStats.pending, ticketStats.active],
        backgroundColor: [colors.chartColors['resolved'], colors.chartColors['pending'], colors.chartColors['active']],
        hoverOffset: 4,
      },
    ],
  };

  const doughnutOptions = {
    cutout: '80%',
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } },
  };

  const lineData = {
    labels: ticketsByDate.map(item => item.date),
    datasets: [
      {
        label: 'Tickets Submitted',
        data: ticketsByDate.map(item => item.submissions),
        borderColor: colors.chartNewColor['base'],
        fill: false,
        tension: 0.1,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { title: { display: true, text: 'Date' }, grid: { display: false } },
      y: { title: { display: true, text: 'Tickets Volume' }, grid: { display: true } },
    },
  };

  const barData = {
    labels: ticketCategories?.map(category => category.type) || [],
    datasets: [
      {
        label: 'Tickets by Type',
        data: ticketCategories?.map(category => category.count) || [],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#f39c12', '#8e44ad'],
      },
    ],
  };

  const barOptions = {
    responsive: true,
    scales: {
      x: { title: { display: true, text: 'Ticket Type' }, grid: { display: false } },
      y: { title: { display: true, text: 'Number of Tickets' }, grid: { display: false } },
    },
  };

  const cardStyle = { height: '400px' };

  return (
    <div>
      <Row gutter={[16, 16]} className="stats-row">
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card bordered className="stat-card" style={{ position: 'relative', overflow: 'hidden', paddingLeft: '20px' }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '6px', backgroundColor: stat.color }} />
              <Statistic
                title={
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '18px', marginBottom: '8px', gap: '8px' }}>
                    {stat.icon}
                    <span>{stat.title}</span>
                  </div>
                }
                value={stat.value}
                valueStyle={{ color: stat.color, fontSize: '24px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
        ))}

        <Col xs={24} sm={24} lg={8}>
          <Card bordered title="Today's Ticket Metrics" style={{ height: '100%' }}>
            <Statistic title="Tickets Resolved Today" value={todayStats?.ticketsResolved || 0} prefix={<MinusCircleOutlined />} valueStyle={{ color: '#52c41a', fontSize: '18px' }} />
            <Statistic title="Tickets Submitted Today" value={todayStats?.ticketsSubmittedToday || 0} prefix={<PlusCircleOutlined />} valueStyle={{ color: '#722ed1', fontSize: '18px' }} />
            <Statistic title="Average Resolution Time of Tickets Resolved Today" value={todayStats?.averageResolutionTime || 0} prefix={<ClockCircleOutlined />} valueStyle={{ color: '#faad14', fontSize: '18px' }} />
          </Card>
        </Col>

        <Col xs={24} sm={24} lg={16}>
          <Card title="Tickets by Type">
            <Bar data={barData} options={barOptions} height={90} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24, marginTop: 24 }}>
        <Col span={8}>
          <Card title="Ticket Status Distribution" style={cardStyle}>
            <Doughnut data={doughnutData} options={doughnutOptions} width={300} height={300} />
          </Card>
        </Col>

        <Col span={16}>
          <Card title="Tickets Submitted Over Time" style={cardStyle}>
            <Line data={lineData} options={lineOptions} width={500} height={200} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
