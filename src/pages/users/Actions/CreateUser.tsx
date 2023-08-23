import { User } from "@/types";
import { countryCodes } from "@/utilities";
import { Create, UseDrawerFormReturnType } from "@refinedev/antd";
import { useTranslate } from "@refinedev/core";
import { Col, Drawer, Form, Input, Row, Select } from "antd";
import { ChangeEvent } from "react";

type Props = UseDrawerFormReturnType<User>;

export default function CreateUser({ formProps, drawerProps, saveButtonProps, form }: Props) {
  const t = useTranslate();

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

  return (
    <Drawer {...drawerProps} title={t("users.actions.create")}>
      <Create
        saveButtonProps={saveButtonProps}
        resource="user"
        goBack={false}
        contentProps={{
          style: {
            boxShadow: "none",
            background: "none",
          },
          bodyStyle: {
            padding: 0,
            background: "none",
          },
        }}
        title=""
      >
        <Form
          {...formProps}
          layout="vertical"
          style={{
            background: "none",
          }}
        >
          <Form.Item
            name="firstName"
            label={t("users.fields.firstName")}
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
            name="lastName"
            label={t("users.fields.lastName")}
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
            label={t("users.fields.phoneNumber")}
            style={{ marginBottom: 8 }}
            name={["phoneNumber", "lineNumber"]}
            rules={[
              {
                validator: (_, value) => {
                  if (!value) {
                    return Promise.reject(t("formErrors.required"));
                  }
                  if (value.length !== 10) {
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
        </Form>
      </Create>
    </Drawer>
  );
}
