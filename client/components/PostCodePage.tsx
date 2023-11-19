"use client";

import React from "react";
import { useState } from "react";
import { Typography, Input, Space, Button, message } from "antd";
import { EnvironmentOutlined, SearchOutlined } from "@ant-design/icons";
import postcodes from "german-postal-codes";

import "../styles/styles.scss";

interface PostCodePageProps {
  onSearch: (postcode: string) => void;
  postCode: string;
}

const PostCodePage: React.FC<PostCodePageProps> = ({ onSearch, postCode }) => {
  const [postcode, setPostcode] = useState(postCode);

  const handlePostcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (
      (/^[0-9]*$/.test(e.target.value) || e.target.value === "") &&
      e.target.value.length <= 5
    ) {
      setPostcode(e.target.value);
    } else {
      e.stopPropagation();
    }
  };

  const handleSearch = () => {
    if (postcode.length !== 5 || !postcodes.includes(postcode)) {
      message.error("Invalid postcode!");
    } else {
      onSearch(postcode);
    }
  };

  const handleSearchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="custom-view">
      <Typography.Title level={1}>Find skilled and trusted professionals in your area.</Typography.Title>
      <Space.Compact style={{ width: "50%" }}>
        <Input
          size="large"
          placeholder="Postcode"
          value={postcode}
          onChange={handlePostcodeChange}
          onPressEnter={handleSearchEnter}
          prefix={<EnvironmentOutlined style={{ marginRight: 5 }} />}
        />
        <Button size="large" type="primary" onClick={handleSearch}>
          <SearchOutlined />
          Search
        </Button>
      </Space.Compact>
    </div>
  );
};

export default PostCodePage;
