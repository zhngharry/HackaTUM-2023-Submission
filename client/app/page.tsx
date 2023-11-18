"use client";

import React from "react";
import { ConfigProvider } from "antd";
import theme from "../theme/themeConfig";

const HomePage = () => <ConfigProvider theme={theme}></ConfigProvider>;

export default HomePage;
