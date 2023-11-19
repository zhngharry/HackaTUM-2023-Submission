import React, { useState } from "react";
import { Modal, Button, Typography, message } from "antd";
import TextInputComponent from "./TextInputComponent";
import { useMediaQuery } from "react-responsive";
import { patchUser } from "../services/craftsmenAPI";

const { Text } = Typography;

interface EditWorkerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onUpdate: () => void;
}

function EditWorkerModal(props: EditWorkerProps) {
  const { open, setOpen } = props;
  const [maxDrivingDistance, setMaxDrivingDistance] = useState<string>("");
  const [profilePictureScore, setProfilePictureScore] = useState<string>("");
  const [profileDescriptionScore, setProfileDescriptionScore] =
    useState<string>("");
  const [craftsmanID, setCraftsmanID] = useState<string>("");
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  return (
    <Modal
      open={open}
      title={isMobile ? "Update Craftsman" : "Update Craftsman Profile"}
      centered
      width={isMobile ? "90vw" : "30vw"}
      onCancel={() => {
        setOpen(false);
        setMaxDrivingDistance("");
        setProfilePictureScore("");
        setProfileDescriptionScore("");
        setCraftsmanID("");
      }}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            setOpen(false);
            setMaxDrivingDistance("");
            setProfilePictureScore("");
            setProfileDescriptionScore("");
            setCraftsmanID("");
          }}
        >
          Cancel
        </Button>,
        <Button
          key="update"
          type="primary"
          onClick={() => {
            patchUser(parseInt(craftsmanID), {
              maxDrivingDistance:
                maxDrivingDistance === ""
                  ? undefined
                  : parseInt(maxDrivingDistance),
              profilePictureScore:
                profilePictureScore === ""
                  ? undefined
                  : parseInt(profilePictureScore),
              profileDescriptionScore:
                profileDescriptionScore === ""
                  ? undefined
                  : parseInt(profileDescriptionScore),
            });
            setOpen(false);
            setMaxDrivingDistance("");
            setProfilePictureScore("");
            setProfileDescriptionScore("");
            setCraftsmanID("");
            message.success("Craftsman profile updated!");
          }}
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
    </Modal>
  );
}

export default EditWorkerModal;
