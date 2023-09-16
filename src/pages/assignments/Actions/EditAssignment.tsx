import { Assignment } from "@/types";
import { countryCodes } from "@/utilities";
import { Edit, UseDrawerFormReturnType } from "@refinedev/antd";
import { useTranslate } from "@refinedev/core";
import { Col, Drawer, Form, Input, Row, Select } from "antd";
import { ChangeEvent } from "react";

type Props = UseDrawerFormReturnType<Assignment>;

export default function EditAssignment({
  formProps,
  drawerProps,
  saveButtonProps,
  form,
  ...props
}: Props) {
  const t = useTranslate();
  const record = props?.queryResult?.data?.data;
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
    <Drawer {...drawerProps} title={t("assignments.actions.edit")}>
      <Edit
        headerButtons={<></>}
        recordItemId={props.id}
        saveButtonProps={saveButtonProps}
        resource="assignment"
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
        deleteButtonProps={props.deleteButtonProps}
        title=""
      >
        <Form
          {...formProps}
          layout="vertical"
          style={{
            background: "none",
          }}
          initialValues={{
            ...formProps.initialValues,
            latitude: record?.location?.latitude,
            longitude: record?.location?.longitude,
          }}
        >
          <Form.Item
            name="firstName"
            label={t("assignments.fields.firstName")}
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
            label={t("assignments.fields.lastName")}
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
            name="description"
            label={t("assignments.fields.description")}
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
                message: t("formErrors.maxLength", { max: "50" }),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 8 }}
            name={["phoneNumber", "lineNumber"]}
            label={t("assignments.fields.phoneNumber")}
            required
            rules={[
              {
                validator: (_, value) => {
                  if (!value) {
                    return Promise.reject(t("formErrors.required"));
                  }
                  if (!/^\d{10}$/.test(value)) {
                    return Promise.reject(t("formErrors.assignments.phoneNumber"));
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
                <Form.Item name={["phoneNumber", "lineNumber"]} noStyle>
                  <Input maxLength={10} onChange={formatPhoneNumber} />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item label={t("assignments.fields.coordinates")}>
            <Row gutter={8}>
              <Col span={12}>
                <Form.Item
                  name="latitude"
                  noStyle
                  rules={[
                    {
                      validator: (_, value) => {
                        console.log(value);
                        if (!value) {
                          return Promise.reject(t("formErrors.required"));
                        }
                        if (/^[0-9.]*$/.test(value)) {
                          return Promise.resolve();
                        }
                        return Promise.reject(t("formErrors.assignments.coordinate"));
                      },
                    },
                  ]}
                  required
                >
                  <Input maxLength={15} placeholder={t("assignments.fields.latitude")} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="longitude"
                  noStyle
                  rules={[
                    {
                      validator: (_, value) => {
                        console.log(value);
                        if (!value) {
                          return Promise.reject(t("formErrors.required"));
                        }
                        if (/^[0-9.]*$/.test(value)) {
                          return Promise.resolve();
                        }
                        return Promise.reject(t("formErrors.assignments.coordinate"));
                      },
                    },
                  ]}
                  required
                >
                  <Input maxLength={15} placeholder={t("assignments.fields.longitude")} />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Edit>
    </Drawer>
  );
}
