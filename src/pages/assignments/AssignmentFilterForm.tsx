import { CrudFilters, getDefaultFilter, useTranslate } from "@refinedev/core";

import { Button, Col, Form, Input, Row, Select } from "antd";
import { ChangeEvent, useMemo } from "react";

import { countryCodes } from "@/utilities";
import { FormProps } from "antd/lib";

const statuses = ["AVAILABLE", "RESERVED", "ASSIGNED", "IN_PROGRESS", "DONE"];

type Props = {
  filters: CrudFilters;
  formProps: FormProps;
};

const AssignmentFilterForm: React.FC<{ formProps: FormProps; filters: CrudFilters }> = (props) => {
  const t = useTranslate();
  const { formProps, filters } = props;
  const { form } = formProps;
  const statusOptions = useMemo(
    () => statuses.map((status) => ({ label: t("assignmentStatuses." + status), value: status })),
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

  return (
    <Form
      layout="vertical"
      {...formProps}
      initialValues={{
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
          <Form.Item label={t("users.fields.status")} name="statuses">
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
            <Button htmlType="submit" type="primary" size="large" block id="filter-button">
              {t("buttons.filter")}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default AssignmentFilterForm;
