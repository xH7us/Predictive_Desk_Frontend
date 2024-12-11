import React from 'react';
import { Modal, Descriptions, Tag, Typography, Space, Card } from 'antd';
import { format } from 'date-fns';
import {
  ClockCircleOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined,
  TagOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import humanize from 'humanize-string';

const { Title } = Typography;

const ViewTicketModal = ({ visible, onCancel, ticket }) => {
  if (!ticket) return null;

  const getStatusColor = (status) => {
    const colorMap = {
      Completed: 'green',
      Active: 'blue',
      Pending: 'orange'
    };
    return colorMap[status] || 'default';
  };

  const getPriorityColor = (priority) => {
    const colorMap = {
      low: 'green',
      medium: 'blue',
      high: 'orange',
      critical: 'red'
    };
    return colorMap[priority] || 'default';
  };

  const getUrgencyColor = (urgency) => {
    const colorMap = {
      low: 'green',
      medium: 'blue',
      high: 'red'
    };
    return colorMap[urgency] || 'default';
  };

  return (
    <Modal
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>Ticket Details</Title>
          <Tag color={getStatusColor(ticket.status)}>{humanize(ticket.status)}</Tag>
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      width={700}
      footer={null}
    >
      <Card>
        <Descriptions column={1} bordered>
          <Descriptions.Item 
            label={<Space><TagOutlined /> Ticket Name</Space>}
          >
            <strong>{ticket.name}</strong>
          </Descriptions.Item>

          <Descriptions.Item 
            label={<Space><ExclamationCircleOutlined /> Priority & Urgency</Space>}
          >
            <Space>
              <Tag color={getPriorityColor(ticket.priority)}>
                Priority: {ticket.priority?.toUpperCase()}
              </Tag>
              <Tag color={getUrgencyColor(ticket.urgency)}>
                Urgency: {ticket.urgency?.toUpperCase()}
              </Tag>
            </Space>
          </Descriptions.Item>

          <Descriptions.Item 
            label={<Space><TagOutlined /> Issue Type</Space>}
          >
            <Tag>{ticket.type}</Tag>
          </Descriptions.Item>

          <Descriptions.Item 
            label={<Space><CalendarOutlined /> Submission Time</Space>}
          >
            {ticket.date ? format(new Date(ticket.date), 'MMMM dd, yyyy | HH:MM') : 'N/A'}
          </Descriptions.Item>

          <Descriptions.Item 
            label={<Space><ClockCircleOutlined /> Expected Resolution Time</Space>}
          >
            {ticket.expected_resolution_time ? format(new Date(ticket.expected_resolution_time), 'MMMM dd, yyyy | HH:MM') : 'N/A'}
          </Descriptions.Item>

          <Descriptions.Item 
            label={<Space><ClockCircleOutlined /> Actual Resolution Time</Space>}
          >
            {ticket.actual_resolution_time && !isNaN(new Date(ticket.actual_resolution_time).getTime()) 
                ? format(new Date(ticket.actual_resolution_time), 'MMMM dd, yyyy | HH:mm') 
                : 'N/A'}
          </Descriptions.Item>
          <Descriptions.Item 
            label={<Space><FileTextOutlined /> Description</Space>}
          >
            <div style={{ whiteSpace: 'pre-wrap' }}>
              {ticket.description || 'No description provided'}
            </div>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </Modal>
  );
};

export default ViewTicketModal;