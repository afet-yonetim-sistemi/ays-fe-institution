import { IResourceComponentsProps, getDefaultFilter, useTranslate } from "@refinedev/core";
import { List, TagField, useTable } from "@refinedev/antd";

import { Table } from "antd";
import { Admin } from "@/types";

export const AdminList: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();

  const { filters, tableProps } = useTable<Admin>({
    resource: "admins",
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
    },
  });

  const statusToColor = (status: Admin["status"]) => {
    switch (status) {
      case "ACTIVE":
        return "green";
      case "PASSIVE":
        return "gray";
      case "DELETED":
        return "red";
      case "NOT_VERIFIED":
        return "orange";
      default:
        return "green";
    }
  };

  return (
    <List title={t("admins.title")} canCreate={false}>
      <Table
        rowKey="id"
        dataSource={tableProps.dataSource || []}
        pagination={{
          ...tableProps.pagination,
          pageSizeOptions: [10],
        }}
      >
        <Table.Column dataIndex="firstName" title={t("users.fields.firstName")} />
        <Table.Column dataIndex="lastName" title={t("users.fields.lastName")} />
        <Table.Column
          dataIndex="institution"
          title={t("users.fields.institution")}
          render={(value) => {
            return <span>{value?.name}</span>;
          }}
        />
        <Table.Column
          dataIndex="status"
          title={t("users.fields.status")}
          render={(value: Admin["status"]) => (
            <TagField value={t("statuses." + value)} color={statusToColor(value)} />
          )}
          // onFilter={(value, record: User) => {
          //   return record.status === value;
          // }}
          // filters={[
          //   {
          //     text: t("statuses.ACTIVE"),
          //     value: "ACTIVE",
          //   },
          //   {
          //     text: t("statuses.PASSIVE"),
          //     value: "PASSIVE",
          //   },
          //   {
          //     text: t("statuses.DELETED"),

          //     value: "DELETED",
          //   },
          // ]}
          defaultFilteredValue={getDefaultFilter("status", filters)}
        />
      </Table>
    </List>
  );
};
