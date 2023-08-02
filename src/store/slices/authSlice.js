import authAPI from "~/api/authAPI";
import { LoginData } from "~/modules/auth/config/data";
import { LOGIN } from "~/utils/constants";
import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";

export const handleAuth = createAsyncThunk("auth/handleAuth", async (arg, thunkAPI) => {
  try {
    let res = await authAPI[arg.type](arg.data);
    return {
      status: res.status,
      result: res.data,
      type: arg.type,
      message: res.data.message,
    };
  } catch (error) {
    if (!error.response) {
      return thunkAPI.rejectWithValue({ message: error.message });
    }

    console.log(error.response);
    return thunkAPI.rejectWithValue({
      status: error.response.status,
      errors: error.response.errors,
      message: error.response.data.message,
    });
  }
});

export const updateInfo = createAsyncThunk("auth/updateInfo", async (arg, thunkAPI) => {
  try {
    let res = await authAPI.updateUser(arg);
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

export const getInfoUser = createAsyncThunk("auth/getInfoUser", async (arg, thunkAPI) => {
  try {
    const res = await authAPI.getInfoUser(arg);
    return res.data.data;
  } catch (error) {
    console.log(error);
    if (!error.response) {
      return thunkAPI.rejectWithValue({ message: error.message });
    } else {
      return thunkAPI.rejectWithValue({
        status: error.response.status,
        message: error.response.data.message,
      });
    }
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    info: [],
    otherUserInfo: {},
    renderList: [{ list: LoginData }],
    isLogin: !!localStorage.getItem("token"),
    isLoading: false,
    isSuccess: false,
    isError: false,
    msg: "",
  },
  reducers: {
    logOut: (state, action) => {
      localStorage.removeItem("token");
      state.isLogin = false;
    },
    changeRenderList: (state, action) => {
      if (action.payload.type === "ADD") {
        state.renderList.push(action.payload.data);
      } else if (action.payload.type === "BACK") {
        const newList = state.renderList.slice(0, state.renderList.length - 1);
        return {
          ...state,
          renderList: newList,
        };
      }
    },

    resetOtherUser: (state, action) => {
      state.otherUserInfo = {};
    },
    resetNoti: (state) => {
      state.isSuccess = false;
      state.isError = false;
      state.msg = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(handleAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(handleAuth.fulfilled, (state, action) => {
        const { type } = action.meta.arg;
        state.isLoading = false;
        if (type !== LOGIN) {
          state.msg = action.payload?.message;
          state.isSuccess = true;
          state.isError = false;
        }
        if (action.payload && action.payload.type === LOGIN) {
          state.isLogin = true;
          state.isError = false;
          localStorage.setItem("token", `Bearer ${action.payload.result.data.accessToken}`);
          localStorage.setItem("rfToken", `Bearer ${action.payload.result.data.refreshToken}`);
        }
      })
      .addCase(handleAuth.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.msg = action.payload?.message;
      })
      .addCase(getInfoUser.fulfilled, (state, action) => {
        if (action.meta.arg) state.otherUserInfo = action.payload;
        else state.info = action.payload;
      })
      .addCase(updateInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        const currentInfo = current(state).info;
        state.info = Object.assign({}, currentInfo, action.payload.data?.userInfo);
      })
      .addCase(updateInfo.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.msg = action.payload?.message;
      });
  },
});

const { reducer, actions } = authSlice;
export const { changeRenderList, resetOtherUser, resetNoti, logOut } = actions;
export default reducer;
