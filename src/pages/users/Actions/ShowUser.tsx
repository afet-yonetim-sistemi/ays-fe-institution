import { SingleUser } from "@/types";
import { DeleteButton, TagField } from "@refinedev/antd";
import { useShowReturnType, useTranslate } from "@refinedev/core";
import { Drawer, Typography } from "antd";

const { Title, Text } = Typography;

type Props = useShowReturnType<SingleUser> & {
  setVisibleShowDrawer: (visible: boolean) => void;
  visibleShowDrawer: boolean;
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

export default function ShowUser({ setVisibleShowDrawer, visibleShowDrawer, ...props }: Props) {
  const t = useTranslate();
  const { data: showQueryResult } = props.queryResult;
  const record = showQueryResult?.data;
  return (
    <Drawer
      open={visibleShowDrawer}
      onClose={() => setVisibleShowDrawer(false)}
      width="500"
      title={<span style={{ fontSize: 18 }}>{t(record?.firstName + " " + record?.lastName)}</span>}
      extra={
        record?.status !== "DELETED" ? (
          <DeleteButton recordItemId={props.showId} onSuccess={() => setVisibleShowDrawer(false)} />
        ) : (
          <></>
        )
      }
    >
      <Title level={5}>{t("users.fields.username")}</Title>
      <Text>{record?.username}</Text>
      <Title level={5}>{t("assignments.fields.phoneNumber")}</Title>
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
