import { getDateForFilters } from '@/lib/utils';
import { User } from '@/types/commonTypes';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Filters {
  day: { name: string; fullName: string; date: string };
  league: string;
  sortBy: string;
}

interface UsersState {
  users: User[];
  filters: Filters;
}

const date = new Date();

const initialFilters = getSavedFilters() || {
  day: {
    name: 'TODAY',
    fullName: date.toLocaleDateString('en-GB', { weekday: 'long' }),
    date: getDateForFilters(date.toDateString())
  },
  league: '*',
  sortBy: 'time'
};

const initialState: UsersState = {
  users: [],
  filters: initialFilters
};

export const usersSlice = createSlice({
  name: 'usersState',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    setFilters: (state, action: PayloadAction<Filters>) => {
      state.filters = action.payload;
      updateLocalStorage(state);
    }
  }
});

export const { setUsers, setFilters } = usersSlice.actions;

export default usersSlice.reducer;

function updateLocalStorage(state: UsersState) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('filters', JSON.stringify(state.filters));
  }
}

function getSavedFilters(): Filters | null {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('filters');
    return saved ? JSON.parse(saved) : null;
  }
  return null;
}
