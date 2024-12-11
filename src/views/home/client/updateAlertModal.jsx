import React, { useState, useEffect } from 'react';
import { Modal, Spin, Card, Descriptions, Button, Space, Tag } from 'antd';
import { LoadingOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import { colors } from '../../../utils/colors';
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const TicketCreationPopup = ({ 
  isLoading, 
  visible,
  ticket, 
  onCancel,
  expectedResolutionTime,
  isUpdate
}) => {
    const [showLoading, setShowLoading] = useState(false);

    useEffect(() => {
        if (isLoading) {
            setShowLoading(true);
            setTimeout(() => {
                setShowLoading(false);
            }, 2000);
        }
    }, [isLoading]);
    return (
        <Modal
            visible={visible}
            footer={null}
            closable={!isLoading}
            maskClosable={!isLoading}
            onCancel={onCancel}
            width={500}
            centered
        >
            <Card>
                {showLoading ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <Space direction="vertical" size="large">
                            <Spin indicator={antIcon} />
                            <h3>{isUpdate ? 'Updating Ticket' : 'Creating Ticket'}</h3>
                            <p>Calculating expected resolution time using ML model...</p>
                        </Space>
                    </div>
                ) : (
                    <div>
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <CheckCircleOutlined style={{ fontSize: '32px', color: '#52c41a' }} />
                            <h3 style={{ margin: '16px 0' }}>{`Ticket ${isUpdate ? 'Updated' : 'Created'} Successfully`}</h3>
                        </div>
                        <Descriptions bordered column={1}>
                            <Descriptions.Item label="Name">{ticket?.name}</Descriptions.Item>
                            <Descriptions.Item label="Status">
                                <Tag color={ticket?.status === 'Active' ? 'blue' : 'green'}>
                                    {ticket?.status}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Priority">
                                <Tag color="volcano">{ticket?.priority}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Expected Resolution">
                                {expectedResolutionTime 
                                    ? (
                                        <>
                                            {format(new Date(expectedResolutionTime), 'MMMM dd, yyyy | HH:mm')}
                                            <br />
                                            <span style={{ fontSize: 'small', color: '#888' }}>
                                                Calculated using ML model
                                            </span>
                                        </>
                                    )
                                    : 'N/A'}
                            </Descriptions.Item>
                        </Descriptions>
                        <div style={{ textAlign: 'right', marginTop: '20px' }}>
                            <Button 
                                type="primary"
                                onClick={onCancel}
                                style={{
                                  background: colors.buttonColor['primary'],
                                  border: 'none',
                                  color: '#fff',
                                }}                  
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </Modal>
    );
};

export default TicketCreationPopup;
