import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Row, Col, Button, DatePicker } from 'antd';
import { IssuePriority, IssueType, IssueUrgency, TicketStatus } from '../../../types';
import dayjs from 'dayjs';
import { colors } from '../../../utils/colors';
const { Option } = Select;

const EditTicketModal = ({ visible, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      const formattedValues = {
        ...initialValues,
        // Convert the resolution time to dayjs object if it exists
        actual_resolution_time: initialValues.actual_resolution_time ? 
          dayjs(initialValues.actual_resolution_time) : null
      };
      form.setFieldsValue(formattedValues);
    }
  }, [initialValues, form]);

  const handleSubmit = (values) => {
    const formattedValues = {
      ...values,
      actual_resolution_time: values.actual_resolution_time?.toISOString()
    };
    onSubmit(formattedValues);
  };

  const disabledDate = (current) => {
    const ticketCreationDate = initialValues?.date ? 
      dayjs(initialValues.date) : dayjs();
    return current && current < ticketCreationDate.startOf('day');
  };

  const disabledTime = (current) => {
    if (!current) return {};
    
    const ticketCreationDate = initialValues?.created_at ? 
      dayjs(initialValues.created_at) : dayjs();
    
    if (current.isSame(ticketCreationDate, 'day')) {
      const currentHour = ticketCreationDate.hour();
      return {
        disabledHours: () => Array.from(
          { length: currentHour }, 
          (_, i) => i
        )
      };
    }
    return {};
  };

  return (
    <Modal
      title="Edit Ticket"
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form 
        form={form} 
        layout="vertical" 
        onFinish={handleSubmit}
      >
        <Row gutter={16}>
          <Form.Item name="_id" hidden={true}/>
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
              label="Status"
              name="status"
              rules={[{ required: true, message: 'Please select status' }]}
            >
              <Select placeholder="Select status">
                {Object.entries(TicketStatus).map(([key, value]) => (
                  <Option key={key} value={value}>{value}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
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
              label="Resolution Time"
              name="actual_resolution_time"
              rules={[{ required: false, message: 'Please select resolution date and time' }]}
            >
              <DatePicker
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                placeholder="Select date and time"
                style={{ width: '100%' }}
                disabledDate={disabledDate}
                disabledTime={disabledTime}
              />
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
            htmlType="submit"
          >
            Update Ticket
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTicketModal;