"use client";

import React from "react";

import "../styles/styles.scss";
import { Button, Layout, Typography } from "antd";
import { LeftOutlined } from "@ant-design/icons";

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
    <Layout className="list-layout">
      <Header className="list-header">
        <Button type="primary" onClick={handleBackClick} style={{marginTop: 10}}>
          <LeftOutlined/>
          Edit Postcode
          </Button>
        <Typography.Title level={3}>
          Craftsmen in your area
          
        </Typography.Title>
        <Typography.Title level={5}> found x results</Typography.Title>
      </Header>
      <Layout className="list-sublayout">
        <Sider className="list-sider" width={"25%"}>
          Sort results by:



        </Sider>
        <Content className="list-content">{"List of results"}</Content>
      </Layout>
    </Layout>
  );
};

export default ServiceListPage;
