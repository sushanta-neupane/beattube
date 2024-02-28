import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface VideoType {
  vid: string;
  title: string;
  thumbnail: string;
}

export interface PicksType {
  userId: string;
  videos: VideoType[];
}

const initialState: PicksType = {
  userId: "",
  videos: [],
};

export const picksSlice = createSlice({
  name: "Picks",
  initialState,
  reducers: {
    addPicks: (state, action: PayloadAction<VideoType>) => {
      state.videos.push(action.payload);
    },
    removePicks: (state, action: PayloadAction<string>) => {
      state.videos = state.videos.filter((video) => video.vid !== action.payload);
    },
    togglePicks: (state, action: PayloadAction<VideoType>) => {
      const existingVideoIndex = state.videos.findIndex((video) => video.vid === action.payload.vid);
      if (existingVideoIndex !== -1) {
        state.videos.splice(existingVideoIndex, 1);
      } else {
        state.videos.push(action.payload);
      }
    },
    loadPicks : (state,action: PayloadAction<PicksType>)=>{
        return  action.payload;
    }
  },
});

export const { addPicks, removePicks, togglePicks ,loadPicks } = picksSlice.actions;
export default picksSlice.reducer;
