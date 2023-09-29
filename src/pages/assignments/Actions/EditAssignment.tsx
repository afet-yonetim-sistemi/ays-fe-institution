import IconButton from "@/components/IconButton";
import SelectLocation from "@/components/map/SelectLocation";
import { Assignment } from "@/types";
import { checkLatIsValid, checkLngIsValid, countryCodes } from "@/utilities";
import { Edit, UseDrawerFormReturnType } from "@refinedev/antd";
import { useTranslate } from "@refinedev/core";
import { Col, Drawer, Form, Input, Row, Select, Tooltip } from "antd";
import { ChangeEvent, useState } from "react";
import LocationIcon from "@/components/icons/LocationIcon";

type Props = UseDrawerFormReturnType<Assignment>;

export default function EditAssignment({
  formProps,
  drawerProps,
  saveButtonProps,
  form,
  ...props
}: Props) {
  const [isMapOpen, setIsMapOpen] = useState(false);

  const onCancel = () => {
    setIsMapOpen(false);
  };

  const onOk = (location: { lat: number; lng: number }) => {
    console.log("location", location);
    form.setFieldValue("latitude", location.lat);
    form.setFieldValue("longitude", location.lng);
    setIsMapOpen(false);
  };

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
      <SelectLocation
        open={isMapOpen}
        id={record?.id ?? ""}
        onCancel={onCancel}
        onOk={onOk}
        modalTitle={t("locationModal.selectLocation")}
        location={{
          lat: form.getFieldValue("latitude"),
          lng: form.getFieldValue("longitude"),
        }}
      />
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
                max: 35,
                message: t("formErrors.maxLength", { max: "35" }),
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
                max: 35,
                message: t("formErrors.maxLength", { max: "50" }),
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
              <Col span={11}>
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
                  <Input maxLength={15} placeholder={t("assignments.fields.latitude")} />
                </Form.Item>
              </Col>
              <Col span={11}>
                <Form.Item
                  name="longitude"
                  rules={[
                    {
                      validator: (_, value) => {
                        if (!value) {
                          return Promise.reject(t("formErrors.required"));
                        }
                        if (!checkLngIsValid(value)) {
                          return Promise.reject(t("formErrors.assignments.invalidLongitude"));
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
                  <Input maxLength={15} placeholder={t("assignments.fields.longitude")} />
                </Form.Item>
              </Col>
              <Col
                span={2}
                style={{
                  alignSelf: "start",
                }}
              >
                <Tooltip title={t("locationModal.selectLocation")}>
                  <IconButton icon={<LocationIcon />} onClick={() => setIsMapOpen(true)} />
                </Tooltip>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Edit>
    </Drawer>
  );
}
