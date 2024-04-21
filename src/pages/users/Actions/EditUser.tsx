import { User } from "@/types";
import { SaveButton, UseDrawerFormReturnType } from "@refinedev/antd";
import { useTranslate } from "@refinedev/core";
import { Drawer, Form, Select } from "antd";

type Props = UseDrawerFormReturnType<User>;

export default function EditUser({
  formProps,
  drawerProps,
  saveButtonProps,
  form,
  ...props
}: Props) {
  const t = useTranslate();
  const values = form.getFieldsValue() as User;
  const record = props?.queryResult?.data?.data;
  const disabled = values?.status === record?.status && values.role === record?.role;

  const titleElement = (
    <span style={{ fontSize: 18 }}>{t(`${record?.firstName} ${record?.lastName}`)}</span>
  );

  const saveElement = <SaveButton {...{ ...saveButtonProps, disabled }} />;

  return (
    <Drawer {...drawerProps} title={titleElement} extra={saveElement}>
      <Form
        {...formProps}
        layout="vertical"
        style={{
          background: "none",
          marginTop: "32px",
        }}
      >
        <Form.Item
          name="status"
          label={t("users.fields.status")}
          rules={[
            {
              required: true,
              message: t("formErrors.required"),
            },
          ]}
        >
          <Select
            options={[
              {
                label: t("statuses.ACTIVE"),
                value: "ACTIVE",
              },
              {
                label: t("statuses.PASSIVE"),
                value: "PASSIVE",
              },
            ]}
          />
        </Form.Item>
        <Form.Item
          name="role"
          label={t("users.fields.role")}
          rules={[
            {
              required: true,
              message: t("formErrors.required"),
            },
          ]}
        >
          <Select
            options={[
              {
                label: t("roles.VOLUNTEER"),
                value: "VOLUNTEER",
              },
            ]}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
