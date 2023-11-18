"use client";

import React from "react";

import "../styles/styles.scss";
import { Button, Layout, Typography } from "antd";

const { Content, Header, Sider } = Layout;

interface ServiceListPageProps {
  stepBack: (postCode: string) => void;
  postCode: string;
}

const ServiceListPage: React.FC<ServiceListPageProps> = ({
  stepBack,
  postCode,
}) => {
  const handleBackClick = () => {
    stepBack(postCode);
  };

  return (
    <div className="custom-view">
      <Layout>
        <Header>
          <Button onClick={handleBackClick}>Back</Button>
          <Typography.Title level={1} style={{ marginBottom: "30px" }}>
            Displaying results for Postcode {postCode}
          </Typography.Title>
            <Typography.Title level={3} italic style={{ marginBottom: "30px" }}>
                Found x results in n seconds
            </Typography.Title>
        </Header>

        <Content>
            List of results
        </Content>
      </Layout>
    </div>
  );
};

export default ServiceListPage;
