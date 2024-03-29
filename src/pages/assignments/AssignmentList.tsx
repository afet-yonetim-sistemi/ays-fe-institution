import {
  CrudFilters,
  IResourceComponentsProps,
  getDefaultFilter,
  useTranslate,
  useShow,
  useNotification,
} from "@refinedev/core";
import {
  DeleteButton,
  EditButton,
  ShowButton,
  List,
  TagField,
  useDrawerForm,
  useModal,
  useTable,
} from "@refinedev/antd";
import { Modal, Space, Table, Tooltip } from "antd";
import { Assignment } from "@/types";
import { useState } from "react";
import { countryCodes } from "@/utilities";
import EditAssignment from "./Actions/EditAssignment";
import CreateAssignment from "./Actions/CreateAssignment";
import Map from "@/components/map/Map";
import LocationIcon from "@/components/icons/LocationIcon";
import AssignmentFilterForm from "./AssignmentFilterForm";
import IconButton from "@/components/IconButton";
import FilterIcon from "@/components/icons/FilterIcon";
import ShowAssignment from "@/pages/assignments/Actions/ShowAssignment";

export const AssignmentList: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [location, setLocation] = useState<[number, number]>([0, 0]);
  const { show, modalProps, close } = useModal();

  const { open } = useNotification();

  // Show Drawer
  const [visibleShowDrawer, setVisibleShowDrawer] = useState<boolean>(false);
  const showDrawerProps = useShow<Assignment>({
    resource: "assignment",
  });

  const { filters, tableProps, searchFormProps, tableQueryResult } = useTable<Assignment>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSearch: (params: any) => {
      const filters: CrudFilters = [];
      const { statuses, phoneNumber } = params;
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
          countryCode: phoneNumber?.countryCode?.length ? phoneNumber?.countryCode : undefined,
          lineNumber: phoneNumber?.lineNumber?.length ? phoneNumber?.lineNumber : undefined,
        },
      });
      close();
      return filters;
    },
    resource: "assignments",
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

  const statusToColor = (status: Assignment["status"]) => {
    switch (status) {
      case "ASSIGNED":
        return "blue";
      case "AVAILABLE":
        return "green";
      case "DONE":
        return "purple";
      case "IN_PROGRESS":
        return "orange";
      case "RESERVED":
        return "red";
      default:
        return "blue";
    }
  };

  // Create Drawer
  const createDrawerProps = useDrawerForm<Assignment>({
    resource: "assignment",
    action: "create",
    syncWithLocation: true,
    successNotification: false,
    defaultFormValues: {
      phoneNumber: {
        countryCode: countryCodes[0].phoneCode,
      },
    },
  });

  // Edit Drawer
  const editDrawerProps = useDrawerForm<Assignment>({
    action: "edit",
    resource: "assignment",
    syncWithLocation: true,
  });

  const showLocation = (location: Assignment["location"]) => {
    if (location?.latitude && location?.longitude) {
      setLocation([location.latitude, location.longitude]);
      setIsMapOpen(true);
    }
  };

  const onCancel = () => {
    setIsMapOpen(false);
  };

  return (
    <>
      <Map location={location} open={isMapOpen} onCancel={onCancel} />
      <Modal {...modalProps} title={t("form.filters")} footer={null}>
        <AssignmentFilterForm formProps={searchFormProps} filters={filters || []} />
      </Modal>
      <List
        title={t("assignments.title")}
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
        <Table<Assignment>
          rowKey="id"
          {...tableProps}
          pagination={{
            ...tableProps.pagination,
            pageSizeOptions: [10],
          }}
        >
          <Table.Column
            key="name"
            dataIndex="firstName"
            title={t("assignments.fields.firstName")}
          />
          <Table.Column dataIndex="lastName" title={t("assignments.fields.lastName")} />
          <Table.Column dataIndex="description" title={t("table.description")} />
          <Table.Column
            dataIndex="status"
            title={t("assignments.fields.status")}
            render={(value: Assignment["status"]) => (
              <TagField value={t("assignmentStatuses." + value)} color={statusToColor(value)} />
            )}
            defaultFilteredValue={getDefaultFilter("status", filters)}
          />
          <Table.Column<Assignment>
            title={t("table.actions")}
            dataIndex="actions"
            key="actions"
            render={(_, record) => (
              <Space size="middle">
                <Tooltip title={t("table.location")}>
                  <IconButton
                    onClick={() => showLocation(record.location)}
                    icon={<LocationIcon />}
                  />
                </Tooltip>
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
                {record.status === "AVAILABLE" && (
                  <>
                    <EditButton
                      size="middle"
                      recordItemId={record.id}
                      resource="assignment"
                      onClick={() => editDrawerProps.show(record.id)}
                      hideText
                    />
                    <DeleteButton
                      size="middle"
                      recordItemId={record.id}
                      resource="assignment"
                      successNotification={false}
                      hideText
                      onSuccess={() => {
                        open &&
                          open({
                            type: "success",
                            description: t("notifications.success"),
                            message: t("notifications.deleteSuccess", {
                              resource: t("resources.assignments.singular"),
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
        <CreateAssignment {...createDrawerProps} />
        <EditAssignment {...editDrawerProps} />
        <ShowAssignment
          {...showDrawerProps}
          visibleShowDrawer={visibleShowDrawer}
          setVisibleShowDrawer={setVisibleShowDrawer}
        />
      </List>
    </>
  );
};
