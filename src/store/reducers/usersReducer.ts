import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as UserService from "../../client/services/user";

export type InitialState = UserService.GetUsersResponse["response"] &
  UserService.GetUsersRequest & {
    drawer: {
      visible: boolean;
      record: UserService.IUser | null;
    };
    search: string;
  };

const initialState: InitialState = {
  content: [],
  pageNumber: 0,
  pageSize: 0,
  totalPageCount: 0,
  totalElementCount: 0,
  sortedBy: [],
  filteredBy: {},
  pagination: {
    page: 1,
    pageSize: 10,
  },
  sort: [],
  drawer: {
    visible: false,
    record: null,
  },
  search: "",
};

export const getUsers = createAsyncThunk(
  "users/getUser",
  async (_, { getState }) => {
    const { users } = getState() as { users: InitialState };

    const res = await UserService.getUsers({
      pagination: {
        page: users.pagination.page,
        pageSize: users.pagination.pageSize,
      },
    });
    return res.response;
  }
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async (data: UserService.CreateUserRequest, { dispatch }) => {
    const res = await UserService.createUser(data);
    dispatch(getUsers());
    return res.response;
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (data: UserService.UpdateUserRequest, { dispatch, getState }) => {
    const { users } = getState() as { users: InitialState };

    const record = users.drawer.record;
    if (!record || !record.id) {
      return;
    }
    const res = await UserService.updateUser(record?.id, data);
    dispatch(getUsers());
    return res.response;
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id: string, { dispatch }) => {
    const res = await UserService.deleteUser(id);
    dispatch(getUsers());
    return res.response;
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setDrawer: (state, action) => {
      state.drawer = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.fulfilled, (state, action) => {
        state.content = action.payload?.content;
        state.pageNumber = action.payload?.pageNumber;
        state.pageSize = action.payload?.pageSize;
        state.totalPageCount = action.payload?.totalPageCount;
        state.totalElementCount = action.payload?.totalElementCount;
        state.sortedBy = action.payload?.sortedBy;
        state.filteredBy = action.payload?.filteredBy;
      })
      .addCase(createUser.fulfilled, (state, action) => {});
  },
});

export default userSlice.reducer;

export const { setDrawer, setSearch } = userSlice.actions;
