"use client"
import { configureStore,combineReducers } from "@reduxjs/toolkit";
import picksReducer from "./features/picksSlice";
import playerReducer from "./features/playerSlice";

const rootReducers = combineReducers({
    
        picks : picksReducer,
        player: playerReducer,
    
})

export const store = configureStore({
    reducer: rootReducers,
  
   });

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch