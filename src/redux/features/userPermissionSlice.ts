import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types/commonTypes'; // Your IUser type
import { setUserCookie, removeUserCookie } from '@/lib/cookies'; // Your helper functions

interface UserState {
  currentUser: User | null;
}

const initialState: UserState = {
  currentUser: null // 🚫 Don't read cookie here to avoid hydration mismatch
};

export const userSlice = createSlice({
  name: 'userState',
  initialState,
  reducers: {
    setLoginUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;

      // ✅ Save to cookie (on client only)
      if (typeof window !== 'undefined') {
        setUserCookie('user', JSON.stringify(action.payload));
      }
    },
    logoutUser: (state) => {
      state.currentUser = null;

      // ✅ Remove cookie (on client only)
      if (typeof window !== 'undefined') {
        removeUserCookie('user');
        removeUserCookie('token'); // if stored separately
      }
    },
  },
});

export const { setLoginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
