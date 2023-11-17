"use client";

import React from "react";
import { Button, ConfigProvider } from "antd";

import theme from "../theme/themeConfig";
import { log } from "console";

const HomePage = () => (
  <ConfigProvider theme={theme}>
    <div className="App">
      <Button type="primary" onClick={() => console.log("poop")}>
        Button
      </Button>
    </div>
  </ConfigProvider>
);

export default HomePage;
