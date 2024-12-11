import React, { useState } from "react";
import { Table, Tabs, Select, Tag } from "antd";

// Sample ticket data
const sampleData = [
  {
    key: "1",
    username: "Alice",
    ticketId: "TKT001",
    status: "Pending",
    description: "Issue with login",
  },
  {
    key: "2",
    username: "Bob",
    ticketId: "TKT002",
    status: "Resolved",
    description: "Unable to access the dashboard",
  },
  {
    key: "3",
    username: "Charlie",
    ticketId: "TKT003",
    status: "Active",
    description: "System crash during usage",
  },
  // Add more sample tickets as needed
];

// Status tags color mapping
const statusColor = {
  Pending: "orange",
  Resolved: "green",
  Active: "blue",
};

const AdminTicketsLayout = () => {
  const [filteredData, setFilteredData] = useState(sampleData);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedEmployee, setSelectedEmployee] = useState("All");

  // Employee list for filtering (dynamically generated from data)
  const employeeList = ["All", ...new Set(sampleData.map(ticket => ticket.username))];

  // Columns for the tickets table
  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Ticket ID",
      dataIndex: "ticketId",
      key: "ticketId",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusColor[status]}>{status}</Tag>
      ),
    },
  ];

  // Filter data based on selected status and employee
  const handleFilter = () => {
    const filtered = sampleData.filter(ticket => {
      const matchesStatus = selectedStatus === "All" || ticket.status === selectedStatus;
      const matchesEmployee = selectedEmployee === "All" || ticket.username === selectedEmployee;
      return matchesStatus && matchesEmployee;
    });
    setFilteredData(filtered);
  };

  return (
    <div>
      <h2>Employee Ticket Management</h2>

      {/* Filters */}
      <div style={{ marginBottom: 20 }}>
        <Select
          style={{ width: 200, marginRight: 10 }}
          placeholder="Filter by Status"
          onChange={(value) => {
            setSelectedStatus(value);
            handleFilter();
          }}
          defaultValue="All"
        >
          <Select.Option value="All">All</Select.Option>
          <Select.Option value="Pending">Pending</Select.Option>
          <Select.Option value="Resolved">Resolved</Select.Option>
          <Select.Option value="Active">Active</Select.Option>
        </Select>

        <Select
          style={{ width: 200 }}
          placeholder="Filter by Employee"
          onChange={(value) => {
            setSelectedEmployee(value);
            handleFilter();
          }}
          defaultValue="All"
        >
          {employeeList.map(employee => (
            <Select.Option key={employee} value={employee}>
              {employee}
            </Select.Option>
          ))}
        </Select>
      </div>

      {/* Ticket Table */}
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="All Tickets" key="1">
          <Table columns={columns} dataSource={filteredData} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default AdminTicketsLayout;
