import { Row, Col, Layout as AntdLayout, Spin } from "antd";
export default function Loading() {
  return (
    <AntdLayout className="layout">
      <Row
        justify="center"
        align="middle"
        style={{
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </Row>
    </AntdLayout>
  );
}
