"use client";

import React from "react";
import { Card, Typography, Avatar } from "antd";
import { CarOutlined, EnvironmentOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useMediaQuery } from "react-responsive";

const { Text } = Typography;

interface ServiceCardProps {
  name: string;
  city: string;
  street: string;
  houseNumber: string;
  rankingScore: number;
  profile_score: number;
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
  profile_score,
}) => {
  const adjective = getAdjective(profile_score);

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  return (
    <Card
      className="service-card"
      hoverable
      style={{ width: isMobile ? "90vw" : "70vw" }}
    >
      <div className="service-card">
        {isMobile ? null : (
          <Image
            className="service-image"
            src={`/craftsman_pictures/${imagePath}`}
            alt="Image"
            width={125}
            height={125}
          />
        )}
        <div
          className="service-card-text"
          style={{ width: isMobile ? "" : "80%" }}
        >
          <div className="service-card-title">{name}</div>
          <div className="ranking-avatar-container">
            <Avatar
              shape="square"
              style={{
                backgroundColor: profile_score < 8.0 ? "#063773" : "#b39656",
                width: isMobile ? "35px" : "50px",
                height: isMobile ? "35px" : "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: isMobile ? "16px" : "20px",
                fontStyle: "bold",
              }}
            >
              {profile_score.toFixed(1)}
            </Avatar>
            <div className="adjective-text">{adjective}</div>
          </div>

          <div
            className="service-card-description"
            style={{
              width: isMobile ? "75vw" : "60vw",
              gap: isMobile ? "2px" : "10px",
            }}
          >
            <div className="service-card-distance">
              <CarOutlined />
              {distance.toFixed(1)} km away
            </div>

            <div className="service-card-city">
              <EnvironmentOutlined />
              {isMobile ? `${city}` : `Located in ${city}`}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;
