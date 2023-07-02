import { Pagination, UserResponse } from "../../client/services/user";
import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import * as UserService from "../../client/services/user";
type InitialState = UserResponse & {
  pagination: Pagination;
};

const initialState: InitialState = {
  content: [],
  pageNumber: 0,
  pageSize: 0,
  totalPageCount: 0,
  totalElementCount: 0,
  sortedBy: {},
  filteredBy: {},
  pagination: {
    page: 1,
    pageSize: 10,
  },
};

export const getUsers = createAsyncThunk(
  "users/getUser",
  async (_, { getState }) => {
    const { users } = getState() as { users: InitialState };

    const res = await UserService.getUsers({
      page: users.pagination.page,
      pageSize: users.pagination.pageSize,
    });
    return res.response;
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUsers.fulfilled, (state, action) => {
      state.content = action.payload.content;
      state.pageNumber = action.payload.pageNumber;
      state.pageSize = action.payload.pageSize;
      state.totalPageCount = action.payload.totalPageCount;
      state.totalElementCount = action.payload.totalElementCount;
      state.sortedBy = action.payload.sortedBy;
      state.filteredBy = action.payload.filteredBy;
    });
  },
});

export default userSlice.reducer;
