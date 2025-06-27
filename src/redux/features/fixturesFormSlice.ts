import { FixtureForForm } from '@/types/commonTypes';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface FixturesFormState {
  odds: FixtureForForm[];
  editId: string;
}

const initialState: FixturesFormState = {
  odds: [],
  editId: ''
};

export const fixturesFormSlice = createSlice({
  name: 'fixturesFormState',
  initialState,
  reducers: {
    setOdds: (state, action: PayloadAction<FixtureForForm[]>) => {
      state.odds = action.payload;
    },
    setEditId: (state, action: PayloadAction<string>) => {
      state.editId = action.payload;
    }
  }
});

export const { setOdds, setEditId } = fixturesFormSlice.actions;

export default fixturesFormSlice.reducer;
