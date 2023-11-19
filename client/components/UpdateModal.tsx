import React, { useState, useContext } from "react";
import { Modal, Button, Typography, message, Collapse } from "antd";
import TextInputComponent from "./TextInputComponent";

const { Text } = Typography;

interface EditWorkerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onUpdate: () => void;
}
// try to bypass BE test error

function EditWorkerModal(props: EditWorkerProps) {
  const { open, setOpen } = props;
  const [maxDrivingDistance, setMaxDrivingDistance] = useState<string>("");
  const [profilePictureScore, setProfilePictureScore] = useState<string>("");
  const [profileDescriptionScore, setProfileDescriptionScore] =
    useState<string>("");
  const [craftsmanID, setCraftsmanID] = useState<string>("");

  return (
    <Modal
      open={open}
      title="Update Craftsman Profile"
      centered
      width="30vw"
      onCancel={() => {
        setOpen(false);
      }}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            setOpen(false);
          }}
        >
          Cancel
        </Button>,
        <Button
          style={{ fontWeight: "bold"}}
          key="create"
          type="primary"
          onClick={() => {}}
          disabled={
            craftsmanID === "" ||
            (maxDrivingDistance === "" &&
              profilePictureScore === "" &&
              profileDescriptionScore === "")
          }
        >
          Update Craftsman Profile
        </Button>,
      ]}
    >
      <div style={{ marginBottom: "20px", marginTop: "20px" }}>
        <div style={{ marginBottom: "20px" }}>
          <TextInputComponent
            title="Craftsman ID"
            value={craftsmanID}
            placeholder="Enter ID of craftsman"
            onChange={(e) => setCraftsmanID(e.target.value)}
          />
          <TextInputComponent
            title="Update Max Driving Distance"
            value={maxDrivingDistance}
            placeholder="Enter new driving distance in meters"
            onChange={(e) => setMaxDrivingDistance(e.target.value)}
          />
          <TextInputComponent
            title="Update Profile Picture Score"
            value={profilePictureScore}
            placeholder="Enter new profile picture score"
            onChange={(e) => setProfilePictureScore(e.target.value)}
          />
          <TextInputComponent
            title="Update Profile Description Score"
            value={profileDescriptionScore}
            placeholder="Enter new profile description score"
            onChange={(e) => setProfileDescriptionScore(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
}

export default EditWorkerModal;
