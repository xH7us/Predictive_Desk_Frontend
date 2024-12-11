import React from "react";
import { Card, Tag, Button, Typography } from "antd";
import { ClockCircleFilled } from "@ant-design/icons";
import { Draggable } from "react-beautiful-dnd";

const { Text } = Typography;

const TicketCard = ({ ticket, index }) => {
  return (
    <Draggable key={ticket.id} draggableId={ticket.id} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          size="small"
          className="mb-2"
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #d9d9d9",
          }}
        >
          {/* Banner Title */}
          <div
            style={{
              backgroundColor: "#e6f7ff",
              padding: "6px 10px",
              borderRadius: "4px",
              textAlign: "center",
              marginBottom: "8px",
            }}
          >
            <Text strong>{ticket.title}</Text>
          </div>

          {/* Tags */}
          <div style={{ marginBottom: "8px" }}>
            <Tag color="blue">{ticket.employee}</Tag>
            <Tag >{ticket.priority}</Tag>
          </div>

          {/* Reported Time */}
          <div style={{ marginBottom: "8px", color: "#8c8c8c", fontSize: "12px", display: "flex", alignItems: "center" }}>
            <ClockCircleFilled style={{ marginRight: "4px" }} />
            {ticket.createdAt}
          </div>

          {/* Action Buttons */}
          <div style={{ marginTop: "auto", textAlign: "right" }}>
            <Button type="link" size="small" onClick={() => console.log('Clicked')}>Show Details</Button>
            <Button type="link" size="small" onClick={() => console.log('Clicked')}>Edit</Button>
          </div>
        </Card>
      )}
    </Draggable>
  );
};

export default TicketCard;
