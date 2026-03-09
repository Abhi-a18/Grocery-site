import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const storedAuth = localStorage.getItem("auth")
  ? JSON.parse(localStorage.getItem("auth"))
  : null;


export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "https://dummyjson.com/auth/login",
        {
          username: userData.username,
          password: userData.password,
          expiresInMins: 30,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Login failed" }
      );
    }
  }
);

const initialState = {
  user: storedAuth?.user || null,
  token: storedAuth?.token || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;

      localStorage.removeItem("auth");
    },
  },

  extraReducers: (builder) => {
    builder

      
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

   
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        state.user = {
          id: action.payload.id,
          username: action.payload.username,
          email: action.payload.email,
        };

        state.token = action.payload.accessToken;

        
        localStorage.setItem(
          "auth",
          JSON.stringify({
            user: state.user,
            token: state.token,
          })
        );
      })

    
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;