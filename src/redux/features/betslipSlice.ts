import { Odds, OddsProduct, OneX } from '@/types/commonTypes';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface SelectedOdds {
  value: string | number;
  type: string;
  bookie: string;
}
export interface BetslipItem {
  _id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  selectedOdds: SelectedOdds | null;
  odds: Odds;
}

interface BetSlipState {
  items: BetslipItem[];
  totalOdds: number;
  selectedBookie: string;
  totalOddsPerBookie: OddsProduct;
}
const emptyState = {
  items: [],
  totalOdds: 0,
  selectedBookie: '',
  totalOddsPerBookie: {}
};

const initialState: BetSlipState = getInitialState() || emptyState;

export const betslipSlice = createSlice({
  name: 'betSlip',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<BetslipItem>) => {
      updateItems(state, action.payload, 'add');
    },
    removeItem: (state, action: PayloadAction<BetslipItem>) => {
      updateItems(state, action.payload, 'remove');
    },
    clearBetslip: (state) => {
      state.items = [];
      updateLocalStorage(state);
    },
    setSelectedBookie: (state, action: PayloadAction<string>) => {
      state.selectedBookie = action.payload;
    },
    setTotalOdds: (state, action: PayloadAction<number>) => {
      state.totalOdds = action.payload;
    }
  }
});

export const { addItem, removeItem, clearBetslip, setSelectedBookie, setTotalOdds } = betslipSlice.actions;

export default betslipSlice.reducer;

// utils
function updateItems(state: BetSlipState, payload: BetslipItem, actionType: string) {
  const index = state.items.findIndex((i) => i._id === payload._id);

  if (actionType === 'add') {
    index === -1 ? state.items.push(payload) : (state.items[index] = payload);
  } else if (actionType === 'remove' && index !== -1) state.items.splice(index, 1);

  if (state.items.length > 0) state.totalOddsPerBookie = calculateTotalOddsPerBookie(state.items);
  else {
    const totalOddsCopy = { ...state.totalOddsPerBookie };
    Object.keys(state.totalOddsPerBookie).forEach((key) => (totalOddsCopy[key] = 0));
    state.totalOddsPerBookie = totalOddsCopy;
  }

  updateLocalStorage(state);
}

function updateLocalStorage(state: BetSlipState) {
  if (typeof window !== 'undefined') {
    const timestamp = new Date().toLocaleDateString();
    localStorage.setItem('betslip', JSON.stringify(state));
    localStorage.setItem('betslipTimestamp', JSON.stringify(timestamp));
  }
}

function getInitialState() {
  if (typeof window !== 'undefined') return JSON.parse(localStorage.getItem('betslip') as string);
}

function calculateTotalOddsPerBookie(items: BetslipItem[]) {
  let oddsProduct: OddsProduct = getInitialOddsProduct(items[0]?.odds);

  items.forEach((item) => {
    const selectedType = item.selectedOdds!.type;

    for (const bookie in item.odds) {
      if (item.odds.hasOwnProperty(bookie)) {
        const odds = item.odds[bookie].suspended ? 0 : item.odds[bookie].oneX[selectedType as keyof OneX];
        oddsProduct[bookie] *= odds;
      }
    }
  });

  return oddsProduct;
}

function getInitialOddsProduct(odds: Odds) {
  return Object.keys(odds).reduce((accumulator: any, key) => {
    accumulator[key] = 1;
    return accumulator;
  }, {});
}
