import { bookie } from '@/types/commonTypes';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface BookiesState {
  bookies: bookie;
}

const initialState: BookiesState = {
  bookies: {}
};

export const bookiesSlice = createSlice({
  name: 'bookiesSlice',
  initialState,
  reducers: {
    setBookies: (state, action: PayloadAction<bookie>) => {
      state.bookies = action.payload;
    }
  }
});

export const { setBookies } = bookiesSlice.actions;

export default bookiesSlice.reducer;
