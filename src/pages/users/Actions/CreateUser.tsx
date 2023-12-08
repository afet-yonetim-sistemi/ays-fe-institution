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

  const validateName = (value: string) => {
    if (!value) {
      return Promise.reject(t("formErrors.required"));
    } else if (value?.trim()?.length === 0) {
      return Promise.reject(t("formErrors.required"));
    } else if (value?.trim()?.length > 0 && value?.trim()?.length < 2) {
      return Promise.reject(t("formErrors.minLength", { min: "2" }));
    } else if (value?.trim()?.length > 35) {
      return Promise.reject(t("formErrors.maxLength", { max: "35" }));
    } else {
      return Promise.resolve();
    }
  };

  return (
    <Drawer {...drawerProps} title={t("users.actions.create")}>
      <Create
        saveButtonProps={{
          ...saveButtonProps,
          onClick: () => {
            // trim first and last name before saving
            form.setFieldValue("firstName", form.getFieldValue("firstName").trim());
            form.setFieldValue("lastName", form.getFieldValue("lastName").trim());
            saveButtonProps.onClick();
          },
        }}
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
            required
            rules={[
              {
                validator: (_, value) => {
                  return validateName(value);
                },
              },
            ]}
          >
            <Input
              onChange={(e) => {
                const value = e.target.value
                  .replace(/[^\p{L}\s]+/gu, "")
                  .replace(/[0-9]/g, "")
                  .replace("  ", " ");
                form.setFieldValue("firstName", value);
              }}
            />
          </Form.Item>
          <Form.Item
            name="lastName"
            label={t("users.fields.lastName")}
            required
            rules={[
              {
                validator: (_, value) => {
                  return validateName(value);
                },
              },
            ]}
          >
            <Input
              onChange={(e) => {
                const value = e.target.value
                  .replace(/[^\p{L}\s]+/gu, "")
                  .replace(/[0-9]/g, "")
                  .replace("  ", " ");
                form.setFieldValue("lastName", value);
              }}
            />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 8 }}
            label={t("users.fields.phoneNumber")}
            name={["phoneNumber", "lineNumber"]}
            required
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
                  <Input maxLength={10} onChange={formatPhoneNumber} id="phoneNumber_lineNumber" />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Create>
    </Drawer>
  );
}
