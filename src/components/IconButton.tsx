import { Button, ButtonProps } from "antd";
import React from "react";

type Props = ButtonProps & {
  icon: React.ReactNode;
};

export default function IconButton(props: Props) {
  return (
    <Button
      type="default"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
      {...props}
    />
  );
}
