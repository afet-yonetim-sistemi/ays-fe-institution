import {
  CrudFilters,
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
  getDefaultSortOrder,
} from "@refinedev/antd";

import { Modal, Space, Table, Divider, Typography } from "antd";
import { CreateUserResponse, SingleUser, User } from "@/types";
import React,{ useState } from "react";

import "./style.css";
import { countryCodes } from "@/utilities";
import CreateUser from "./Actions/CreateUser";
import EditUser from "./Actions/EditUser";
import ShowUser from "./Actions/ShowUser";
import { useCopyToClipboard } from "@/components/hooks/useCopyToClipboard";
import UserFilterForm from "./UserFilterForm";
import IconButton from "@/components/IconButton";
import FilterIcon from "@/components/icons/FilterIcon";

export const UserList: React.FC<IResourceComponentsProps> = () => {
  const { show, modalProps, close } = useModal();
  const {
    show: showNewUserModal,
    modalProps: newUserModalProps,
    close: closeNewUserModal,
  } = useModal();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [newRecord, setNewRecord] = useState<CreateUserResponse | undefined>(
    undefined
  );
  const [_value, copy] = useCopyToClipboard();
  const [confirmModal, setConfirmModal] = useState<boolean>(false);
  const [modal, contextHolder] = Modal.useModal();
  const t = useTranslate();

  const { open } = useNotification();

  const { filters, tableProps, searchFormProps, tableQueryResult } =
    useTable<SingleUser>({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSearch: (params: any) => {
        const filters: CrudFilters = [];
        const { firstName, lastName, supportStatuses, statuses, phoneNumber } =
          params;
        if (firstName) {
          filters.push({
            field: "firstName",
            operator: "eq",
            value: firstName,
          });
        }
        if (lastName) {
          filters.push({
            field: "lastName",
            operator: "eq",
            value: lastName,
          });
        }
        if (supportStatuses) {
          filters.push({
            field: "supportStatuses",
            operator: "eq",
            value: supportStatuses,
          });
        }
        if (statuses) {
          filters.push({
            field: "statuses",
            operator: "eq",
            value: statuses,
          });
        }
        filters.push({
          field: "phoneNumber",
          operator: "eq",
          value: {
            countryCode: phoneNumber?.countryCode?.length
              ? phoneNumber?.countryCode
              : undefined,
            lineNumber: phoneNumber?.lineNumber?.length
              ? phoneNumber?.lineNumber
              : undefined,
          },
        });
        close();
        return filters;
      },

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
      sorters: {
        mode: "server",
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

  const formatDate = (value: string): string => {
    const date = new Date(value);

    const day = padZero(date.getDate());
    const month = padZero(date.getMonth() + 1);
    const year = date.getFullYear();

    const hour = padZero(date.getHours());
    const minute = padZero(date.getMinutes());
    const second = padZero(date.getSeconds());

    return `${day}.${month}.${year} ${hour}:${minute}:${second}`;
  };

  const padZero = (num: number): string => {
    return num < 10 ? `0${num}` : `${num}`;
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
      const newUser = data.data as CreateUserResponse;
      setNewRecord(newUser);
      showNewUserModal();
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
      newUserModalProps.onCancel && newUserModalProps.onCancel(e);
    }
    setConfirmModal(false);
  };

  return (
    <>
      <Modal {...modalProps} title={t("form.filters")} footer={null}>
        <UserFilterForm formProps={searchFormProps} filters={filters || []} />
      </Modal>
      <List
        title={t("users.title")}
        canCreate
        createButtonProps={{
          onClick: () => {
            createDrawerProps.show();
          },
        }}
        headerButtons={({ defaultButtons }) => (
          <>
            <IconButton
              type="default"
              icon={<FilterIcon height="1.3em" width="1.3em" />}
              onClick={() => show()}
            />
            {defaultButtons}
          </>
        )}
      >
        {contextHolder}
        <Modal
          {...newUserModalProps}
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
            newUserModalProps.onCancel && newUserModalProps.onCancel(e);
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
        <Table
          rowKey="id"
          id="users-table"
          {...tableProps}
          pagination={{
            ...tableProps.pagination,
          }}
        >
          <Table.Column
            dataIndex="firstName"
            width={330}
            title={t("users.fields.firstName")}
            render={(value: string) => <span>{value}</span>}
          />
          <Table.Column
            dataIndex="lastName"
            width={330}
            title={t("users.fields.lastName")}
            render={(value: string) => <span>{value}</span>}
          />
          <Table.Column
            dataIndex="role"
            width={300}
            title={t("users.fields.role")}
            render={(value: User["role"]) => {
              return <span>{t("roles." + value)}</span>;
            }}
          />
          <Table.Column
            dataIndex="status"
            title={t("users.fields.status")}
            width={300}
            render={(value: User["status"]) => (
              <TagField
                value={t("statuses." + value)}
                color={statusToColor(value)}
              />
            )}
            defaultFilteredValue={getDefaultFilter("status", filters)}
          />
          <Table.Column
            dataIndex="createdAt"
            title={t("users.fields.createdAt")}
            width={400}
            render={(value: string) => <span>{formatDate(value)}</span>}
            defaultSortOrder={getDefaultSortOrder("createdAt")}
            sorter={(a: { createdAt: number }, b: { createdAt: number }) => {
              if (a.createdAt < b.createdAt) {
                return -1;
              }
              if (a.createdAt > b.createdAt) {
                return 1;
              }
              return 0;
            }}
          />
          <Table.Column<User>
            title={t("table.actions")}
            dataIndex="actions"
            key="actions"
            width={250}
            render={(_, record) => (
              <Space size="middle">
                <ShowButton
                  hideText
                  size="middle"
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
                      size="middle"
                      recordItemId={record.id}
                      resource="user"
                      onClick={() => editDrawerProps.show(record.id)}
                      hideText
                    />
                    <DeleteButton
                      size="middle"
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
                        tableQueryResult.refetch();
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
    </>
  );
};
