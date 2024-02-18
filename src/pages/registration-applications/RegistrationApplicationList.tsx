import { CrudFilters, useTranslate } from "@refinedev/core";
import { List, TagField, getDefaultSortOrder, useModal, useTable } from "@refinedev/antd";
import { Modal, Table } from "antd";
import { SingleRegisterApplication } from "@/types";
import RegistrationApplicationFilterForm from "./RegistrationApplicationFilterForm";
import IconButton from "@/components/IconButton";
import FilterIcon from "@/components/icons/FilterIcon";

export default function RegistrationApplicationList() {
  const t = useTranslate();
  const { modalProps, close, show } = useModal();

  const { filters, searchFormProps, tableProps } = useTable<SingleRegisterApplication>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSearch: (params: any) => {
      const filters: CrudFilters = [];
      const { statuses } = params;
      filters.push({
        field: "statuses",
        operator: "eq",
        value: statuses,
      });
      close();
      return filters;
    },
    resource: "admin/registration-applications",
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

  const statusToColor = (status: SingleRegisterApplication["status"]) => {
    switch (status) {
      case "WAITING":
        return "blue";
      case "COMPLETED":
        return "green";
      case "VERIFIED":
        return "purple";
      case "REJECTED":
        return "orange";
      default:
        return "blue";
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

  return (
    <>
      <Modal {...modalProps} title={t("form.filters")} footer={null}>
        <RegistrationApplicationFilterForm formProps={searchFormProps} filters={filters || []} />
      </Modal>
      <List
        title={t("registrationApplications.title")}
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
        <Table<SingleRegisterApplication>
          rowKey="id"
          dataSource={tableProps.dataSource || []}
          {...tableProps}
          pagination={{
            ...tableProps.pagination,
            pageSizeOptions: [10],
          }}
        >
          <Table.Column
            dataIndex="institution"
            title={t("registrationApplications.fields.organization")}
            render={(value) => {
              return <span>{value?.name}</span>;
            }}
          />
          <Table.Column
            dataIndex="reason"
            title={t("registrationApplications.fields.creationReason")}
            render={(value: string) => <span>{value}</span>}
          />
          <Table.Column
            dataIndex="status"
            title={t("registrationApplications.fields.status")}
            render={(value: SingleRegisterApplication["status"]) => (
              <TagField
                value={t("registrationApplicationStatuses." + value)}
                color={statusToColor(value)}
              />
            )}
          />
          <Table.Column
            dataIndex="createdUser"
            title={t("registrationApplications.fields.createdUser")}
            render={(value: string) => <span>{value}</span>}
          />
          <Table.Column
            dataIndex="createdAt"
            title={t("registrationApplications.fields.createdAt")}
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
        </Table>
      </List>
    </>
  );
}
