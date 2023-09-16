import { useIsAuthenticated } from "@refinedev/core";
import { useEffect } from "react";
import jwtDecode from "jwt-decode";
import { UserTypes } from "@/types";

type Props = {
  setUserType: (userType: UserTypes) => void;
};

type DecodedToken = {
  userType: UserTypes;
};

const getUserType = () => {
  const token = localStorage.getItem("token");
  if (token) {
    const decodedToken: DecodedToken = jwtDecode(token);
    return (decodedToken?.userType ?? "GUEST") as UserTypes;
  }
  return "GUEST";
};

export default function AuthChecker({ setUserType }: Props) {
  const { data } = useIsAuthenticated();

  useEffect(() => {
    if (data) {
      setUserType(getUserType());
    }
  }, [data, setUserType]);
  return null;
}
