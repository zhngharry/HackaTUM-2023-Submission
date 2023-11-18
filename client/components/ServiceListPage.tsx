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
    <Layout className="list-layout">
      <Header className="list-header" >
        <Button onClick={handleBackClick}>Edit Postcode</Button>
        <Typography.Title level={3}> Displaying results for Postcode {postCode} </Typography.Title>
        <div></div>
      </Header>
      <Content>{"List of results"}</Content>
    </Layout>
  );
};

export default ServiceListPage;
