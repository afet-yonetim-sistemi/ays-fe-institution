import { CrudFilters, getDefaultFilter, useTranslate } from "@refinedev/core";

import { Button, Col, Form, Input, Row, Select } from "antd";
import { ChangeEvent, useMemo } from "react";

import { countryCodes } from "@/utilities";
import { FormProps } from "antd/lib";

const supportStatuses = [
  "IDLE",
  "READY",
  "BUSY",
  "MALFUNCTION",
  "ACCIDENT",
  "OFFLINE",
  "ON_ROAD",
  "RETURN",
];

const statuses = ["ACTIVE", "PASSIVE", "DELETED"];

const UserFilterForm: React.FC<{ formProps: FormProps; filters: CrudFilters }> = (props) => {
  const t = useTranslate();
  const { formProps, filters } = props;
  const { form } = formProps;
  const statusOptions = useMemo(
    () => statuses.map((status) => ({ label: t("statuses." + status), value: status })),
    [t]
  );

  const supportStatusOptions = useMemo(
    () =>
      supportStatuses.map((status) => ({
        label: t("supportStatuses." + status),
        value: status,
      })),
    [t]
  );

  const formatPhoneNumber = (e: ChangeEvent<HTMLInputElement>) => {
    if (form)
      form.setFieldValue("phoneNumber", {
        ...form.getFieldValue("phoneNumber"),
        lineNumber: e.target.value,
      });
  };

  const setCountryCode = (value: string) => {
    if (form)
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
    <Form
      layout="vertical"
      {...formProps}
      initialValues={{
        firstName: getDefaultFilter("firstName", filters),
        lastName: getDefaultFilter("lastName", filters),
        statuses: getDefaultFilter("statuses", filters),
        phoneNumber: getDefaultFilter("phoneNumber", filters),
      }}
    >
      <Row
        gutter={[10, 0]}
        align="bottom"
        style={{
          paddingTop: 10,
        }}
      >
        <Col xs={24}>
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
        </Col>
        <Col xs={24}>
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
        </Col>

        <Col xs={24}>
          <Form.Item label={t("users.fields.supportStatus")} name="supportStatuses">
            <Select
              allowClear
              mode="multiple"
              placeholder={t("users.fields.supportStatus")}
              options={supportStatusOptions}
            />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item label={t("users.fields.status")} name="status">
            <Select
              allowClear
              mode="multiple"
              placeholder={t("users.fields.status")}
              options={statusOptions}
            />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            label={t("users.fields.phoneNumber")}
            name={["phoneNumber", "lineNumber"]}
            rules={[
              {
                validator: (_, value) => {
                  if (!/^\d{10}$/.test(value) && value) {
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
                    allowClear
                    options={countryCodes.map((country) => ({
                      label: country.phoneCode + " " + country.name,
                      value: country.phoneCode,
                    }))}
                    onChange={setCountryCode}
                  />
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item noStyle name={["phoneNumber", "lineNumber"]}>
                  <Input maxLength={10} onChange={formatPhoneNumber} />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item>
            <Button htmlType="submit" type="primary" size="large" block>
              {t("buttons.filter")}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default UserFilterForm;
