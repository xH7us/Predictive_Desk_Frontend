import React from "react";
import { Tabs, Card } from "antd";
import EmployeeListPage from "./employees";
import EventsCalendar from './eventPlanning';
// import ComingSoon from "./comingSoon";

const { TabPane } = Tabs;

const TabsPage = () => {
  return (
    <Card style={{ margin: "16px", borderRadius: "8px" }}>
      <Tabs defaultActiveKey="1" type="line">
        <TabPane tab="Calendar" key="1">
          <EventsCalendar title="Calendar" />
        </TabPane>
        <TabPane tab="Employees" key="2">
          <EmployeeListPage title="Employees" />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default TabsPage;
