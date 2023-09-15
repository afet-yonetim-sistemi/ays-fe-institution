import { User } from "@/types";
import { Edit, UseDrawerFormReturnType } from "@refinedev/antd";
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
  const oldValues = props?.queryResult?.data?.data;
  const disabled = values?.status === oldValues?.status && values.role === oldValues?.role;

  return (
    <Drawer {...drawerProps} title={t("users.actions.edit")}>
      <Edit
        headerButtons={<></>}
        recordItemId={props.id}
        saveButtonProps={{ ...saveButtonProps, disabled }}
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
        deleteButtonProps={props.deleteButtonProps}
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
      </Edit>
    </Drawer>
  );
}
