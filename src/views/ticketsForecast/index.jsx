import { ClockCircleOutlined, FilterOutlined, LineChartOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Col, Dropdown, Menu, Row, Spin, Typography } from 'antd';
import 'chart.js/auto';
import React, { useEffect, useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFutureTicketsData, fetchPretrainedTicketsData } from '../../appRedux/action/eventScheduleAction';
import { getManHours } from '../../appRedux/action/ticketsAction';
import { getAllUsers } from '../../appRedux/action/userAction';

const ForecastLineChart = () => {
  const dispatch = useDispatch();
  const [forecastFilter, setForecastFilter] = useState('weekly');
  const [pretrainedFilter, setPretrainedFilter] = useState('weekly');
  const { forecastData, preTrainedData, forecastDataLoading, preTrainedLoading } = useSelector(
    (state) => state.eventSchedule
  );
  const { manHours, manHoursError, manHoursLoading } = useSelector(
    (state) => state.tickets
  );
  const { allUsers } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchFutureTicketsData(forecastFilter));
  }, [dispatch, forecastFilter]);

  useEffect(() => {
    dispatch(fetchPretrainedTicketsData(pretrainedFilter));
  }, [dispatch, pretrainedFilter]);

  useEffect(() => {
    dispatch(getManHours());
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleForecastMenuClick = (e) => setForecastFilter(e.key);
  const handlePretrainedMenuClick = (e) => setPretrainedFilter(e.key);

  const forecastFilterMenu = (
    <Menu onClick={handleForecastMenuClick}>
      <Menu.Item key="weekly">Weekly</Menu.Item>
      <Menu.Item key="monthly">Monthly</Menu.Item>
    </Menu>
  );

  const pretrainedFilterMenu = (
    <Menu onClick={handlePretrainedMenuClick}>
      <Menu.Item key="weekly">Weekly</Menu.Item>
      <Menu.Item key="monthly">Monthly</Menu.Item>
    </Menu>
  );

  const averageTime = manHours?.averageTime;
  const ticketsVolume = manHours?.ticketsVolume;
  const averageManHours = Math.round(averageTime * ticketsVolume);

  const pieChartData = {
    labels: ['Employees Required', 'Current Capacity'],
    datasets: [
      {
        data: [(averageManHours/8)/30, allUsers.length],
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.5'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' },
    },
  };

  const gridStyle = {
    width: '50%',
    textAlign: 'center',
    padding: '20px',
    background: 'linear-gradient(135deg, rgb(205 217 235), rgb(222, 235, 243))',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    margin: '10px',
  };
  
  
  return (
    <>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card
            title="Ticket Volume Forecast using Custom Data"
            extra={
              <Dropdown overlay={forecastFilterMenu} trigger={['click']}>
                <Button icon={<FilterOutlined />}>Filter</Button>
              </Dropdown>
            }
          >
            {forecastDataLoading ? (
              <Spin tip="Loading..." size="large" />
            ) : forecastData && forecastData.length > 0 ? (
              <Line data={{
                  labels: forecastData.map((item) => item.date),
                  datasets: [
                    {
                      label: 'Forecasted Value',
                      data: forecastData.map((item) => item.forecasted_value),
                      borderColor: 'rgba(75, 192, 192, 1)',
                      backgroundColor: 'rgba(75, 192, 192, 0.2)',
                      fill: false,
                    },
                  ],
                }} options={chartOptions} />
            ) : (
              <p>No forecast data available.</p>
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="Ticket Volume Forecast using External Kaggle Data"
            extra={
              <Dropdown overlay={pretrainedFilterMenu} trigger={['click']}>
                <Button icon={<FilterOutlined />}>Filter</Button>
              </Dropdown>
            }
          >
            {preTrainedLoading ? (
              <Spin tip="Loading..." size="large" />
            ) : preTrainedData && preTrainedData.length > 0 ? (
              <Line data={{
                  labels: preTrainedData.map((item) => item.date),
                  datasets: [
                    {
                      label: 'Forecasted Value',
                      data: preTrainedData.map((item) => item.forecasted_value),
                      borderColor: 'rgba(255, 99, 132, 1)',
                      backgroundColor: 'rgba(255, 99, 132, 0.2)',
                      fill: false,
                    },
                  ],
                }} options={chartOptions} />
            ) : (
              <p>No pretrained data available.</p>
            )}
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
      <Col span={24}>
        <Card title="Ticket Volume Forecast Summary" style={{ background: '#f9f9f9' }}>
          {manHoursLoading ? (
            <Spin tip="Calculating..." size="large" />
          ) : manHoursError ? (
            <p>Error loading manhours data.</p>
          ) : (
            <>
              <Row>
                <Col span={12}>
                <Card.Grid style={gridStyle}>
                  <ClockCircleOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                  <Typography.Title level={5} style={{ marginTop: '10px' }}>
                    Average Resolution Time
                  </Typography.Title>
                  <Typography.Text>{Math.round(averageTime)} hrs</Typography.Text>
                </Card.Grid>

                <Card.Grid style={gridStyle}>
                  <LineChartOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                  <Typography.Title level={5} style={{ marginTop: '10px' }}>
                    Forecasted Ticket Volume
                  </Typography.Title>
                  <Typography.Text>{Math.round(ticketsVolume)}</Typography.Text>
                </Card.Grid>

                <Card.Grid style={gridStyle}>
                  <UserOutlined style={{ fontSize: '24px', color: '#fa8c16' }} />
                  <Typography.Title level={5} style={{ marginTop: '10px' }}>
                    No. of Employees Required
                  </Typography.Title>
                  <Typography.Text>{Math.round((averageManHours/8)/30)}</Typography.Text>
                </Card.Grid>
                </Col>
                <Col span={12}>
                  <div style={{ maxWidth: '400px', maxHeight: '400px' }}>
                    <Pie data={pieChartData} options={chartOptions} height={'400px'}/>
                  </div>
                </Col>
              </Row>
            </>
          )}
        </Card>
      </Col>
    </Row>
    </>
  );
};

export default ForecastLineChart;
