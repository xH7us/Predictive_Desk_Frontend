import React, { useState } from 'react';
import { Layout, Menu, Button, Dropdown, Row, Col, theme } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  DashboardOutlined,
  LogoutOutlined,
  DownOutlined,
  HomeOutlined,
  HistoryOutlined,
  LineChartOutlined,
  SettingOutlined
} from '@ant-design/icons';
import '../../assets/dashboard.css';
import DashboardPage from '../home/client';
import ClientDashboard from '../home/admin';
import AdminDashboard from '../home/adminNew';
import TabsPage from '../employeeTicketsHistory/index';
import LineChartComponent from '../ticketsForecast';
import AdminTicketsLayout from '../allTickets';
import TicketBoard from '../ticketsBoard'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../appRedux/reducer/authReducer';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/icons/predective-desk.png';
import smalllogo from '../../assets/icons/pd-short.png';

const { Header, Sider, Content } = Layout;

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);

  const [collapsed, setCollapsed] = useState(false);
  const [activeComponent, setActiveComponent] = useState('1');
  // const { token } = theme.useToken();

  const menuItemsClient = [
    {
      key: '1',
      icon: <HomeOutlined />,
      label: 'Dashboard',
      component: <ClientDashboard />
    },
    {
      key: '2',
      icon: <DashboardOutlined />,
      label: 'Tickets',
      component: <DashboardPage />
    }
  ];

  const menuItemsAdmin = [
    {
      key: '1',
      icon: <HomeOutlined />,
      label: 'Dashboard',
      component: <AdminDashboard />
    },
    {
      key: '2',
      icon: <DashboardOutlined />,
      label: 'Tickets Board',
      component: <TicketBoard />
    },
    {
      key: '3',
      icon: <LineChartOutlined />,
      label: 'Tickets Forecast',
      component: <LineChartComponent />
    },
    {
      key: '4',
      icon: <SettingOutlined />,
      label: 'Settings',
      component: <TabsPage />
    },
  ];

  const menuItems = user?.role === 'admin' ? menuItemsAdmin : menuItemsClient;

  // Dropdown menu for user icon
  const userMenu = (
    <Menu>
      <Menu.Item
        key="logout"
        icon={<LogoutOutlined />}
        onClick={() => {
          dispatch(logout());
          localStorage.removeItem('token');
          navigate('/');
        }}
      >
        Logout
      </Menu.Item>
    </Menu>
  );

  // Function to handle menu item clicks
  const handleMenuClick = ({ key }) => {
    setActiveComponent(key);
  };

  // Function to render the active component
  const renderComponent = () => {
    const menuItem = menuItems.find(item => item.key === activeComponent);
    return menuItem?.component || <div>Select a menu item</div>;
  };

  return (
    <Layout className="dashboard-layout">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        className="dashboard-sider"
      >
        <div className="logo-container">
          <img
            src={collapsed ? smalllogo : logo}
            alt="PredictiveDesk Logo"
            className="logo-image"
            style={{ width: collapsed ? '40px' : '220px', height: 'auto' }}
          />
          {/* {!collapsed && <h1 className="logo-text">AssistDevs</h1>} */}
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          selectedKeys={[activeComponent]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header className="dashboard-header">
          <Row justify="space-between" align="middle" style={{ width: '100%' }}>
            <Col>
              <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                className="trigger-button"
              />
            </Col>
            <Col>
              <Dropdown overlay={userMenu} trigger={['click']}>
                <div className="user-dropdown">
                  <UserOutlined style={{ fontSize: '18px' }} />
                  <span className="username">{user?.email}{' '}</span>
                  <DownOutlined />
                </div>
              </Dropdown>
            </Col>
          </Row>
        </Header>
        <Content className="dashboard-content">
          {renderComponent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
