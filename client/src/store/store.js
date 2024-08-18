import { configureStore } from '@reduxjs/toolkit';
import placeReducer from './slices/placeSlice';

const store = configureStore({
  reducer: {
    place: placeReducer,
  },
});

export default store;

