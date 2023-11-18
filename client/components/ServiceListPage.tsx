"use client";

import React from "react";

import "../styles/styles.scss";
import { Button } from "antd";

interface ServiceListPageProps {
  stepBack: () => void;
}

const ServiceListPage: React.FC<ServiceListPageProps> = ({ stepBack }) => {
  const handleBackClick = () => {
    stepBack();
  };

  return (
    <div className="custom-view">
      <Button onClick={handleBackClick} />
    </div>
  );
};

export default ServiceListPage;
