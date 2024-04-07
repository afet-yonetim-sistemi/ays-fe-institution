import { SingleUser } from "@/types";
import { DeleteButton, TagField } from "@refinedev/antd";
import { useShowReturnType, useTranslate } from "@refinedev/core";
import { Drawer, Typography } from "antd";
import { QueryObserverResult } from "@tanstack/react-query";

const { Title, Text } = Typography;

type Props = useShowReturnType<SingleUser> & {
  setVisibleShowDrawer: (visible: boolean) => void;
  visibleShowDrawer: boolean;
  tableQueryResult: QueryObserverResult;
};

const statusToColor = (supportStatus: SingleUser["supportStatus"]) => {
  switch (supportStatus) {
    case "IDLE":
      return "green";
    case "READY":
      return "yellow";
    case "MALFUNCTION":
      return "red";
    case "ACCIDENT":
      return "red";
    case "BUSY":
      return "red";
    case "OFFLINE":
      return "gray";
    case "ON_ROAD":
      return "yellow";
    case "RETURN":
      return "yellow";
    default:
      return "green";
  }
};

export default function ShowUser({
  setVisibleShowDrawer,
  visibleShowDrawer,
  tableQueryResult,
  ...props
}: Props) {
  const t = useTranslate();
  const { data: showQueryResult } = props.queryResult;
  const record = showQueryResult?.data;
  const { open } = useNotification();

  const titleElement = (
    <span style={{ fontSize: 18 }}>
      {t(`${record?.firstName} ${record?.lastName}`)}
    </span>
  );
  const deleteElement =
    record?.status !== "DELETED" ? (
      <DeleteButton
        recordItemId={props.showId}
        resource="user"
        successNotification={false}
        onSuccess={(): void => {
          open &&
            open({
              type: "success",
              description: t("notifications.success"),
              message: t("notifications.deleteSuccess", {
                resource: t("resources.users.singular"),
              }),
            });
          setVisibleShowDrawer(false);
          tableQueryResult.refetch().then();
        }}
      />
    ) : (
      <></>
    );

  return (
    <Drawer
      open={visibleShowDrawer}
      onClose={() => setVisibleShowDrawer(false)}
      width="500"
      title={titleElement}
      extra={deleteElement}
    >
      <Title level={5}>{t("users.fields.username")}</Title>
      <Text>{record?.username}</Text>
      <Title level={5}>{t("users.fields.phoneNumber")}</Title>
      <Text>
        {record?.phoneNumber?.countryCode} {record?.phoneNumber?.lineNumber}
      </Text>
      <Title level={5}>{t("users.fields.role")}</Title>
      <Text>{t("roles." + record?.role)}</Text>
      <Title level={5}>{t("users.fields.status")}</Title>
      <Text>{t("statuses." + record?.status)}</Text>
      <Title level={5}>{t("users.fields.supportStatus")}</Title>
      <TagField
        value={t("supportStatuses." + record?.supportStatus)}
        color={statusToColor(record?.supportStatus)}
      />
    </Drawer>
  );
}
