import { User, SingleUser } from "@/types";
import { DeleteButton, Show } from "@refinedev/antd";
import { useShowReturnType, useTranslate } from "@refinedev/core";
import { Drawer, Typography } from "antd";

const { Title, Text } = Typography;

type Props = useShowReturnType<SingleUser> & {
  setVisibleShowDrawer: (visible: boolean) => void;
  visibleShowDrawer: boolean;
};

export default function ShowUser({ setVisibleShowDrawer, visibleShowDrawer, ...props }: Props) {
  const t = useTranslate();
  const { data: showQueryResult, isLoading: showIsLoading } = props.queryResult;
  const record = showQueryResult?.data;
  return (
    <Drawer
      open={visibleShowDrawer}
      onClose={() => setVisibleShowDrawer(false)}
      width="500"
      title={t("users.actions.show")}
    >
      <Show
        isLoading={showIsLoading}
        headerButtons={
          record?.status !== "DELETED" ? (
            <DeleteButton
              recordItemId={props.showId}
              onSuccess={() => setVisibleShowDrawer(false)}
            />
          ) : (
            <></>
          )
        }
      >
        <Title level={5}>{t("users.fields.username")}</Title>
        <Text>{record?.username}</Text>
        <Title level={5}>{t("users.fields.firstName")}</Title>
        <Text>{record?.firstName}</Text>
        <Title level={5}>{t("users.fields.lastName")}</Title>
        <Text>{record?.lastName}</Text>
        <Title level={5}>{t("users.fields.institution")}</Title>
        <Text>{record?.institution?.name}</Text>
        <Title level={5}>{t("users.fields.role")}</Title>
        <Text>{t("roles." + record?.role)}</Text>
        <Title level={5}>{t("users.fields.status")}</Title>
        <Text>{t("statuses." + record?.status)}</Text>
        <Title level={5}>{t("users.fields.supportStatus")}</Title>
        <Text>{t("supportStatuses." + record?.supportStatus)}</Text>
      </Show>
    </Drawer>
  );
}
