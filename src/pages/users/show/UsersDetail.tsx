import React, { useEffect, useState } from "react";
import { Descriptions } from "antd";
import { GetUserResponse, getUser } from "../../../client/services/user";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { translate } from "../../../common/utils/translateUtils";

const UserDetailPage = () => {
  const [user, setUser] = useState<GetUserResponse["response"] | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fetchUser = async () => {
    if (!id) {
      return;
    }
    try {
      const user = await getUser(id);
      setUser(user.response);
    } catch (error: any) {
      const status = error.response.status;
      if (status === 404 || status === 400) {
        navigate("/404");
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  if (!user) {
    return null;
  }

  return (
    <div>
      <Descriptions
        title={translate("TABLE.COLUMN.USER_INFO")}
        layout="vertical"
        bordered
      >
        <Descriptions.Item label={translate("TABLE.COLUMN.USERNAME")}>
          {user.username}
        </Descriptions.Item>
        <Descriptions.Item label={translate("TABLE.COLUMN.NAME")}>
          {user.firstName}
        </Descriptions.Item>
        <Descriptions.Item label={translate("TABLE.COLUMN.SURNAME")}>
          {user.lastName}
        </Descriptions.Item>
        <Descriptions.Item label={translate("TABLE.COLUMN.ROLE")}>
          {user.role}
        </Descriptions.Item>
        <Descriptions.Item label={translate("TABLE.COLUMN.STATUS")}>
          {user.status}
        </Descriptions.Item>
        <Descriptions.Item label={translate("TABLE.COLUMN.PHONE_NUMBER")}>
          {`+${user.phoneNumber?.countryCode} ${user.phoneNumber?.lineNumber}`}
        </Descriptions.Item>
      </Descriptions>
      <Descriptions
        title={translate("TABLE.COLUMN.INSTITUTION_INFO")}
        layout="vertical"
        bordered
        style={{
          marginTop: 20,
        }}
      >
        <Descriptions.Item label={translate("TABLE.COLUMN.INSTITUTION_NAME")}>
          {user.institution?.name}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default UserDetailPage;
