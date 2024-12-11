// LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { Layout, Form, Input, Button, Typography, message } from 'antd';
import Icon, { UserOutlined, LockOutlined, ArrowRightOutlined, 
  CheckCircleOutlined, LineChartOutlined, TeamOutlined
 } from '@ant-design/icons';
import '../../assets/login.css';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser, loginUser } from '../../appRedux/action/authAction';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/icons/predective-desk.png';
import { colors } from '../../utils/colors';
const { Content, Sider } = Layout;
const { Title, Text } = Typography;

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [isLogin, setIsLogin] = useState(true);
  const [form] = Form.useForm();

  const onFinish = (values) => {
    if (isLogin) {
      dispatch(loginUser(values));
    } else {
      dispatch(signupUser(values));
    }
  };

  useEffect(() => {
    if (!loading && !error) {
      if (isAuthenticated) {
        navigate('/home');
      }
    }
  }, [loading, error, navigate, isAuthenticated]);

  return (
    <>
    <Layout className="auth-layout">
      <Content className="auth-content">
        <div className="auth-card">
          <Title level={2} className="auth-title">
            {isLogin ? 'PredictiveDesk Login' : 'PredictiveDesk Signup'}
          </Title>

          <Text className="auth-subtitle">
            {isLogin
              ? 'Hey, enter your details to sign in to your account.'
              : 'Create your account to get started.'}
          </Text>

          <Form
            form={form}
            name="auth_form"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            {!isLogin && (
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: 'Please input your username!' },
                  { type: 'text', message: 'Please enter a valid username!' }
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter Username"
                />
              </Form.Item>
            )}

            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter Email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter Password"
              />
            </Form.Item>

            {!isLogin && (
              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm your password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Confirm Password"
                />
              </Form.Item>
            )}

            <Form.Item>
              <Button 
                style={{
                  background: colors.buttonColor['primary'],
                  border: 'none',
                  color: '#fff',
                }}
                type="primary"
                htmlType="submit"
                block
                disabled={loading}
                className="auth-button">
                {isLogin ? 'Sign in' : 'Sign up'}
              </Button>
            </Form.Item>

            <div className="auth-footer">
              <Text>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <a onClick={() => setIsLogin(!isLogin)}>
                  {isLogin ? 'Sign up' : 'Sign in'}
                </a>
              </Text>
            </div>
          </Form>
        </div>
      </Content>
      <Sider className="auth-sider" width="40%">
      <div className="auth-banner">
        <div className="banner-content">
          <img src={logo} alt="AssistDevs Logo" className="banner-logo" />
          <Title level={2} className="banner-title">
            Welcome to PredictiveDesk
          </Title>
          <Text className="banner-text">
            Streamline your development process with PredictiveDesk, trusted by thousands of developers worldwide. Create,
            manage, and collaborate seamlessly.
          </Text>
          </div>

          <div className="feature-list">
            <div className="feature-item">
              <CheckCircleOutlined className="feature-icon" />
              <div className="feature-content">
                <Title level={4} className="feature-title">Effortless Ticket Submission</Title>
                <Text className="feature-description">Easily submit and track tickets in real-time with our intuitive platform.</Text>
              </div>
            </div>
            <div className="feature-item">
              <LineChartOutlined className="feature-icon" />
              <div className="feature-content">
                <Title level={4} className="feature-title">Future Ticket Forecasting</Title>
                <Text className="feature-description">Predict ticket trends to optimize resource planning and workflows.</Text>
              </div>
            </div>

            <div className="feature-item">
              <TeamOutlined className="feature-icon" />
              <div className="feature-content">
                <Title level={4} className="feature-title">Workforce Optimization</Title>
                <Text className="feature-description">Efficiently manage your workforce to meet customer needs effectively.</Text>
              </div>
            </div>
          </div>
      </div>
    </Sider>
    </Layout>
    </>
  );
};

export default LoginPage;
