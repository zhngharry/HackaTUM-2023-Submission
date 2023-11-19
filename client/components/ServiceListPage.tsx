"use client";

import React from "react";
import { useState } from "react";
import "../styles/styles.scss";
import {
  Button,
  Layout,
  Typography,
  Card,
  Menu,
  Dropdown,
  Space,
  MenuProps,
  Spin,
} from "antd";
import ServiceCard from "./ServiceCard";
import { DownOutlined, LeftOutlined, LoadingOutlined } from "@ant-design/icons";

const { Content, Header, Sider } = Layout;

interface Craftsman {
  id: number;
  name: string;
  city: string;
  street: string;
  houseNumber: string;
  rankingScore: number;
  distance: number;
}

interface ServiceListPageProps {
  stepBack: (postCode: string) => void;
  postCode: string;
  craftsmen: Craftsman[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const imageFilenames = [
  "two.jpg",
  "three.jpg",
  "four.jpg",
  "five.jpg",
  "six.jpg",
];

const ServiceListPage: React.FC<ServiceListPageProps> = ({
  stepBack,
  postCode,
  craftsmen,
  loading,
  setLoading,
}) => {
  const handleBackClick = () => {
    stepBack(postCode);
  };

  const handleLoadMore = () => {};

  const [sortType, setSortType] = useState<string>("0");

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    setSortType(e.key);
    // setCraftsmen(getListOfCraftsmen(postCode, e.key));
  };

  const items: MenuProps["items"] = [
    {
      label: "Relevance" + (sortType === "0" ? " (selected)" : ""),
      key: "0",
    },
    {
      label: "Rating" + (sortType === "1" ? " (selected)" : ""),
      key: "1",
    },
    {
      label: "Distance" + (sortType === "2" ? " (selected)" : ""),
      key: "2",
    },
  ];

  return (
    <Layout className="list-layout">
      <Header className="list-header">
        <Button
          type="primary"
          onClick={handleBackClick}
          style={{ height: "70%", borderRadius: 12, fontWeight: "bold" }}
        >
          <LeftOutlined />
          Edit Postcode
        </Button>
        <div className="list-title">Craftsmen in your area</div>
        <Dropdown
          menu={{ items, onClick: handleMenuClick }}
          trigger={["click"]}
          className="sort-dropdown"
          disabled={loading}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space style={{ fontWeight: "bold" }}>
              Sort results by
              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </Header>
      {loading ? (
        <div
          style={{
            marginTop: "50px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "300px",
          }}
        >
          <Spin
            size="large"
            indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />}
          />
        </div>
      ) : (
        <Layout className="list-sublayout">
          <Content className="list-content">
            <Space
              direction="vertical"
              className="list-content-space"
              size="middle"
              align="center"
            >
              {craftsmen.map((craftsman, index) => (
                <ServiceCard
                  key={craftsman.id}
                  name={craftsman.name}
                  city={craftsman.city}
                  street={craftsman.street}
                  houseNumber={craftsman.houseNumber}
                  rankingScore={craftsman.rankingScore}
                  distance={craftsman.distance}
                  imagePath={imageFilenames[index % imageFilenames.length]}
                />
              ))}
              <Button
                className="load-more"
                onClick={handleLoadMore}
                style={{ color: "white" }}
              >
                Load More
              </Button>
            </Space>
          </Content>
        </Layout>
      )}
    </Layout>
  );
};

export default ServiceListPage;
