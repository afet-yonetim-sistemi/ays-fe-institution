// Import React
import { useEffect } from "react";

// Import Constants
import { STATUS } from "../../../common/contants/status";
import { FORM_RULES } from "../../../common/contants/formRules";

// Import Antd
import { useForm } from "antd/lib/form/Form";

// Import Components
import Form from "../../../components/form-elements/Form";
import Drawer from "../../../components/drawer/Drawer";
import Button from "../../../components/Button/Button";
import Input from "../../../components/form-elements/Input";
import FormItem from "../../../components/form-elements/FormItem";
import { Col, Row } from "antd";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import {
  createUser,
  setDrawer,
  updateUser,
} from "../../../store/reducers/usersReducer";
import { translate } from "../../../common/utils/translateUtils";
import {
  CreateUserRequest,
  IUser,
  UpdateUserRequest,
} from "../../../client/services/user";
import Select from "../../../components/form-elements/Select";

function UsersCrud() {
  // Form
  const [form] = useForm();

  // Actions
  const drawerCloser = () => {
    dispatch(setDrawer({ visible: false, record: null }));
    form.resetFields();
  };

  // dispatch
  const dispatch = useAppDispatch();
  const { visible, record } = useAppSelector((state) => state.users.drawer);

  const onCreate = async (values: CreateUserRequest) => {
    await dispatch(
      createUser({
        firstName: values.firstName,
        lastName: values.lastName,
        phoneNumber: values.phoneNumber,
      })
    );
  };

  const onUpdate = async (values: UpdateUserRequest) => {
    await dispatch(
      updateUser({
        role: values.role,
        status: values.status,
      })
    );
  };

  const onSubmit = async (values: CreateUserRequest | UpdateUserRequest) => {
    record
      ? await onUpdate(values as UpdateUserRequest)
      : await onCreate(values as CreateUserRequest);
    drawerCloser();
  };

  // useEffect
  useEffect(() => {
    record && form.setFieldsValue(record);
    // eslint-disable-next-line
  }, [record]);

  return (
    <Drawer
      title={record ? "DRAWER.TITLES.EDIT_USER" : "DRAWER.TITLES.ADD_USER"}
      visible={visible}
      onClose={drawerCloser}
      footer={
        <>
          <Button
            name="cancel_cta"
            onClick={drawerCloser}
            label="FORM_ELEMENTS.CTA.CANCEL"
            status={STATUS.SECONDARY}
          />

          <Button
            name="submit_cta"
            marginleft={10}
            onClick={() => {
              form.submit();
            }}
            label="FORM_ELEMENTS.CTA.SAVE"
            status={STATUS.SUCCESS}
          />
        </>
      }
    >
      <Form form={form} onFinish={onSubmit}>
        {record ? <EditForm record={record} /> : <CreateForm />}
      </Form>
    </Drawer>
  );
}

const CreateForm = () => {
  return (
    <div>
      <Input
        name="firstName"
        rules={[FORM_RULES.REQUIRED]}
        label="FORM_ELEMENTS.LABELS.NAME"
      />
      <Input
        name="lastName"
        rules={[FORM_RULES.REQUIRED]}
        label="FORM_ELEMENTS.LABELS.SURNAME"
      />

      <FormItem
        label="FORM_ELEMENTS.LABELS.PHONE_NUMBER"
        style={{ marginBottom: 0 }}
        rules={[FORM_RULES.REQUIRED]}
      >
        <Row gutter={8}>
          <Col span={6}>
            <FormItem name={["phoneNumber", "countryCode"]} noStyle>
              <Input />
            </FormItem>
          </Col>
          <Col span={18}>
            <FormItem name={["phoneNumber", "lineNumber"]} noStyle>
              <Input />
            </FormItem>
          </Col>
        </Row>
      </FormItem>
    </div>
  );
};

type EditFormProps = {
  record: IUser;
};

const EditForm = ({ record }: EditFormProps) => {
  return (
    <div>
      <FormItem name="role" label="TABLE.COLUMN.ROLE">
        <Select
          placeholder="TABLE.COLUMN.ROLE"
          options={[
            { label: translate("TABLE.ROLE.VOLUNTEER"), value: "VOLUNTEER" },
          ]}
          value={record.role}
        />
      </FormItem>
      <FormItem name="status" label="TABLE.COLUMN.STATUS">
        <Select
          placeholder="TABLE.COLUMN.STATUS"
          options={[
            { label: translate("TABLE.STATUS.ACTIVE"), value: "ACTIVE" },
            { label: translate("TABLE.STATUS.PASSIVE"), value: "PASSIVE" },
            { label: translate("TABLE.STATUS.DELETED"), value: "DELETED" },
          ]}
          value={record.status}
        />
      </FormItem>
    </div>
  );
};

export default UsersCrud;
