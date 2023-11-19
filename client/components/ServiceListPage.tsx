"use client";

import React from "react";
import { useState, useEffect } from "react";
import "../styles/styles.scss";
import {
  Button,
  Layout,
  Dropdown,
  Space,
  MenuProps,
  Spin,
  FloatButton,
  Tooltip,
} from "antd";
import ServiceCard from "./ServiceCard";
import {
  DownOutlined,
  LeftOutlined,
  LoadingOutlined,
  UpOutlined,
} from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";

import { getListOfCraftsmen } from "../services/craftsmenAPI";

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
  setCraftsmen: (craftsmen: Craftsman[]) => void;
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
  setCraftsmen,
  loading,
  setLoading,
}) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });

  const [sortType, setSortType] = useState<string>("0");
  const [loadMoreLoading, setLoadMoreLoading] = useState<boolean>(false);
  const [showButton, setShowButton] = useState<boolean>(false);
  const [pageCounter, setPageCounter] = useState<number>(1);

  const items: MenuProps["items"] = [
    {
      label: "Relevance" + (sortType === "0" ? " (selected)" : ""),
      key: "0",
    },
    {
      label: "Profile Score only" + (sortType === "1" ? " (selected)" : ""),
      key: "1",
    },
    {
      label: "Distance only" + (sortType === "2" ? " (selected)" : ""),
      key: "2",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleBackClick = () => {
    stepBack(postCode);
  };

  const handleSort = (sortType: string) => {
    let sortedCraftsmen = [...craftsmen];
    switch (sortType) {
      case "0":
        // Sort by Relevance (your custom sorting logic)
        sortedCraftsmen.sort(
          (a, b) =>
            parseInt((b.rankingScore * 100).toFixed(1)) -
            parseInt((a.rankingScore * 100).toFixed(1))
        );
        break;
      case "1":
        // Sort by Profile Score only
        sortedCraftsmen.sort(
          (a, b) =>
            parseInt((b.rankingScore * 100).toFixed(1)) -
            parseInt((a.rankingScore * 100).toFixed(1))
        );
        break;
      case "2":
        // Sort by Distance only
        sortedCraftsmen.sort(
          (a, b) =>
            parseInt((a.distance * 100).toFixed(1)) -
            parseInt((b.distance * 100).toFixed(1))
        );
        break;
      default:
        // Default sorting logic (e.g., no sorting)
        break;
    }
    setCraftsmen([]);
    setCraftsmen(sortedCraftsmen);
  };

  const handleLoadMore = () => {
    setLoadMoreLoading(true);
    console.log("load more");
    getListOfCraftsmen(parseInt(postCode), pageCounter).then((response) => {
      setCraftsmen(craftsmen.concat(response));
      setLoadMoreLoading(false);
    });
    handleSort(sortType);
    setPageCounter(pageCounter + 1);
  };

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    const key = e.key;
    setSortType(key);
    handleSort(key);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Optional: Add smooth scrolling behavior
    });
  };

  return (
    <Layout className="list-layout">
      <Header
        className="list-header"
        style={{ width: isMobile ? "100vw" : "70vw" }}
      >
        <Button
          size={isMobile ? "small" : "middle"}
          type="primary"
          onClick={handleBackClick}
          style={{
            height: isMobile ? "30px" : "70%",
            borderRadius: isMobile ? 8 : 12,
            fontWeight: "bold",
          }}
        >
          <LeftOutlined />
          {isMobile ? null : "Edit Postcode"}
        </Button>
        <div
          style={{
            fontSize: isMobile ? "20px" : "30px",
            fontWeight: "bold",
            color: "#063773",
          }}
        >
          {isMobile ? "Results" : "Professionals matching your Postcode"}
        </div>
        <Dropdown
          menu={{ items, onClick: handleMenuClick }}
          trigger={["click"]}
          className="sort-dropdown"
          disabled={loading}
        >
          <a onClick={(e) => e.preventDefault()}>
            <Space style={{ fontWeight: "bold", height: "100%" }}>
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
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "300px",
            gap: "30px",
          }}
        >
          <Spin
            size="large"
            indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />}
          />
          Loading results...
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
                  key={index}
                  name={craftsman.name}
                  city={craftsman.city}
                  street={craftsman.street}
                  houseNumber={craftsman.houseNumber}
                  rankingScore={craftsman.rankingScore}
                  distance={craftsman.distance}
                  imagePath={imageFilenames[index % imageFilenames.length]}
                />
              ))}
              {loadMoreLoading ? (
                <Spin
                  className="load-more-spinner"
                  size="large"
                  indicator={<LoadingOutlined style={{ fontSize: 50 }} spin />}
                />
              ) : (
                <Button
                  className="load-more"
                  onClick={handleLoadMore}
                  style={{ color: "white" }}
                >
                  Load More
                </Button>
              )}
            </Space>
          </Content>
        </Layout>
      )}
      {showButton && (
        <Tooltip title="Scroll back to top">
          <FloatButton
            icon={<UpOutlined />}
            type="default"
            onClick={scrollToTop}
            style={{ height: "50px", width: "50px" }}
          />
        </Tooltip>
      )}
    </Layout>
  );
};

export default ServiceListPage;
