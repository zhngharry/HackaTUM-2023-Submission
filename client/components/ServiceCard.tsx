"use client";

import React from "react";
import { Card, Typography, Avatar } from "antd";
import { CarOutlined, EnvironmentOutlined } from "@ant-design/icons";
import Image from "next/image";

const { Text } = Typography;

interface ServiceCardProps {
  name: string;
  city: string;
  street: string;
  houseNumber: string;
  rankingScore: number;
  distance: number;
  imagePath: string;
}

const getAdjective = (score: number) => {
  if (score >= 8.0) {
    return "Top Professional";
  } else if (score >= 7.0) {
    return "Very Good";
  } else if (score >= 5.0) {
    return "Good";
  } else {
    return "Average";
  }
};

const ServiceCard: React.FC<ServiceCardProps> = ({
  name,
  city,
  street,
  houseNumber,
  rankingScore,
  distance,
  imagePath,
}) => {
  const adjective = getAdjective(rankingScore * 10);

  return (
    <Card className="service-card" hoverable>
      <div className="service-card">
        <Image
          className="service-image"
          src={`/craftsman_pictures/${imagePath}`}
          alt="Image"
          width={150}
          height={150}
        />
        <div className="service-card-text">
          <div className="service-card-title">{name}</div>
          <div className="ranking-avatar-container">
            <Avatar
              shape="square"
              style={{
                backgroundColor: rankingScore < 0.8 ? "#063773" : "#b39656",
                width: "50px",
                height: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                fontStyle: "bold",
              }}
            >
              {(10 * rankingScore).toFixed(1)}
            </Avatar>
            <div className="adjective-text">{adjective}</div>
          </div>

          <div className="service-card-description">
            <div className="service-card-distance">
              <CarOutlined />
              {distance.toFixed(1)} km away
            </div>

            <div className="service-card-city">
              <EnvironmentOutlined />
              Located in {city}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;
