import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Row, Col, Card, Select, Tag, Typography, Badge, DatePicker, Divider, Button, message } from 'antd';
import dayjs from 'dayjs';
import { ClockCircleFilled, DownloadOutlined, ClockCircleOutlined, EditOutlined, EyeOutlined, FilterOutlined, UserOutlined } from '@ant-design/icons';
import { fetchAllTickets, updateTicket } from '../../appRedux/action/ticketsAction';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import EditTicketModal from '../home/client/editTicketModal';
import ViewTicketModal from '../home/client/viewTicketModal';
import { getAllUsers } from '../../appRedux/action/userAction';
import { exportTicketsToCsv } from '../helper/utils';
import { getPriorityColor, colors, getStatusColor } from '../../utils/colors';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;


const TicketBoard = () => {
    const dispatch = useDispatch();
    const [selectedEmployee, setSelectedEmployee] = useState('All');
    const { tickets, loading, error } = useSelector((state) => state.tickets);
    const { allUsers } = useSelector((state) => state.users);

    const [currentTickets, setCurrentTickets] = useState(tickets);
    const [dateRange, setDateRange] = useState([
        dayjs().subtract(30, 'day'),
        dayjs()
    ]);
    const [employees, setEmployees] = useState(allUsers);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isCreatingTicket, setIsCreatingTicket] = useState(false);
    const [newTicket, setNewTicket] = useState(null);
    const [creationModalVisible, setCreationModalVisible] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);

    useEffect(() => {
        dispatch(fetchAllTickets());
        dispatch(getAllUsers());
    }, [dispatch]);

    useEffect(() => {
        if (tickets) {
            setCurrentTickets(tickets);
        }
        if (allUsers) {
            setEmployees(['All', ...allUsers.map(user => user.email)]);
        }
    }, [allUsers, tickets]);

    const handleAction = (record, type) => {
        setSelectedRecord(record);
        if (type === 'view') {
            setViewModalVisible(true);
        } else if (type === 'edit') {
            setEditModalVisible(true);
        }
    };

    const handleEdit = async (values) => {
        try {
            setIsUpdate(true);
            setIsCreatingTicket(true);
            setCreationModalVisible(true);
            const data = await dispatch(updateTicket({ id: values?._id, ticketData: values })).unwrap();
            setNewTicket(data);
            setEditModalVisible(false);
            await dispatch(fetchAllTickets());
        } catch (error) {
            setIsUpdate(false);
            setIsCreatingTicket(false);
            setCreationModalVisible(false);
            message.error('Failed to update ticket');
        }
    };

    const getFilteredTickets = (status) => {
        return currentTickets
            .filter(ticket => {
                // Employee filter
                if (selectedEmployee !== 'All' && ticket.user_id.email !== selectedEmployee) {
                    return false;
                }

                // Date range filter
                if (dateRange && dateRange[0] && dateRange[1]) {
                    const ticketDate = dayjs(ticket.date);
                    return ticketDate.isAfter(dateRange[0]) && ticketDate.isBefore(dateRange[1]);
                }

                return true;
            })
            .filter(ticket => ticket.status === status);
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;
    
        // Get the source ticket
        const sourceTicket = currentTickets.find(t => t._id === result.draggableId);
    
        // Prevent dragging if source is resolved or destination is invalid
        if (sourceTicket.status === 'resolved') return;
    
        const newTickets = [...currentTickets];
        const sourceIndex = newTickets.findIndex(t => t._id === result.draggableId);
        const [movedTicket] = newTickets.splice(sourceIndex, 1);
    
        // Create a new ticket object with updated status
        const updatedTicket = {
            ...movedTicket,
            status: result.destination.droppableId,
            ...(result.destination.droppableId === 'resolved' && { 
                actual_resolution_time: new Date().toISOString() // Set current time if resolved
            }),
        };
    
        // Find the destination index
        const destinationTickets = getFilteredTickets(result.destination.droppableId);
        const allTickets = [...newTickets];
        const destinationIndex = allTickets.findIndex(t => {
            if (result.destination.index === 0) return true;
            return t._id === destinationTickets[result.destination.index - 1]?._id;
        });
    
        // Add the updated ticket into the new tickets array
        newTickets.splice(destinationIndex + 1, 0, updatedTicket);
    
        // Update the tickets in the local state (optimistically)
        setCurrentTickets(newTickets);
    
        try {
            // Dispatch the action to update the ticket in the Redux store
            await dispatch(updateTicket({ id: updatedTicket._id, ticketData: updatedTicket })).unwrap();
            dispatch(fetchAllTickets());

            // Optionally, fetch the updated tickets list if needed
            // const response = await fetch('/api/tickets');
            // const updatedTickets = await response.json();
            // setCurrentTickets(updatedTickets); // Update the UI with the fetched tickets
        } catch (error) {
            setCurrentTickets(currentTickets);
        }
    };
    
    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
    };

    const handleExportCsv = () => {
        // Apply the same filtering logic used in getFilteredTickets
        const filteredTickets = currentTickets.filter(ticket => {
            if (selectedEmployee !== 'All' && ticket.user_id.email !== selectedEmployee) {
                return false;
            }
            if (dateRange && dateRange[0] && dateRange[1]) {
                const ticketDate = dayjs(ticket.date);
                return ticketDate.isAfter(dateRange[0]) && ticketDate.isBefore(dateRange[1]);
            }
            return true;
        });

        exportTicketsToCsv(filteredTickets);
    };

    return (
        <div className="p-6">
            <Row gutter={[16, 24]}>
                <Col span={24}>
                    <Card>
                        <Row justify="space-between" align="middle" gutter={[16, 16]}>
                            <Col>
                                <Title level={3} style={{ margin: 0 }}>Tickets Tracking Board</Title>
                            </Col>
                            <Col>
                                <Row gutter={16} align="middle">
                                    <Col>
                                        <FilterOutlined />{' '}
                                        <Select
                                            style={{ width: 200 }}
                                            value={selectedEmployee}
                                            onChange={setSelectedEmployee}
                                            placeholder="Filter by Employee"
                                        >
                                            {employees.map(emp => (
                                                <Option key={emp} value={emp}>{emp}</Option>
                                            ))}
                                        </Select>
                                    </Col>
                                    <Col>
                                        <RangePicker
                                            value={dateRange}
                                            onChange={handleDateRangeChange}
                                            allowClear={false}
                                        />
                                    </Col>
                                    <Col>
                                        <Button 
                                            type="primary" 
                                            icon={<DownloadOutlined />} 
                                            onClick={handleExportCsv}
                                            style={{
                                                background: colors.buttonColor['primary'],
                                                border: 'none',
                                                color: '#fff',
                                            }}
                                        >
                                            Export CSV
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Row gutter={[16, 16]} className="mt-4">
                    {/* Pending Column */}
                    <Col span={8}>
                        <Card
                            // style={{ backgroundColor: getStatusColor('pending') }}
                            title={
                                <Row style={{ paddingTop: 10 }}>

                                    <Badge
                                        count={getFilteredTickets('pending').length}
                                        style={{ backgroundColor: getStatusColor('pending') }}
                                    >
                                        <Text strong style={{ marginRight: 8 }}>Pending</Text>
                                    </Badge>
                                </Row>
                            }
                            headStyle={{ backgroundColor: colors.statusColors['pending'], color: '#000' }}
                            bodyStyle={{ padding: '8px', minHeight: '400px' }}
                        >
                            <Droppable droppableId="pending">
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="space-y-2"
                                    >
                                        {getFilteredTickets('pending').map((ticket, index) => (
                                            <Draggable key={ticket._id} draggableId={ticket._id} index={index}>
                                                {(provided) => (
                                                    <Card
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        size="small"
                                                        title={<>
                                                            <Row justify={'space-between'}>
                                                                <Text>{ticket.name}</Text>
                                                                <Col>
                                                                    <Button type="link" size="small" onClick={() => handleAction(ticket, 'view')}><EyeOutlined /></Button>
                                                                    <Button type="link" size="small" onClick={() => handleAction(ticket, 'edit')}><EditOutlined /></Button>
                                                                </Col>
                                                            </Row>
                                                        </>}
                                                    >
                                                        {/* <Text strong>{ticket.title}</Text>                             */}
                                                        <Row>
                                                            <Col>
                                                                <Tag color="blue">{ticket.urgency}</Tag>
                                                                <Tag color={getPriorityColor(ticket.priority)}>{ticket.priority}</Tag>
                                                                <Tag color="black">{ticket.type}</Tag>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col>
                                                                <Text>{ticket.description}</Text>
                                                            </Col>
                                                        </Row>
                                                        <Row justify={'space-between'}>
                                                            <Col>
                                                                <Tag><UserOutlined />{' '}{ticket.user_id?.email}</Tag>
                                                            </Col>
                                                            <Col>
                                                                <Tag>

                                                                    <ClockCircleFilled />
                                                                    {' '}{format(new Date(ticket.date), 'MMMM dd, yyyy | HH:mm')}
                                                                </Tag>
                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </Card>
                    </Col>

                    {/* Active Column */}
                    <Col span={8}>
                        <Card
                            title={
                                <div style={{ paddingTop: 10 }}>

                                    <Badge
                                        count={getFilteredTickets('active').length}
                                        style={{ backgroundColor: getStatusColor('active') }}
                                    >
                                        <Text strong style={{ marginRight: 8 }}>Active</Text>
                                    </Badge>
                                </div>
                            }
                            bodyStyle={{ padding: '8px', minHeight: '400px' }}
                            headStyle={{ backgroundColor: colors.statusColors['active'], color: '#000' }}
                        >
                            <Droppable droppableId="active">
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="space-y-2"
                                    >
                                        {getFilteredTickets('active').map((ticket, index) => (
                                            <Draggable key={ticket._id} draggableId={ticket._id} index={index}>
                                                {(provided) => (
                                                    <Card
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        size="small"
                                                        className="mb-2"
                                                        title={<>
                                                            <Row justify={'space-between'}>
                                                                <Text>{ticket.name}</Text>
                                                                <Col>
                                                                    <Button type="link" size="small" onClick={() => handleAction(ticket, 'view')}><EyeOutlined /></Button>
                                                                    <Button type="link" size="small" onClick={() => handleAction(ticket, 'edit')}><EditOutlined /></Button>
                                                                </Col>
                                                            </Row>
                                                        </>}
                                                    >
                                                        <Row>
                                                            <Col>
                                                                <Tag color="blue">{ticket.urgency}</Tag>
                                                                <Tag color={getPriorityColor(ticket.priority)}>{ticket.priority}</Tag>
                                                                <Tag color="black">{ticket.type}</Tag>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col>
                                                                <Text>{ticket.description}</Text>
                                                            </Col>
                                                        </Row>
                                                        <Row justify={'space-between'}>
                                                            <Col>
                                                                <Tag><UserOutlined />{' '}{ticket.user_id?.email}</Tag>
                                                            </Col>
                                                            <Col>
                                                                <Tag>

                                                                    <ClockCircleFilled />
                                                                    {' '}{format(new Date(ticket.date), 'MMMM dd, yyyy | HH:mm')}
                                                                </Tag>
                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </Card>
                    </Col>

                    {/* Resolved Column */}
                    <Col span={8}>
                        <Card
                            title={
                                <div style={{ paddingTop: 10 }}>
                                    <Badge
                                        count={getFilteredTickets('resolved').length}
                                        style={{ backgroundColor: getStatusColor('resolved') }}
                                    >
                                        <Text strong style={{ marginRight: 8 }}>Resolved</Text>
                                    </Badge>
                                </div>
                            }
                            bodyStyle={{ padding: '8px', minHeight: '400px' }}
                            headStyle={{ backgroundColor: colors.statusColors['resolved'], color: '#000' }}
                        >
                            <Droppable droppableId="resolved">
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className="space-y-2"
                                    >
                                        {getFilteredTickets('resolved').map((ticket, index) => (
                                            <Draggable
                                                key={ticket._id}
                                                draggableId={ticket._id}
                                                index={index}
                                                isDragDisabled={true}
                                            >
                                                {(provided) => (
                                                    <Card
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        size="small"
                                                        className="mb-2 opacity-75"
                                                        title={<>
                                                            <Row justify={'space-between'}>
                                                                <Text>{ticket.name}</Text>
                                                                <Col>
                                                                    <Button type="link" size="small" onClick={() => handleAction(ticket, 'view')}><EyeOutlined /></Button>
                                                                </Col>
                                                            </Row>
                                                        </>}
                                                    >
                                                        <Row>
                                                            <Col>
                                                                <Tag color="blue">{ticket.urgency}</Tag>
                                                                <Tag color={getPriorityColor(ticket.priority)}>{ticket.priority}</Tag>
                                                                <Tag color="black">{ticket.type}</Tag>
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col>
                                                                <Text>{ticket.description}</Text>
                                                            </Col>
                                                        </Row>
                                                        <Row justify={'space-between'}>
                                                            <Col>
                                                                <Tag><UserOutlined />{' '}{ticket.user_id?.email}</Tag>
                                                            </Col>
                                                            <Col>
                                                                <Tag>

                                                                    <ClockCircleFilled />
                                                                    {' '}{format(new Date(ticket.date), 'MMMM dd, yyyy | HH:mm')}
                                                                </Tag>
                                                            </Col>
                                                        </Row>
                                                    </Card>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </Card>
                    </Col>
                </Row>
            </DragDropContext>
            <EditTicketModal
                visible={editModalVisible}
                onCancel={() => setEditModalVisible(false)}
                onSubmit={handleEdit}
                initialValues={selectedRecord}
            />
            <ViewTicketModal
                visible={viewModalVisible}
                onCancel={() => {
                    setViewModalVisible(false);
                }}
                ticket={selectedRecord}
            />

        </div>
    );
};

export default TicketBoard;