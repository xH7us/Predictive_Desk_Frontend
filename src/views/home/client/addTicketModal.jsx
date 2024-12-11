import React from 'react';
import { Modal, Form, Input, Select, Row, Col, Button } from 'antd';
import { IssuePriority, IssueType, IssueUrgency } from '../../../types';
import { colors } from '../../../utils/colors';
const { Option } = Select;

const AddTicketModal = ({ visible, onCancel, onSubmit, form }) => {
  return (
    <Modal
      title="Create New Ticket"
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Ticket Name"
              name="name"
              rules={[{ required: true, message: 'Please enter ticket name' }]}
            >
              <Input placeholder="Ticket name" />
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              label="Urgency"
              name="urgency"
              rules={[{ required: true, message: 'Please select urgency' }]}
            >
              <Select placeholder="Select urgency">
                {Object.entries(IssueUrgency).map(([key, value]) => (
                  <Option key={key} value={value}>{value}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Issue Type"
              name="type"
              rules={[{ required: true, message: 'Please select issue type' }]}
            >
              <Select placeholder="Select issue type">
                {Object.entries(IssueType).map(([key, value]) => (
                  <Option key={key} value={value}>{value}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          
          <Col span={12}>
            <Form.Item
              label="Priority"
              name="priority"
              rules={[{ required: true, message: 'Please select priority' }]}
            >
              <Select placeholder="Select priority">
                {Object.entries(IssuePriority).map(([key, value]) => (
                  <Option key={key} value={value}>{value}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please enter description' }]}
        >
          <Input.TextArea placeholder="Enter ticket description" rows={4} />
        </Form.Item>
        
        <Form.Item>
          <Button 
            style={{
              background: colors.buttonColor['primary'],
              border: 'none',
              color: '#fff',
            }}                  
            type="primary"
            htmlType="submit">
            Create Ticket
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddTicketModal;