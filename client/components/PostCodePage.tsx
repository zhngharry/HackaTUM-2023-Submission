"use client";

import React from "react";
import { useState } from "react";
import { Typography, Input, Space, Button, message } from "antd";
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

  const handleSearchClick = () => {
    onSearch(postcode);
  };

  return (
    <div className="custom-view">
      <Typography.Title level={1}>
        Enter your Postcode
      </Typography.Title>
      <Space.Compact style={{ width: "70%" }}>
        <Input
          size="large"
          placeholder="Postcode"
          value={postcode}
          onChange={handlePostcodeChange}
        />
        <Button
          size="large"
          type="primary"
          onClick={(e) => {
            if (postcode.length != 5 || !postcodes.includes(postcode)) {
              message.error("Invalid postcode!");
              e.stopPropagation();
            } else {
              handleSearchClick();
            }
          }}
        >
          Search
        </Button>
      </Space.Compact>
    </div>
  );
};

export default PostCodePage;