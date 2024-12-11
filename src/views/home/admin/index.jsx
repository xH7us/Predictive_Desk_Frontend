import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { Doughnut, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import {
  QuestionCircleOutlined, ControlOutlined,
  MinusCircleOutlined, PlusCircleOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMonthlyTickets, fetchAdminTopCards } from '../../../appRedux/action/ticketsAction';
import { colors } from '../../../utils/colors';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, monthlyTickets } = useSelector((state) => state.tickets);
  const [ticketsByDate, setTicketsByDate] = useState([]);
    // Fetch events from backend when component mounts
    useEffect(() => {
      dispatch(fetchMonthlyTickets());
      dispatch(fetchAdminTopCards());
    }, [dispatch]);

    useEffect(() => {
      if (monthlyTickets) {
        const formattedData = Object.keys(monthlyTickets).map(date => ({
          date: date,
          submissions: monthlyTickets[date],
        }));
        setTicketsByDate(formattedData);
      }
    }, [monthlyTickets])

  const ticketStats = {
    total: stats.totalTickets,
    resolved: stats.resolvedTickets,
    pending: stats.pendingTickets,
    active: stats.activeTickets,
  };

  const statsData = [
    {
      title: 'Total Tickets',
      value: ticketStats.total,
      icon: <ControlOutlined />,
      color: '#1890ff'
    },
    {
      title: 'Active Tickets',
      value: ticketStats.active,
      icon: <PlusCircleOutlined />,
      color: '#722ed1'
    },
    {
      title: 'Resolved Tickets',
      value: ticketStats.resolved,
      icon: <MinusCircleOutlined />,
      color: '#52c41a'
    },
    {
      title: 'Pending Tickets',
      value: ticketStats.pending,
      icon: <QuestionCircleOutlined />,
      color: '#faad14'
    }
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
    plugins: {
      legend: { position: 'top' },
    },
  };

const processedData = ticketsByDate.map(item => item.submissions);

const segmentColors = processedData.map(() => {
  return colors.chartNewColor['base'];
});

const lineData = {
  labels: ticketsByDate.map(item => item.date),
  datasets: [
    {
      label: 'Tickets Submitted',
      data: processedData,
      borderColor: context => segmentColors[context.dataIndex - 1] || colors.chartColors['active'],
      segment: {
        borderColor: ctx => {
          return colors.chartNewColor['base'];
        },
      },
      fill: false,
      tension: 0.1,
    },
  ],
};

const lineOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: {
      title: { display: true, text: 'Date' },
      grid: { display: false },
    },
    y: {
      title: { display: true, text: 'Tickets Volume' },
      grid: { display: false },
    },
  },
};

  const cardStyle = { height: '400px' };
  
  return (
    <div>
      <Row gutter={[16, 16]} className="stats-row">
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
      </Row>
      <Row gutter={16} style={{ marginBottom: 24, marginTop: 24 }}>
        <Col span={8}>
          <Card title="Ticket Status Distribution" style={cardStyle}>            
            <Doughnut
              data={doughnutData}
              options={doughnutOptions}
              width={300}
              height={300}
            />
          </Card>
        </Col>

        <Col span={16}>
          <Card title="Tickets Submitted Over Time" style={cardStyle}>
            <Line
              data={lineData}
              options={lineOptions}
              width={500}
              height={200}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
