import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUserFn, registerNewUser } from "../../api/user";
import Cookies from "js-cookie";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};
const TOKEN_KEY = "accessToken";
const EMAIL_KEY = "email";
const USER_ID_KEY = "userId";
const USER_NAME_KEY = "userName";
const FULL_NAME_KEY = "fullName";

// Helper functions for token management
const saveAuthData = (token, email) => {
  Cookies.set(TOKEN_KEY, token);
  Cookies.set(EMAIL_KEY, email);
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
  async (userData) => {
    console.log(userData);
    try {
      const response = await loginUserFn(userData);
      console.log(response);
      const { accessToken, email } = response.data;
      
      saveAuthData(accessToken, email);

      console.log(response.status);
      return response.status
    } catch (error) {
      return error.response.data;
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
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
      });
  },
});

export default authSlice.reducer;
