import React from 'react';
import { Input, Typography } from 'antd';

const { Title } = Typography;

interface TextInputComponentProps {
  title: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

function TextInputComponent({
  title,
  value,
  placeholder,
  onChange,
}: TextInputComponentProps) {
  return (
    <>
      <Title level={5}>{title}</Title>
      <Input
        style={{
          resize: 'none',
        }}
        allowClear
        disabled={false}
        onChange={event => onChange(event)}
        value={value}
        placeholder={placeholder}
      />
    </>
  );
}

export default TextInputComponent;
