import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "../../../node_modules/@reduxjs/toolkit/dist/createAction";
import { loginState } from "../../types/storeTypes";
import { User } from "../../types/user";
import { setLocalStorage } from "../../utils/storage";

const initialState = {
  user: {},
};

export const LoginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setUser: (state:loginState, action:PayloadAction<User>) => {
      state.user = action.payload;
    },
    setToken: (state:loginState, action:PayloadAction<string>) => {
      setLocalStorage("token", action.payload);
    }
  },
});

// Action creators are generated for each case reducer function
export const { setUser, setToken } = LoginSlice.actions;

export default LoginSlice.reducer;
