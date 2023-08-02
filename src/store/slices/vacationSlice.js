import statusAPI from "~/api/statusList";
import vacationAPI from "~/api/vacationAPI";
import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";

export const getListVacation = createAsyncThunk("vacation/getListVacation", async (arg, thunkAPI) => {
  try {
    const res = await vacationAPI.getListVacation(arg);
    return { result: res.data, currentPage: arg.page };
  } catch (error) {
    if (!error.response) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
    return thunkAPI.rejectWithValue({
      message: error.response.data.message,
    });
  }
});

export const getDetailVacation = createAsyncThunk("vacation/getDetailVacation", async (arg, thunkAPI) => {
  try {
    const res = await vacationAPI.getDetailVacation(arg);
    return res.data.data;
  } catch (error) {
    if (!error.response) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
    return thunkAPI.rejectWithValue({
      message: error.response.data.message,
    });
  }
});

export const deleteVacation = createAsyncThunk("vacation/deleteVacation", async (arg, thunkAPI) => {
  try {
    const res = await vacationAPI.deleteVacation(arg);
    return res.data.data;
  } catch (error) {
    if (!error.response) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
    return thunkAPI.rejectWithValue({
      message: error.response.data.message,
    });
  }
});

export const getManyPosts = createAsyncThunk("vacation/getManyPosts", async (arg, thunkAPI) => {
  try {
    const res = await vacationAPI.getManyPosts(arg);
    return res.data;
  } catch (error) {
    if (!error.response) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
    return thunkAPI.rejectWithValue({
      message: error.response.data.message,
    });
  }
});

export const getStatusList = createAsyncThunk("vacation/getStatusList", async (arg, thunkAPI) => {
  try {
    const res = await statusAPI.statusList(arg);
    return res.data;
  } catch (error) {
    if (!error.response) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }
    return thunkAPI.rejectWithValue({
      message: error.response.data.message,
    });
  }
});
const vacationSlice = createSlice({
  name: "vacation",
  initialState: {
    listVacation: {
      list: [],
      page: 0,
      pages: 0,
    },
    listVacationProf: {
      list: [],
      page: 0,
      pages: 0,
    },
    detail: {},
    posts: {
      list: [],
      page: 0,
      pages: 0,
      timeline: [],
      totalPost: 0,
      isUpdatePost: false,
    },
    memberList: [],
    shareList: [],
    isLoading: false,
  },
  reducers: {
    resetList: (state, action) => {
      state.listVacation.list = [];
      state.listVacation.meta = {};
      state.listVacationProf.list = [];
      state.listVacationProf.meta = {};
    },
    isPostListChanged: (state, action) => {
      state.posts.isUpdatePost = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDetailVacation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDetailVacation.fulfilled, (state, action) => {
        state.detail = action.payload;
        state.isLoading = false;
      })
      .addCase(deleteVacation.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(deleteVacation.fulfilled, (state, action) => {
        state.isLoading = false;
        const currentList = current(state).listVacationProf.list;
        state.listVacationProf.list = currentList.filter((item) => item._id !== action.payload._id);
      })
      .addCase(getManyPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getManyPosts.fulfilled, (state, action) => {
        const { data, meta } = action.payload;
        if (data && Array.isArray(data)) {
          const { page } = action.meta.arg;
          state.posts.list = page === 1 ? data : state.posts.list.concat(data);
          if (meta) {
            state.posts.page = meta?.page;
            state.posts.pages = meta?.pages;
            state.posts.timeline = meta?.timeline;
            state.posts.totalPost = meta?.total;
          }
        } else {
          state.posts.list = [];
          state.posts.page = 0;
          state.posts.pages = 0;
          state.posts.timeline = [];
          state.posts.totalPost = 0;
        }
        state.isLoading = false;
      })
      .addCase(getListVacation.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getListVacation.fulfilled, (state, action) => {
        const { data, meta } = action.payload.result;

        if (data && Array.isArray(data)) {
          const { page, type } = action.meta.arg;
          switch (type) {
            case "newFeed":
              state.listVacation.list = page === 1 ? data : state.listVacation.list.concat(data);
              state.listVacation.page = meta?.page;
              state.listVacation.pages = meta?.pages;
              break;
            case "userProfile":
              state.listVacationProf.list = page === 1 ? data : state.listVacationProf.list.concat(data);
              state.listVacationProf.page = meta?.page;
              state.listVacationProf.pages = meta?.pages;
              break;
            default:
              break;
          }
        }

        state.isLoading = false;
      })
      .addCase(getListVacation.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(getStatusList.fulfilled, (state, action) => {
        const { listType } = action.meta.arg;
        const { data } = action.payload;
        if (data) {
          state[listType] = data;
        } else {
          state[listType] = [];
        }
      });
  },
});
const { reducer, actions } = vacationSlice;
export const { resetList, isPostListChanged } = actions;
export default reducer;
