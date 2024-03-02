
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PlayerState {
  isOpen: boolean;
}

const initialState: PlayerState = {
  isOpen: false,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    togglePlayer(state) {
      state.isOpen = !state.isOpen;
    },
    closePlayer(state) {
        console.log("close")
      state.isOpen = false;
    },
  },
});

export const { togglePlayer, closePlayer } = playerSlice.actions;

export default playerSlice.reducer;
