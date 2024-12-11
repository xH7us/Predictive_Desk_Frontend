import React, { useState, useEffect } from 'react';
import { Badge, DatePicker, Button, Calendar, Modal, Popconfirm,
  Select, Card, Col, Row, Form, message, Input } from 'antd';
import 'chart.js/auto';
import { PlusCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEvents, createEvent, deleteEvent } from '../../appRedux/action/eventScheduleAction'; // Adjust the path as necessary
import { format, parseISO, isSameDay } from 'date-fns';
import { colors } from '../../utils/colors';

const { Option } = Select;
const EventsCalendar = () => {
  const dispatch = useDispatch();
  const { allEvents } = useSelector((state) => state.eventSchedule);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const isDateTaken = (date) => {
    return allEvents?.some(event => isSameDay(parseISO(event.event_details.date), date));
  };

  const addEvent = (values) => {
    const { date, eventType, eventName } = values;
    if (isDateTaken(date)) {
      message.error('An event is already scheduled for this date.');
      return;
    }
    const newEvent = {
      date: date.format('YYYY-MM-DD'),
      eventType,
      eventName,
    };
    dispatch(createEvent(newEvent));
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleDeleteEvent = async (eventId) => {
    await dispatch(deleteEvent(eventId));
    await dispatch(fetchEvents());
  };

  const disablePastDates = (current) => {
    return current && current < new Date().setHours(0, 0, 0, 0);
  };

  const renderDateCell = (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const dayEvents = allEvents?.filter((event) =>
      format(new Date(event.event_details.date), 'yyyy-MM-dd') === formattedDate
    );
    return (
      <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
        {dayEvents?.map((event, index) => (
          <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Badge color={event.event_details.type === 'Holiday' ? 'red' : 'green'} text={event.event_details.type} />
            <Popconfirm
              title="Are you sure to delete this event?"
              onConfirm={() => handleDeleteEvent(event._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="text" icon={<DeleteOutlined />} style={{ marginLeft: 8 }} />
            </Popconfirm>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Admin Calendar">
            <Button
              type="primary"
              onClick={() => setIsModalVisible(true)}
              style={{
                marginBottom: '16px',
                background: colors.buttonColor['primary'],
                border: 'none',
                color: '#fff',
              }}
            >
              <PlusCircleOutlined /> Add Event
            </Button>
            <Calendar dateCellRender={renderDateCell} />
          </Card>
        </Col>
      </Row>

      <Modal
        title="Add Event"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={addEvent} layout="vertical">
          <Form.Item
            name="date"
            label="Select Date"
            rules={[{ required: true, message: 'Please select a date!' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              disabledDate={disablePastDates}
            />
          </Form.Item>
          <Form.Item
            name="eventType"
            label="Event Type"
            rules={[{ required: true, message: 'Please select event type!' }]}
          >
            <Select placeholder="Select event type">
              <Option value="Holiday">Holiday</Option>
              <Option value="Product Release">Product Release</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="eventName"
            label="Event Name"
            rules={[{ required: true, message: 'Please enter an event name!' }]}
          >
            <Input placeholder="Enter event name" />
          </Form.Item>
          <Form.Item>
            <Button type="primary"
            htmlType="submit" 
            style={{
              width: '100%',
              background: colors.buttonColor['primary'],
              border: 'none',
              color: '#fff',
            }}
            >
              Add Event
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EventsCalendar;
