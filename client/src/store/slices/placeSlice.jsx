import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  photos: [],
  perks: [],
  title: "",
  address: "",
  description: "",
  extraInfo: "",
  checkIn: "",
  checkOut: "",
  maxGuest: 1,
  price : 1000,
  phone:"",
  booked:false
};

const placeSlice = createSlice({
  name: "place",
  initialState,
  reducers: {
    setPhotos: (state, action) => {
      const newPhotos = action.payload;
      const uniquePhotos = [...new Set([...state.photos, ...newPhotos])];
      state.photos = uniquePhotos;
    },
    removePhoto: (state, action) => {
      state.photos = state.photos.filter((photo) => photo !== action.payload);
    },
    selectMain:(state,action)=>{
      state.photos = [action.payload,...state.photos.filter((photo)=>photo !== action.payload)]
    },
    setPerks: (state, action) => {
      state.perks = action.payload;
    },
    setTitle: (state, action) => {
      state.title = action.payload;
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setDescription: (state, action) => {
      state.description = action.payload;
    },
    setExtraInfo: (state, action) => {
      state.extraInfo = action.payload;
    },
    setCheckIn: (state, action) => {
      state.checkIn = action.payload;
    },
    setCheckOut: (state, action) => {
      state.checkOut = action.payload;
    },
    setMaxGuest: (state, action) => {
      state.maxGuest = action.payload;
    },
    setPrice:(state,action) =>{
      state.price = action.payload
    },
    setPhone:(state,action)=>{
      state.phone = action.payload
    },
    setBooked:(state,action)=>{
      state.booked = action.payload
    }
  },
});

export const {
  setTitle,
  setAddress,
  setDescription,
  setExtraInfo,
  setCheckIn,
  setCheckOut,
  setMaxGuest,
  setPhotos,
  setPerks,
  removePhoto,
  selectMain,
  setPrice,
  setPhone,
  setBooked
} = placeSlice.actions;

export default placeSlice.reducer;
