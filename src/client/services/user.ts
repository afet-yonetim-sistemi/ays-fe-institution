import { axiosInstance } from "..";
import { components, paths } from "../../types/OpenAPITypes";

export type IUser = components["schemas"]["UserResponse"];

export type GetUsersPath = paths["/api/v1/users"]["post"];
export type GetUsersResponse =
  GetUsersPath["responses"]["200"]["content"]["*/*"];
export type GetUsersRequest =
  GetUsersPath["requestBody"]["content"]["application/json"];

export type CreateUserPath = paths["/api/v1/user"]["post"];
export type CreateUserResponse =
  CreateUserPath["responses"]["200"]["content"]["*/*"];
export type CreateUserRequest =
  CreateUserPath["requestBody"]["content"]["application/json"];

export type UpdateUserPath = paths["/api/v1/user/{id}"]["put"];
export type UpdateUserResponse =
  UpdateUserPath["responses"]["200"]["content"]["*/*"];
export type UpdateUserRequest =
  UpdateUserPath["requestBody"]["content"]["application/json"];

const baseEndpoint = "user";

const getUsers = async (
  request: GetUsersRequest
): Promise<GetUsersResponse> => {
  const res = await axiosInstance.post(`${baseEndpoint}s`, request);

  return res.data;
};

const getUser = async (id: string) => {
  const res = await axiosInstance.get(`${baseEndpoint}/${id}`);

  return res.data;
};

const createUser = async (
  request: CreateUserRequest
): Promise<CreateUserResponse> => {
  const res = await axiosInstance.post(`${baseEndpoint}`, request);

  return res.data;
};

const updateUser = async (
  id: string,
  request: UpdateUserRequest
): Promise<UpdateUserResponse> => {
  console.log("updateUser", id, request);
  const res = await axiosInstance.put(`${baseEndpoint}/${id}`, request);

  return res.data;
};

const deleteUser = async (id: string) => {
  const res = await axiosInstance.delete(`${baseEndpoint}/${id}`);

  return res.data;
};

export { getUsers, getUser, createUser, updateUser, deleteUser };
