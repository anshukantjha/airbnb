const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  address: String,
  photos: [String],
  description: String,
  perks: [String],
  extraInfo: String,
  checkIn: Number,
  checkOut: Number,
  maxGuest: Number,
  price:Number,
},{timestamps:true});

const Place = mongoose.model("Place", userSchema);

module.exports = Place;
