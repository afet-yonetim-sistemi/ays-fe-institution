import { Assignment } from "@/types";
import { Edit, UseDrawerFormReturnType } from "@refinedev/antd";
import { useTranslate } from "@refinedev/core";
import { Drawer, Form, Select } from "antd";

type Props = UseDrawerFormReturnType<Assignment>;

export default function EditAssignment({
  formProps,
  drawerProps,
  saveButtonProps,
  form,
  ...props
}: Props) {
  const t = useTranslate();
  const values = form.getFieldsValue() as Assignment;
  const oldValues = props?.queryResult?.data?.data;
  const disabled = values?.status === oldValues?.status;

  return (
    <Drawer {...drawerProps} title={t("assignments.actions.edit")}>
      <Edit
        headerButtons={<></>}
        recordItemId={props.id}
        saveButtonProps={{ ...saveButtonProps, disabled }}
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
        >
          <Form.Item
            name="status"
            label={t("assignments.fields.status")}
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
                  label: t("assignmentStatuses.AVAILABLE"),
                  value: "AVAILABLE",
                },
                {
                  label: t("assignmentStatuses.RESERVED"),
                  value: "RESERVED",
                },
                {
                  label: t("assignmentStatuses.ASSIGNED"),
                  value: "ASSIGNED",
                },
                {
                  label: t("assignmentStatuses.IN_PROGRESS"),
                  value: "IN_PROGRESS",
                },
                {
                  label: t("assignmentStatuses.DONE"),
                  value: "DONE",
                },
              ]}
            />
          </Form.Item>
        </Form>
      </Edit>
    </Drawer>
  );
}
