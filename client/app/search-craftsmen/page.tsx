"use client";

import React from "react";
import { useState } from "react";
import { Layout, ConfigProvider, FloatButton, Steps } from "antd";
import theme from "../../theme/themeConfig";
import {
  EnvironmentOutlined,
  SolutionOutlined,
  CheckCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import "../../styles/styles.scss";
import UpdateModal from "../../components/UpdateModal";
import PostCodePage from "../../components/PostCodePage";
import ServiceListPage from "../../components/ServiceListPage";

const { Content, Header } = Layout;
const stepItems = [
  {
    title: "Enter your postcode",
    status: "in progress",
    icon: <EnvironmentOutlined />,
  },
  {
    title: "Choose your service",
    status: "wait",
    icon: <SolutionOutlined />,
  },
  {
    title: "Done!",
    status: "wait",
    icon: <CheckCircleOutlined />,
  },
];

// ... (other imports)

const SearchPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const showUpdateModal = () => {
    setUpdateModalVisible(true);
  };

  const hideUpdateModal = () => {
    setUpdateModalVisible(false);
  };

  const handleSearch = (postcode: string) => {
    setCurrentStep(1);
    stepItems[0].status = "finish";
    stepItems[0].icon = <CheckCircleOutlined />;
    stepItems[1].status = "in progress";
  };

  const handleBackClick = () => {
    setCurrentStep(0);
    stepItems[0].status = "in progress";
    stepItems[0].icon = <EnvironmentOutlined />;
    stepItems[1].status = "wait";
  };

  return (
    <ConfigProvider theme={theme}>
      <div className="main-layout">
        <FloatButton
          icon={<EditOutlined />}
          type="primary"
          onClick={showUpdateModal}
          style={{ height: "75px", width: "75px" }}
        />
        <Layout className="sub-layout">
          <Header className="page-header">
            <Steps className="steps" items={stepItems} current={currentStep} />
          </Header>
          <Content className="content">
            {currentStep === 0 ? (
              <PostCodePage onSearch={handleSearch} />
            ) : currentStep === 1 ? (
              <ServiceListPage stepBack={handleBackClick} />
            ) : null}
          </Content>
        </Layout>
      </div>
      <UpdateModal
        visible={updateModalVisible}
        onCancel={hideUpdateModal}
        onUpdate={() => {
          // TODO: Add logic to handle the update
          console.log("update");
        }}
      />
    </ConfigProvider>
  );
};

export default SearchPage;
