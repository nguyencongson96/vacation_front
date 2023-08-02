import albumAPI from "~/api/albumAPI";
import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";

export const getList = createAsyncThunk("album/getList", async (arg, thunkAPI) => {
  try {
    const res = await albumAPI.getList({ userId: arg?.userId, page: arg?.page || 1 });
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

export const getDetail = createAsyncThunk("album/getDetail", async (arg, thunkAPI) => {
  try {
    const res = await albumAPI.getDetail(arg?.id);
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

export const createAlbum = createAsyncThunk("album/createAlbum", async (arg, thunkAPI) => {
  try {
    const { vacationId, title, userId } = arg;
    const res = await albumAPI.createAlbum({ vacationId, title, userId });
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

export const updateAlbumPage = createAsyncThunk("album/updateAlbumPage", async (arg, thunkAPI) => {
  try {
    const res = await albumAPI.updateAlbumPage({
      id: arg?.albumId,
      data: { resource: arg?.resource },
    });
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

export const deleteAlbum = createAsyncThunk("album/delete", async (arg, thunkAPI) => {
  try {
    const { id } = arg;
    const res = await albumAPI.delete(id);
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

const albumSlice = createSlice({
  name: "album",
  initialState: {
    list: [],
    selectedAlbum: {},
    selectedImages: [],
    selectedPageId: "",
    meta: { page: 1, pages: 1, total: 1 },
    isLoading: false,
    isError: false,
    msg: "",
  },
  reducers: {
    resetList: (state, action) => {
      state.list = [];
      state.meta = { page: 1, pages: 1, total: 1 };
    },
    resetSelectedImages: (state) => {
      state.selectedImages = [];
    },
    resetSelectedAlbum: (state) => {
      state.selectedAlbum = {};
    },

    addSelected: (state, action) => {
      const { _id, path } = action.payload;
      const currentSelectedList = current(state).selectedImages;
      state.selectedImages = currentSelectedList.concat({
        style: { width: 100, height: 100, top: 0, left: 0 },
        resourceId: _id,
        path: path,
      });
    },
    updateSelected: (state, action) => {
      const currentSelectedList = current(state).selectedImages;
      const index = currentSelectedList.findIndex((item) => item.resourceId === action.payload.resourceId);
      state.selectedImages = currentSelectedList.toSpliced(index, 1, action.payload);
    },
    removeSelected: (state, action) => {
      const currentSelectedList = current(state).selectedImages;
      state.selectedImages = currentSelectedList.filter((image) => image.resourceId !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getList.fulfilled, (state, action) => {
        if (action.payload) {
          const { data, meta } = action.payload;
          state.isLoading = false;
          if (data?.length > 0) {
            state.list = meta.page === 1 ? data : state.list.concat(data);
          }
          state.meta = meta;
        }
      })
      .addCase(getList.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.msg = action.payload?.message;
      })
      .addCase(getDetail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDetail.fulfilled, (state, action) => {
        const { authorInfo, createdAt, lastUpdateAt, vacationId, images, title, _id, userId } =
          action.payload.data;
        state.selectedImages = images;
        state.selectedAlbum = { authorInfo, createdAt, lastUpdateAt, vacationId, title, _id, userId };
      })
      .addCase(getDetail.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.msg = action.payload?.message;
      })

      .addCase(createAlbum.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createAlbum.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedAlbum = action.payload?.data;
      })
      .addCase(createAlbum.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.msg = action.payload?.message;
      })

      .addCase(updateAlbumPage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAlbumPage.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(updateAlbumPage.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.msg = action.payload?.message;
      })
      .addCase(deleteAlbum.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(deleteAlbum.fulfilled, (state, action) => {
        const currentList = current(state).list;
        state.list = currentList.filter((item) => item._id !== action.meta.arg.id);
        state.isLoading = false;
      })
      .addCase(deleteAlbum.rejected, (state, action) => {
        state.isError = true;
        state.isLoading = false;
        state.msg = action.payload?.message;
      });
  },
});
const { reducer, actions } = albumSlice;
export const {
  resetList,
  addSelected,
  removeSelected,
  updateSelected,
  resetSelectedImages,
  resetSelectedAlbum,
} = actions;
export default reducer;
