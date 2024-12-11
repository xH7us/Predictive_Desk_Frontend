// SettingsPage.jsx
import React, { useState } from 'react';
import { 
  Card, 
  Tabs, 
  Form, 
  Input, 
  Button, 
  Switch, 
  Upload, 
  message, 
  Divider,
  Select
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  BellOutlined, 
  UploadOutlined 
} from '@ant-design/icons';
import '../../assets/settings.css';

const { TabPane } = Tabs;
const { Option } = Select;

const SettingsPage = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (values) => {
    setLoading(true);
    setTimeout(() => {
      message.success('Settings updated successfully');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="settings-page">
      <Card>
        <Tabs defaultActiveKey="1">
          {/* Profile Settings */}
          <TabPane 
            tab={
              <span>
                <UserOutlined />
                Profile Settings
              </span>
            } 
            key="1"
          >
            <Form
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                name: 'John Doe',
                email: 'john@example.com',
                phone: '+1 234 567 890',
                language: 'english'
              }}
            >
              <Form.Item
                label="Profile Picture"
                name="avatar"
              >
                <Upload
                  maxCount={1}
                  listType="picture-card"
                  showUploadList={false}
                  beforeUpload={() => false}
                >
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>

              <Form.Item
                label="Full Name"
                name="name"
                rules={[{ required: true, message: 'Please input your name!' }]}
              >
                <Input prefix={<UserOutlined />} />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Phone Number"
                name="phone"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Preferred Language"
                name="language"
              >
                <Select>
                  <Option value="english">English</Option>
                  <Option value="spanish">Spanish</Option>
                  <Option value="french">French</Option>
                </Select>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Save Changes
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          {/* Security Settings */}
          <TabPane 
            tab={
              <span>
                <LockOutlined />
                Security
              </span>
            } 
            key="2"
          >
            <Form layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                label="Current Password"
                name="currentPassword"
                rules={[{ required: true, message: 'Please input your current password!' }]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="New Password"
                name="newPassword"
                rules={[
                  { required: true, message: 'Please input your new password!' },
                  { min: 6, message: 'Password must be at least 6 characters!' }
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Please confirm your password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject('Passwords do not match!');
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                label="Two-Factor Authentication"
                name="twoFactor"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Update Security Settings
                </Button>
              </Form.Item>
            </Form>
          </TabPane>

          {/* Notification Settings */}
          <TabPane 
            tab={
              <span>
                <BellOutlined />
                Notifications
              </span>
            } 
            key="3"
          >
            <Form layout="vertical" onFinish={handleSubmit}>
              <Form.Item
                label="Email Notifications"
                name="emailNotifications"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch />
              </Form.Item>

              <Divider orientation="left">Notification Preferences</Divider>

              <Form.Item
                label="New Messages"
                name="messageNotifications"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch />
              </Form.Item>

              <Form.Item
                label="Project Updates"
                name="projectNotifications"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch />
              </Form.Item>

              <Form.Item
                label="Task Assignments"
                name="taskNotifications"
                valuePropName="checked"
                initialValue={true}
              >
                <Switch />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                  Save Preferences
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default SettingsPage;