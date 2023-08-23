import React from "react";
import { useLogin, useTranslate } from "@refinedev/core";
import {
  Row,
  Col,
  Layout as AntdLayout,
  Card,
  Typography,
  Form,
  Input,
  Button,
  Checkbox,
} from "antd";
import "./styles.css";
import { NoAuthHeader } from "@/components/noauth-header";

const { Text, Title } = Typography;

export interface ILoginForm {
  username: string;
  password: string;
  remember: boolean;
}

export const Login: React.FC = () => {
  const t = useTranslate();
  const [form] = Form.useForm<ILoginForm>();

  const { mutate: login } = useLogin<ILoginForm>();

  const CardTitle = (
    <Title level={3} className="title">
      {t("pages.login.title")}
    </Title>
  );

  return (
    <AntdLayout className="layout">
      <NoAuthHeader />
      <Row
        justify="center"
        align="middle"
        style={{
          height: "100vh",
        }}
      >
        <Col xs={22}>
          <div className="container">
            <Card title={CardTitle} headStyle={{ borderBottom: 0, marginTop: 12 }}>
              <Form<ILoginForm>
                layout="vertical"
                form={form}
                onFinish={(values) => {
                  login(values);
                }}
                requiredMark={false}
                initialValues={{
                  remember: false,
                }}
              >
                <Form.Item
                  name="username"
                  label={t("pages.login.fields.username")}
                  rules={[{ required: true }]}
                >
                  <Input size="large" placeholder="Username" />
                </Form.Item>
                <Form.Item
                  name="password"
                  label={t("pages.login.fields.password")}
                  rules={[{ required: true }]}
                  style={{ marginBottom: "12px" }}
                >
                  <Input type="password" placeholder="●●●●●●●●" size="large" />
                </Form.Item>
                {/* <div style={{ marginBottom: "12px" }}>
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox
                      style={{
                        fontSize: "12px",
                      }}
                    >
                      {t("pages.login.buttons.rememberMe")}
                    </Checkbox>
                  </Form.Item>

                  <a
                    style={{
                      float: "right",
                      fontSize: "12px",
                    }}
                    href="#"
                  >
                    {t("pages.login.buttons.forgotPassword")}
                  </a>
                </div> */}
                <Button type="primary" size="large" htmlType="submit" block>
                  {t("pages.login.buttons.submit")}
                </Button>
              </Form>
              {/* <div style={{ marginTop: 8 }}>
                <Text style={{ fontSize: 12 }}>
                  {t("pages.login.buttons.noAccount")}{" "}
                  <a href="#" style={{ fontWeight: "bold" }}>
                    {t("pages.login.signup")}
                  </a>
                </Text>
              </div> */}
            </Card>
          </div>
        </Col>
      </Row>
    </AntdLayout>
  );
};
