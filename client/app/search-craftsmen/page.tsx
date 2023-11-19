"use client";

import React from "react";
import { useState } from "react";
import {
  Layout,
  ConfigProvider,
  FloatButton,
  Steps,
  message,
  Spin,
  Tooltip,
} from "antd";
import theme from "../../theme/themeConfig";
import {
  EnvironmentOutlined,
  SolutionOutlined,
  CheckCircleOutlined,
  EditOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import "../../styles/styles.scss";
import UpdateModal from "../../components/UpdateModal";
import PostCodePage from "../../components/PostCodePage";
import ServiceListPage from "../../components/ServiceListPage";
import { getListOfCraftsmen } from "../../services/craftsmenAPI";

const { Content, Header } = Layout;

interface Craftsman {
  id: number;
  name: string;
  city: string;
  street: string;
  houseNumber: string;
  rankingScore: number;
  distance: number;
}

const SearchPage = () => {
  const [stepItems, setStepItems] = useState([
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
  ]);

  const [currentStep, setCurrentStep] = useState(0);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedPostCode, setSelectedPostCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [craftsmen, setCraftsmen] = useState<Craftsman[]>([]);
  

  const showUpdateModal = () => {
    setUpdateModalVisible(true);
  };

  const handleSearch = (postcode: string) => {
    setLoading(true);
    getListOfCraftsmen(parseInt(selectedPostCode)).then((response) => {
      setCraftsmen(response);
      setLoading(false);
    });
    setCurrentStep(1);
    setStepItems((prevStepItems) => [
      {
        ...prevStepItems[0],
        status: "finish",
        icon: <CheckCircleOutlined />,
      },
      {
        ...prevStepItems[1],
        status: "in progress",
      },
      prevStepItems[2], // No change for the third step
    ]);
    setSelectedPostCode(postcode);
  };

  const handleBackClick = (postCode: string) => {
    setCurrentStep(0);
    setStepItems((prevStepItems) => [
      {
        ...prevStepItems[0],
        status: "in progress",
        icon: <EnvironmentOutlined />,
      },
      {
        ...prevStepItems[1],
        status: "wait",
      },
      prevStepItems[2], // No change for the third step
    ]);
    setSelectedPostCode(postCode);
  };

  return (
    <ConfigProvider theme={theme}>
      <div className="main-layout">
        {currentStep === 0 ? (
          <Tooltip title="Edit Worker Profile">
            <FloatButton
              icon={<EditOutlined />}
              type="primary"
              onClick={showUpdateModal}
              style={{ height: "75px", width: "75px" }}
            />
          </Tooltip>
        ) : null}
        <Layout className="sub-layout">
          <Header className="page-header">
            <Steps className="steps" items={stepItems} current={currentStep} />
          </Header>
          <Content className="content">
            {currentStep === 0 ? (
              <PostCodePage
                onSearch={handleSearch}
                postCode={selectedPostCode}
              />
            ) : currentStep === 1 ? (
              <ServiceListPage
                stepBack={() => handleBackClick(selectedPostCode)}
                postCode={selectedPostCode}
                craftsmen={craftsmen}
                setCraftsmen={setCraftsmen}
                loading={loading}
                setLoading={setLoading}
              />
            ) : null}
          </Content>
        </Layout>
      </div>
      <UpdateModal
        open={updateModalVisible}
        setOpen={setUpdateModalVisible}
        onUpdate={() => {
          // TODO: Add logic to handle the update
          console.log("update");
        }}
      />
    </ConfigProvider>
  );
};

export default SearchPage;
