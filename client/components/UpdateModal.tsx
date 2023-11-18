// components/UpdateModal.tsx
import React, { useState } from "react";
import { Modal, Input } from "antd";

interface UpdateModalProps {
  visible: boolean;
  onCancel: () => void;
  onUpdate: (data: { field1: string; field2: string; field3: string }) => void;
}

const UpdateModal: React.FC<UpdateModalProps> = ({
  visible,
  onCancel,
  onUpdate,
}) => {
  const [field1, setField1] = useState("");
  const [field2, setField2] = useState("");
  const [field3, setField3] = useState("");

  const handleUpdate = () => {
    // Perform update logic with the values of the three fields
    onUpdate({ field1, field2, field3 });
    // Reset fields and close the modal
    setField1("");
    setField2("");
    setField3("");
    onCancel();
  };

  return (
    <Modal
      title="Update Data"
      open={visible}
      onCancel={onCancel}
      onOk={handleUpdate}
    >
      <Input
        placeholder="Field 1"
        value={field1}
        onChange={(e) => setField1(e.target.value)}
      />
      <Input
        placeholder="Field 2"
        value={field2}
        onChange={(e) => setField2(e.target.value)}
      />
      <Input
        placeholder="Field 3"
        value={field3}
        onChange={(e) => setField3(e.target.value)}
      />
    </Modal>
  );
};

export default UpdateModal;
