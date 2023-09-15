import { IResourceComponentsProps, getDefaultFilter, useTranslate } from "@refinedev/core";
import { List, TagField, useDrawerForm, useTable } from "@refinedev/antd";

import { Button, Space, Table, Tooltip } from "antd";
import { Assignment } from "@/types";
import { useState } from "react";

import { countryCodes } from "@/utilities";
import CreateAssignment from "./Actions/CreateAssignment";
import Map from "@/components/map/Map";
import LocationIcon from "@/components/icons/LocationIcon";

export const AssignmentList: React.FC<IResourceComponentsProps> = () => {
  const t = useTranslate();
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [location, setLocation] = useState<[number, number]>([0, 0]);

  const { filters, tableProps } = useTable<Assignment>({
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

  // Create Assignment
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
      <List
        title={t("assignments.title")}
        canCreate
        createButtonProps={{
          onClick: () => {
            createDrawerProps.show();
          },
        }}
      >
        <Table<Assignment> rowKey="id" dataSource={tableProps.dataSource || []}>
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
                  <Button
                    type="primary"
                    onClick={() => showLocation(record.location)}
                    icon={<LocationIcon />}
                  />
                </Tooltip>
              </Space>
            )}
          />
        </Table>
        <CreateAssignment {...createDrawerProps} />
      </List>
    </>
  );
};
