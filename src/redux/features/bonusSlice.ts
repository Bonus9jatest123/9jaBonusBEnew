import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Bonus {
  qualifyingOdds: number;
  bonus: number;
}

export type BonusInfo = Record<string, Bonus>;

type BonusState = { bonusInfo: BonusInfo };

const initialState: BonusState = {
  bonusInfo: {}
};

export const bonusSlice = createSlice({
  name: 'bonusSlice',
  initialState,
  reducers: {
    setBonus: (state, action: PayloadAction<BonusInfo>) => {
      state.bonusInfo = action.payload;
    }
  }
});

export const { setBonus } = bonusSlice.actions;

export default bonusSlice.reducer;
