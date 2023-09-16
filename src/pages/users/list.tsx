import {
  IResourceComponentsProps,
  getDefaultFilter,
  useNotification,
  useShow,
  useTranslate,
} from "@refinedev/core";
import {
  List,
  TagField,
  useTable,
  useDrawerForm,
  DeleteButton,
  EditButton,
  ShowButton,
  useModal,
} from "@refinedev/antd";

import { Divider, Modal, Space, Table, Typography } from "antd";
import { CreateUserResponse, User } from "@/types";
import { useState } from "react";

import "./style.css";
import { countryCodes } from "@/utilities";
import CreateUser from "./Actions/CreateUser";
import EditUser from "./Actions/EditUser";
import ShowUser from "./Actions/ShowUser";
import { useCopyToClipboard } from "@/components/hooks/useCopyToClipboard";

export const UserList: React.FC<IResourceComponentsProps> = () => {
  const { show, modalProps } = useModal();
  const [newRecord, setNewRecord] = useState<CreateUserResponse | undefined>(undefined);
  const [_value, copy] = useCopyToClipboard();
  const [confirmModal, setConfirmModal] = useState<boolean>(false);
  const [modal, contextHolder] = Modal.useModal();
  const t = useTranslate();

  const { open } = useNotification();

  const { filters, tableProps } = useTable<User>({
    resource: "users",
    filters: {
      permanent: [
        {
          field: "getToPost",
          operator: "eq",
          value: true,
        },
      ],
    },
    pagination: {
      pageSize: 10,
      current: 1,
    },
  });

  const statusToColor = (status: User["status"]) => {
    switch (status) {
      case "ACTIVE":
        return "green";
      case "PASSIVE":
        return "gray";
      case "DELETED":
        return "red";
      default:
        return "green";
    }
  };

  // Create Drawer
  const createDrawerProps = useDrawerForm<User>({
    resource: "user",
    action: "create",
    syncWithLocation: true,
    successNotification: false,
    defaultFormValues: {
      phoneNumber: {
        countryCode: countryCodes[0].phoneCode,
      },
    },

    onMutationSuccess(data) {
      setNewRecord(data?.data);
      show();
      open &&
        open({
          type: "success",
          description: t("notifications.success"),
          message: t("notifications.createSuccess", {
            resource: t("resources.users.singular"),
          }),
        });
    },
  });

  // Edit Drawer
  const editDrawerProps = useDrawerForm<User>({
    action: "edit",
    resource: "user",
    syncWithLocation: true,
  });

  // Show Drawer
  const [visibleShowDrawer, setVisibleShowDrawer] = useState<boolean>(false);
  const showDrawerProps = useShow<User>({
    resource: "user",
  });

  const onCancel = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (confirmModal) return;

    setConfirmModal(true);
    const confirm = await modal.confirm({
      title: t("notifications.warning"),
      content: t("users.newUserModal.onCancelTitle"),
      cancelButtonProps: {
        hidden: false,
      },
      cancelText: t("buttons.cancel"),
      okText: t("buttons.ok"),
    });

    if (confirm) {
      modalProps.onCancel && modalProps.onCancel(e);
    }
    setConfirmModal(false);
  };

  return (
    <List
      title={t("users.title")}
      canCreate
      createButtonProps={{
        onClick: () => {
          createDrawerProps.show();
        },
      }}
    >
      {contextHolder}
      <Modal
        {...modalProps}
        title={t("users.newUserModal.title")}
        onCancel={onCancel}
        cancelButtonProps={{
          hidden: true,
        }}
        okText={t("users.newUserModal.copyAndClose")}
        onOk={(e) => {
          copy(
            `${t("users.fields.username")}: ${newRecord?.username}\n${t(
              "users.fields.password"
            )}: ${newRecord?.password}`
          );
          modalProps.onCancel && modalProps.onCancel(e);
          open &&
            open({
              type: "success",
              description: t("notifications.success"),
              message: t("users.newUserModal.copySuccess"),
            });
        }}
      >
        <Space
          direction="vertical"
          style={{
            width: "100%",
            padding: "1rem 0",
          }}
        >
          <Typography.Text>{t("users.newUserModal.message")}</Typography.Text>
          <Divider
            style={{
              margin: "0.5rem 0",
            }}
          />
          <Typography.Text>
            {t("users.fields.username")}: {newRecord?.username}
          </Typography.Text>
          <Typography.Text>
            {t("users.fields.password")}: {newRecord?.password}
          </Typography.Text>
        </Space>
      </Modal>
      <Table rowKey="id" {...tableProps}>
        <Table.Column
          dataIndex="firstName"
          title={t("users.fields.firstName")}
          render={(value: string) => <span>{value}</span>}
        />
        <Table.Column
          dataIndex="lastName"
          title={t("users.fields.lastName")}
          render={(value: string) => <span>{value}</span>}
        />
        <Table.Column
          dataIndex="institution"
          title={t("users.fields.institution")}
          render={(value) => {
            return <span>{value?.name}</span>;
          }}
        />
        <Table.Column
          dataIndex="role"
          title={t("users.fields.role")}
          render={(value: User["role"]) => {
            return <span>{t("roles." + value)}</span>;
          }}
        />
        <Table.Column
          dataIndex="status"
          title={t("users.fields.status")}
          render={(value: User["status"]) => (
            <TagField value={t("statuses." + value)} color={statusToColor(value)} />
          )}
          defaultFilteredValue={getDefaultFilter("status", filters)}
        />
        <Table.Column<User>
          title={t("table.actions")}
          dataIndex="actions"
          key="actions"
          render={(_, record) => (
            <Space size="middle">
              <ShowButton
                hideText
                size="small"
                recordItemId={record.id}
                onClick={() => {
                  showDrawerProps.setShowId(record.id);
                  setVisibleShowDrawer(true);
                }}
                color="primary"
              />
              {record.status !== "DELETED" && (
                <>
                  <EditButton
                    size="small"
                    recordItemId={record.id}
                    resource="user"
                    onClick={() => editDrawerProps.show(record.id)}
                    hideText
                  />
                  <DeleteButton
                    size="small"
                    recordItemId={record.id}
                    resource="user"
                    successNotification={false}
                    hideText
                    onSuccess={() => {
                      open &&
                        open({
                          type: "success",
                          description: t("notifications.success"),
                          message: t("notifications.deleteSuccess", {
                            resource: t("resources.users.singular"),
                          }),
                        });
                    }}
                  />
                </>
              )}
            </Space>
          )}
        />
      </Table>
      <CreateUser {...createDrawerProps} />
      <EditUser {...editDrawerProps} />
      <ShowUser
        {...showDrawerProps}
        visibleShowDrawer={visibleShowDrawer}
        setVisibleShowDrawer={setVisibleShowDrawer}
      />
    </List>
  );
};
