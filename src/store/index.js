import { createSlice, configureStore } from '@reduxjs/toolkit';
import AuthService from "../services/auth-service";

const currentUser = AuthService.getCurrentUser();

const initialState = { isLoggedIn: (currentUser !== null ? true : false), userData: currentUser };

const authenticationInfoSlice = createSlice({
  name: 'authenticationInfo',
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.userData = action.payload;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.userData = null;
    }
  }
});

const store = configureStore({
  reducer: authenticationInfoSlice.reducer
});

export const counterActions = authenticationInfoSlice.actions;

export default store;