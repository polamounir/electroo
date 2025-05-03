import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getUserDataFn,
  loginUserFn,
  loginWithGoogle,
  registerNewUser,
} from "../../api/user";
import Cookies from "js-cookie";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};
const TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const EMAIL_KEY = "email";
const USER_ID_KEY = "userId";
const USER_NAME_KEY = "userName";
const FULL_NAME_KEY = "fullName";

// Helper functions for token management
const saveAuthData = (token, email, refreshToken) => {
  Cookies.set(TOKEN_KEY, token);
  Cookies.set(EMAIL_KEY, email);
  Cookies.set(REFRESH_TOKEN_KEY, refreshToken);
};
const saveUserData = (userId, userName) => {
  localStorage.setItem("userId", userId);
  localStorage.setItem("email", userName);
};

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData) => {
    try {
      const response = await registerNewUser(userData);
      const { userId, userName } = response.data;
      saveUserData(userId, userName);
      return response;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { dispatch }) => {
    // console.log(userData);
    try {
      const response = await loginUserFn(userData);
      // console.log(response);
      const { accessToken, email, refreshToken } = response.data;

      saveAuthData(accessToken, email, refreshToken);
      // console.log(response.status);
      dispatch(getUserData());
      return response.status;
    } catch (error) {
      return error.response.data;
    }
  }
);
export const loginUserWithGoogle = createAsyncThunk(
  "auth/loginUserWithGoogle",
  async (credential, { dispatch }) => {
    // console.log(userData);
    try {
      const response = await loginWithGoogle(credential);
      // console.log(response);
      const { accessToken, email, refreshToken } = response.data;

      saveAuthData(accessToken, email, refreshToken);
      // console.log(response.status);
      dispatch(getUserData());
      window.location.href = "/";
      return response.status;
    } catch (error) {
      return error.response.data;
    }
  }
);
export const loginSupplier = createAsyncThunk(
  "auth/loginSupplier",
  async (userData, { dispatch }) => {
    // console.log(userData);
    try {
      const response = await loginUserFn(userData);
      // console.log(response);
      const { accessToken, email, refreshToken } = response.data;

      saveAuthData(accessToken, email, refreshToken);
      // console.log(response.status);
      dispatch(getUserData());
      return response.status;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const getUserData = createAsyncThunk(
  "auth/getUserData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserDataFn();

      console.log(response);


      return response.data;
    } catch (error) {
      // console.log(error);
      rejectWithValue(error.response.data);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      Cookies.remove(TOKEN_KEY);
      Cookies.remove(REFRESH_TOKEN_KEY);
      Cookies.remove(EMAIL_KEY);
      localStorage.removeItem("cartId");
      localStorage.removeItem("userId");
      localStorage.removeItem("email");
      window.location.href = "/";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(loginSupplier.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginSupplier.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(loginSupplier.rejected, (state) => {
        state.loading = false;
      })

      .addCase(getUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserData.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
        state.user = action.payload;
        console.log(state.user);
        state.isAuthenticated = true;
      })
      .addCase(getUserData.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(loginUserWithGoogle.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUserWithGoogle.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(loginUserWithGoogle.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { logOut } = authSlice.actions;
export default authSlice.reducer;
