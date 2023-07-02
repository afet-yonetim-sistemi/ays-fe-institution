import { axiosInstance } from "..";

export type Pagination = {
  page: number;
  pageSize: number;
};

export interface UserResponse {
  content: User[];
  pageNumber: number;
  pageSize: number;
  totalPageCount: number;
  totalElementCount: number;
  sortedBy: any;
  filteredBy: any;
}

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  role: "VOLUNTEER" | "ADMIN" | "SUPER_ADMIN";
  status: "ACTIVE" | "PASSIVE" | "DELETED";
  institution: Institution;
}

export interface Institution {
  createdUser: string;
  createdAt: string;
  updatedUser: any;
  updatedAt: any;
  id: string;
  name: string;
}

const baseEndpoint = "user";

const getUsers = async (params: Pagination) => {
  const res = await axiosInstance.post(`${baseEndpoint}s`, {
    pagination: params,
  });

  return res.data;
};

const getUser = async (id: string) => {
  const res = await axiosInstance.get(`${baseEndpoint}/${id}`);

  return res.data;
};

export { getUsers, getUser };
