import SelectLocation from "@/components/map/SelectLocation";
import { Assignment } from "@/types";
import { checkLatIsValid, countryCodes } from "@/utilities";
import { Create, UseDrawerFormReturnType } from "@refinedev/antd";
import { useTranslate } from "@refinedev/core";
import { Button, Col, Drawer, Form, Input, Row, Select } from "antd";
import { ChangeEvent, useState } from "react";
import { SelectOutlined } from "@ant-design/icons";

type Props = UseDrawerFormReturnType<Assignment>;

export default function CreateAssignment({ formProps, drawerProps, saveButtonProps, form }: Props) {
  const t = useTranslate();
  const [isMapOpen, setIsMapOpen] = useState(false);

  const onCancel = () => {
    setIsMapOpen(false);
  };

  const onOk = (location: { lat: number; lng: number }) => {
    formProps.form.setFieldValue("latitude", location.lat);
    formProps.form.setFieldValue("longitude", location.lng);
    setIsMapOpen(false);
  };

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

  const isLocationValid = !!(
    formProps.form.getFieldValue("latitude") && formProps.form.getFieldValue("longitude")
  );

  return (
    <Drawer {...drawerProps} title={t("assignments.actions.create")}>
      <SelectLocation
        open={isMapOpen}
        id="create-assignment"
        onCancel={onCancel}
        onOk={onOk}
        modalTitle={t("locationModal.selectLocation")}
        location={{
          lat: form.getFieldValue("latitude") ?? null,
          lng: form.getFieldValue("longitude") ?? null,
        }}
      />
      <Create
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
                max: 255,
                message: t("formErrors.maxLength", { max: "255" }),
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
                max: 255,
                message: t("formErrors.maxLength", { max: "255" }),
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
                max: 2048,
                message: t("formErrors.maxLength", { max: "2048" }),
              },
            ]}
          >
            <Input
              onChange={(e) => {
                const value = e.target.value.replace("  ", " ");
                form.setFieldValue("description", value);
              }}
            />
          </Form.Item>
          <Form.Item
            style={{ marginBottom: 8 }}
            label={t("assignments.fields.phoneNumber")}
            name={["phoneNumber", "lineNumber"]}
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
                <Form.Item noStyle>
                  <Input maxLength={10} onChange={formatPhoneNumber} />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
          <Form.Item label={t("assignments.fields.coordinates")}>
            <Row gutter={8}>
              <Col span={24}>
                <Form.Item
                  name="latitude"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (!value) {
                          return Promise.reject(t("formErrors.required"));
                        }
                        if (!checkLatIsValid(value)) {
                          return Promise.reject(t("formErrors.assignments.invalidLatitude"));
                        }
                        if (/^[0-9.]*$/.test(value)) {
                          return Promise.resolve();
                        }
                        return Promise.reject(t("formErrors.assignments.invalidLatitude"));
                      },
                    },
                  ]}
                  required
                >
                  <Button
                    block
                    icon={<SelectOutlined />}
                    type={isLocationValid ? "primary" : "default"}
                    onClick={() => setIsMapOpen(true)}
                  >
                    {t("locationModal.selectLocation")}
                  </Button>
                </Form.Item>
                <Form.Item
                  name="longitude"
                  hidden
                  rules={[
                    {
                      validator: (_, value) => {
                        if (!value) {
                          return Promise.reject(t("formErrors.required"));
                        }
                        if (!checkLatIsValid(value)) {
                          return Promise.reject(t("formErrors.assignments.invalidLatitude"));
                        }
                        if (/^[0-9.]*$/.test(value)) {
                          return Promise.resolve();
                        }
                        return Promise.reject(t("formErrors.assignments.invalidLatitude"));
                      },
                    },
                  ]}
                  required
                ></Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Create>
    </Drawer>
  );
}
