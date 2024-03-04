import { SingleRegisterApplication } from "@/types";
import { Show, TagField } from "@refinedev/antd";
import { useShowReturnType, useTranslate } from "@refinedev/core";
import { Drawer, Typography } from "antd";

const { Title, Text } = Typography;

type Props = useShowReturnType<SingleRegisterApplication> & {
  setVisibleShowDrawer: (visible: boolean) => void;
  visibleShowDrawer: boolean;
};

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

const formatPhoneNumber = (phoneNumber: string): string => {
  const areaCode = phoneNumber.slice(0, 3);
  const firstPart = phoneNumber.slice(3, 6);
  const secondPart = phoneNumber.slice(6, 8);
  const thirdPart = phoneNumber.slice(8);

  return `(${areaCode}) ${firstPart} ${secondPart} ${thirdPart}`;
};

export default function ShowRegistrationApplication({
  setVisibleShowDrawer,
  visibleShowDrawer,
  ...props
}: Props) {
  const t = useTranslate();
  const { data: showQueryResult, isLoading: showIsLoading } = props.queryResult;
  const record = showQueryResult?.data;

  const rejectedTitleElement = (
    <span style={{ fontSize: 17, marginLeft: 5 }}>
      {t("registrationApplications.rejectedTitle")}
    </span>
  );
  const completedTitleElement = (
    <span style={{ fontSize: 17, marginLeft: 5 }}>
      {t("registrationApplications.completedTitle")}
    </span>
  );

  return (
    <Drawer
      open={visibleShowDrawer}
      onClose={() => {
        setVisibleShowDrawer(false);
      }}
      width="500"
      title={t("registrationApplications.actions.show")}
    >
      {" "}
      {record?.status === "REJECTED" && (
        <Show isLoading={showIsLoading} headerButtons={<></>} title={rejectedTitleElement}>
          <>
            <Title level={5}>{t("registrationApplications.fields.institution")}</Title>
            <Text>{record?.institution?.name}</Text>
            <Title level={5}>{t("registrationApplications.fields.creationReason")}</Title>
            <Text>{record?.reason}</Text>
            <Title level={5}>{t("registrationApplications.fields.rejectReason")}</Title>
            <Text>{record?.rejectReason}</Text>
            <Title level={5}>{t("users.fields.status")}</Title>
            <TagField
              value={t("statuses." + record?.status)}
              color={statusToColor(record?.status)}
              style={{ marginBottom: 10 }}
            />
            <Title level={5}>{t("registrationApplications.fields.createdUser")}</Title>
            <Text>{record?.createdUser}</Text>
            <Title level={5}>{t("registrationApplications.fields.creationDate")}</Title>
            <Text>{formatDate(record?.createdAt ?? "")}</Text>
          </>
        </Show>
      )}
      {record?.status !== "WAITING" && (
        <Show isLoading={showIsLoading} headerButtons={<></>} title={completedTitleElement}>
          <>
            <Title level={5}>{t("registrationApplications.fields.username")}</Title>
            <Text>{record?.adminUser?.username}</Text>
            <Title level={5}>{t("registrationApplications.fields.email")}</Title>
            <Text>{record?.adminUser?.email}</Text>
            <Title level={5}>{t("registrationApplications.fields.firstName")}</Title>
            <Text>{record?.adminUser?.firstName}</Text>
            <Title level={5}>{t("registrationApplications.fields.lastName")}</Title>
            <Text>{record?.adminUser?.lastName}</Text>
            <Title level={5}>{t("registrationApplications.fields.phoneNumber")}</Title>
            <Text>
              {"+"}
              {record?.adminUser?.phoneNumber?.countryCode}{" "}
              {formatPhoneNumber(record?.adminUser?.phoneNumber?.lineNumber ?? "")}
            </Text>
          </>
        </Show>
      )}
    </Drawer>
  );
}
