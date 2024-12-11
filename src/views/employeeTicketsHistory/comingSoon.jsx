import React from 'react';
import { Card, Typography } from 'antd';

const ComingSoon = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <Card 
        title={<Typography.Title level={2}>Coming Soon!</Typography.Title>} 
        bordered={false} 
        style={{ maxWidth: 600, margin: 'auto', padding: '20px' }}
      >
        <Typography.Paragraph>
          We are working hard to bring you something amazing. Stay tuned for updates!
        </Typography.Paragraph>
        {/* <Button type="primary" size="large" disabled>
          Notify Me
        </Button> */}
      </Card>
    </div>
  );
};

export default ComingSoon;
