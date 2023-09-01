import { Col, Layout, Row, theme, Typography, Form, Card, Input, Button, Select } from "antd";
import { useCreate, useGo, useTranslate } from "@refinedev/core";
import { ChangeEvent, useEffect } from "react";
const { Title } = Typography;
import { containerStyles, titleStyles, headStyles, bodyStyles } from "./styles";
import { countryCodes } from "@/utilities";
import { CreateAdminRequest, Institution } from "@/types";
import { useParams } from "react-router-dom";
import { NoAuthHeader } from "@/components/noauth-header";

const institutions: Pick<Institution, "id" | "name">[] = [
  {
    id: "77ece256-bf0e-4bbe-801d-173083f8bdcf",
    name: "Test Institution 1",
  },
];

export const Register = () => {
  const go = useGo();

  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm<CreateAdminRequest>();
  const { token } = theme.useToken();
  const t = useTranslate();
  const CardTitle = (
    <Title
      level={3}
      style={{
        color: token.colorPrimaryTextHover,
        ...titleStyles,
      }}
    >
      {t("pages.register.title", "Sign up for your account")}
    </Title>
  );

  const { mutate } = useCreate({});

  const formatPhoneNumber = (e: ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue("phoneNumber", {
      ...form.getFieldValue("phoneNumber"),
      lineNumber: e.target.value,
    });
  };

  const setCountryCode = (value: string) => {
    form.setFieldValue("phoneNumber", {
      ...form.getFieldValue("phoneNumber"),
      countryCode: value.replace("+", ""),
    });
  };

  useEffect(() => {
    form.setFieldValue("institutionId", institutions[0].id);
  }, []);

  const onSubmit = (values: CreateAdminRequest) => {
    mutate({
      resource: "authentication/admin/register",
      values: {
        ...values,
        verificationId: id,
      },
      successNotification: () => {
        go({
          to: "/login",
        });
        return {
          description: t("notifications.success"),
          message: t("admins.create.successMessage"),
          type: "success",
        };
      },
      errorNotification: (error) => {
        const message = error?.response?.data?.message;
        return {
          description: t("notifications.failure"),
          message: message,
          type: "error",
        };
      },
    });
  };

  const CardContent = (
    <Card
      title={CardTitle}
      headStyle={headStyles}
      bodyStyle={bodyStyles}
      style={{
        ...containerStyles,
        backgroundColor: token.colorBgElevated,
      }}
    >
      <Form layout="vertical" form={form} onFinish={onSubmit} requiredMark={false}>
        <Form.Item
          name="email"
          label={t("pages.register.fields.email", "Email")}
          rules={[
            {
              required: true,
              message: t("formErrors.required"),
            },
            {
              type: "email",
              message: t("pages.register.errors.validEmail", "Invalid email address"),
            },
          ]}
        >
          <Input size="large" placeholder={t("pages.register.fields.email", "Email")} />
        </Form.Item>
        <Form.Item
          name="username"
          label={t("users.fields.username")}
          rules={[
            {
              required: true,
              message: t("formErrors.required"),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label={t("pages.register.fields.password", "Password")}
          rules={[
            {
              required: true,
              message: t("formErrors.required"),
            },
          ]}
        >
          <Input type="password" placeholder="●●●●●●●●" size="large" />
        </Form.Item>
        <Form.Item
          name="firstName"
          label={t("users.fields.firstName")}
          rules={[
            {
              required: true,
              message: t("formErrors.required"),
            },
            {
              min: 2,
              message: t("formErrors.minLength", { min: "2" }),
            },
            {
              max: 35,
              message: t("formErrors.maxLength", { max: "35" }),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="lastName"
          label={t("users.fields.lastName")}
          rules={[
            {
              required: true,
              message: t("formErrors.required"),
            },
            {
              min: 2,
              message: t("formErrors.minLength"),
            },
            {
              max: 35,
              message: t("formErrors.maxLength"),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name={"institutionId"} label={t("users.fields.institution")}>
          <Select
            disabled
            options={institutions.map((institution) => ({
              label: institution.name,
              value: institution.id,
            }))}
          />
        </Form.Item>
        <Form.Item
          label={t("users.fields.phoneNumber")}
          style={{ marginBottom: 8 }}
          name={["phoneNumber", "lineNumber"]}
          rules={[
            {
              validator: (_, value) => {
                if (!value) {
                  return Promise.reject(t("formErrors.required"));
                }
                if (!/^\d{10}$/.test(value)) {
                  return Promise.reject(t("formErrors.users.phoneNumber"));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Row gutter={8}>
            <Col span={8}>
              <Form.Item name={["phoneNumber", "countryCode"]} noStyle>
                <Select
                  options={countryCodes.map((country) => ({
                    label: country.phoneCode + " " + country.name,
                    value: country.phoneCode,
                  }))}
                  onChange={setCountryCode}
                />
              </Form.Item>
            </Col>
            <Col span={16}>
              <Form.Item noStyle>
                <Input maxLength={10} onChange={formatPhoneNumber} />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          style={{
            marginBottom: 0,
          }}
        >
          <Button type="primary" size="large" htmlType="submit" block>
            {t("pages.register.buttons.submit", "Sign up")}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
  return (
    <Layout>
      <NoAuthHeader />
      <Row
        justify="center"
        align="middle"
        style={{
          height: "100vh",
        }}
      >
        <Col xs={22}>{CardContent}</Col>
      </Row>
    </Layout>
  );
};
