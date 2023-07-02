// Import React
import { useEffect, useState } from "react";

// Import Utils
import { tableFilter } from "../../../common/utils/tableFilterUtil";
import { translate } from "../../../common/utils/translateUtils";

// Import Constants
import { ICON_LIST } from "../../../common/contants/iconList";
import { ICON_STATUS } from "../../../common/contants/iconStatus";
import { STATUS } from "../../../common/contants/status";
import { BUTTON_SIZES } from "../../../common/contants/buttonSizes";
// Import Antd
import { Badge, TableColumnsType } from "antd";

// Import Components
import LocationModal from "../../../components/modal/LocationModal";
import PopConfirm from "../../../components/popconfirm/PopConfirm";
import Table from "../../../components/table/Table";
import Button from "../../../components/Button/Button";
import Icon from "../../../components/Icon/Icon";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { getUsers } from "../../../store/reducers/usersReducer";
import { User } from "../../../client/services/user";

interface IUsersTable {
  search: string;
  setCrudVisible: (status: boolean) => void;
  setRecord: (record: User | null) => void;
}

function UsersTable(props: IUsersTable) {
  // useAppSelector
  const { content: users } = useAppSelector((state) => state.users);
  // useAppDispatch
  const dispatch = useAppDispatch();

  // Props Destruction
  const { search, setCrudVisible, setRecord } = props;

  // useStates
  const [detailRecord, setDetailRecord] = useState<Record<string, any> | null>(
    null
  );
  const [detailVisible, setDetailVisible] = useState(false);

  // Columns
  const columns: TableColumnsType<User> = [
    {
      title: "TABLE.COLUMN.NAME",
      dataIndex: "fullName",
      key: "fullName",
      // merge first and last name
      render: (_: any, record) => {
        return record.firstName + " " + record.lastName;
      },
    },
    {
      title: "TABLE.COLUMN.ROLE",
      key: "role",
      dataIndex: "role",
      render: (_: any, record) => {
        return renderRole(record.role);
      },
    },
    {
      title: "TABLE.COLUMN.STATUS",
      key: "status",
      dataIndex: "status",
      render: (_: any, record) => {
        return renderBadge(record.status);
      },
    },
    {
      title: "TABLE.COLUMN.ACTIONS",
      dataIndex: "actions",
      align: "center",
      width: 200,
      render: (_: any, record) => (
        <>
          <Button
            sizes={BUTTON_SIZES.SM}
            name="cta_edit"
            marginright={10}
            icon={<Icon icon={ICON_LIST.MAP_PIN} status={ICON_STATUS.WHITE} />}
            status={STATUS.PRIMARY}
            label="FORM_ELEMENTS.CTA.LOCATION"
            onClick={() => {
              setDetailRecord(record);
              setDetailVisible(true);
            }}
          />
          <Button
            sizes={BUTTON_SIZES.SM}
            name="cta_edit"
            icon={<Icon icon={ICON_LIST.EDIT} status={ICON_STATUS.WHITE} />}
            status={STATUS.SECONDARY}
            onClick={() => {
              setRecord(record);
              setCrudVisible(true);
            }}
          />
          <PopConfirm
            onConfirm={() => console.log("deleted")}
            title="POPCONFIRM.TITLES.DELETE"
          >
            <Button
              name="cta_delete"
              sizes={BUTTON_SIZES.SM}
              marginleft={10}
              icon={<Icon icon={ICON_LIST.DELETE} status={ICON_STATUS.WHITE} />}
              status={STATUS.DANGER}
            />
          </PopConfirm>
        </>
      ),
    },
  ];

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  // ACTIVE || PASSIVE || DELETED
  const renderBadge = (status: User["status"]) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge status="success" text={translate("TABLE.STATUS.ACTIVE")} />
        );
      case "PASSIVE":
        return (
          <Badge status="warning" text={translate("TABLE.STATUS.PASSIVE")} />
        );
      case "DELETED":
        return (
          <Badge status="error" text={translate("TABLE.STATUS.DELETED")} />
        );
      default:
        return (
          <Badge status="default" text={translate("TABLE.STATUS.DEFAULT")} />
        );
    }
  };

  // ADMIN || VOLUNTEER
  const renderRole = (role: User["role"]) => {
    switch (role) {
      case "ADMIN":
        return <span>{translate("TABLE.ROLE.ADMIN")}</span>;
      case "VOLUNTEER":
        return <span>{translate("TABLE.ROLE.VOLUNTEER")}</span>;
      case "SUPER_ADMIN":
        return <span>{translate("TABLE.ROLE.SUPER_ADMIN")}</span>;
      default:
        return <span>{translate("TABLE.ROLE.VOLUNTEER")}</span>;
    }
  };

  return (
    <>
      <LocationModal
        location={[37.48679072911579, 37.294409157562775]}
        markerDescription={detailRecord?.name}
        title={detailRecord?.name + translate("MAP.S_LOCATION")}
        visible={detailVisible}
        afterClose={() => {
          setDetailRecord(null);
        }}
        onCancel={() => {
          setDetailVisible(false);
        }}
      />

      <Table
        name="users"
        columns={columns}
        dataSource={tableFilter(search, ["firstName"], users)}
        title="TABLE.TITLES.USERS"
        onRow={(record) => {
          return {
            onClick: (e: any) => {
              if (e.target?.nodeName === "TD") {
                setDetailVisible(true);
                setDetailRecord(record);
              }
            },
          };
        }}
        headerControls={
          <Button
            name="add_cta"
            label="FORM_ELEMENTS.CTA.ADD_NEW"
            sizes={BUTTON_SIZES.SM}
            status={STATUS.PRIMARY}
            icon={<Icon icon={ICON_LIST.PLUS} status={ICON_STATUS.WHITE} />}
            onClick={() => setCrudVisible(true)}
          />
        }
      />
    </>
  );
}

export default UsersTable;
