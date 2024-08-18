import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Input, Button, Perks, PhotoUploader } from "../components/index";
import { AccountNav } from "./index";
import { Link, Navigate, useParams } from "react-router-dom";

import {
  setTitle,
  setAddress,
  setDescription,
  setExtraInfo,
  setCheckIn,
  setCheckOut,
  setMaxGuest,
  setPhotos,
  setPerks,
  setPrice
} from "../store/slices/placeSlice";
import axios from "axios";

const PlaceFormPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  // console.log(id);
  const [redirect, setRedirect] = useState(false);
  const {
    title,
    address,
    description,
    extraInfo,
    checkIn,
    checkOut,
    maxGuest,
    photos,
    perks,
    price
  } = useSelector((state) => state.place);

  // function to handle form submit
  async function addOrUpdatePlace(e) {
    e.preventDefault();
    const placeData = {
      title,
      address,
      description,
      extraInfo,
      checkIn,
      checkOut,
      maxGuest,
      photos,
      perks,
      price
    };
    if (id) {
      // console.log(id)
      // update
      await axios.put("/places", { ...placeData, id });
      setRedirect(true)
    } else {
      await axios.post("/places", placeData);
      setRedirect(true);
    }

    // console.log(data);
  }

  function preInput(a, b) {
    return (
      <>
        <h2 className="text-xl mt-4 ">{a}</h2>
        <p className="text-sm text-gray-400">{b}</p>
      </>
    );
  }

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/places/" + id).then((res) => {
      const { data } = res;
      // console.log(data.photos);
      // console.log(data)
      // console.log(data.title)
      dispatch(setTitle(data.title));
      dispatch(setAddress(data.address));
      dispatch(setCheckIn(data.checkIn));
      dispatch(setDescription(data.description));
      dispatch(setExtraInfo(data.extraInfo));
      dispatch(setCheckOut(data.checkOut));
      dispatch(setMaxGuest(data.maxGuest));
      dispatch(setPhotos(data.photos));
      dispatch(setPerks(data.perks));
      dispatch(setPrice(data.price));
    });
  }, [id]);

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }
  return (
    <>
      <AccountNav />
      <div>
        <form onSubmit={addOrUpdatePlace}>
          {preInput("Title", "Title for your Place ,e.g : Laxmi Complex")}
          <Input
            placeholder="Enter Title here.."
            value={title}
            onChange={(e) => dispatch(setTitle(e.target.value))}
          />
          {preInput("Address", "Adress of your Place ,e.g : 800006,Nit-Patna")}
          <Input
            placeholder="Enter Address here.."
            value={address}
            onChange={(e) => dispatch(setAddress(e.target.value))}
          />
          {preInput("Photos", "")}
          <PhotoUploader />
          {preInput("Description", " Describe about your place...")}
          <textarea
            className="w-full px-3 py-2 rounded-lg bg-slate-100 border-none"
            placeholder="Description goes here..."
            value={description}
            onChange={(e) => dispatch(setDescription(e.target.value))}
          />
          {preInput("Perks", "select all the perks of your Place")}
          <Perks />

          {preInput("Extra Info", "House Rules,etc..")}
          <textarea
            placeholder="Extra Info goes here..."
            className="w-full px-3 py-2 rounded-lg bg-slate-100 border-none"
            value={extraInfo}
            onChange={(e) => dispatch(setExtraInfo(e.target.value))}
          />
          {preInput(
            "Check IN ,Check OUT & Max Guest",
            "Type in the times of check in,out and max Guest"
          )}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <h3 className="mt-2 mb-1">Check In</h3>
              <Input
                placeholder="11:00"
                value={checkIn}
                onChange={(e) => dispatch(setCheckIn(e.target.value))}
              />
            </div>
            <div>
              <h3 className="mt-2 mb-1">Check Out</h3>
              <Input
                placeholder="11:00"
                value={checkOut}
                onChange={(e) => dispatch(setCheckOut(e.target.value))}
              />
            </div>
            <div>
              <h3 className="mt-2 mb-1">Max Guest</h3>
              <Input
                type="number"
                placeholder="4"
                value={maxGuest}
                onChange={(e) => dispatch(setMaxGuest(e.target.value))}
              />
            </div>
            <div>
              <h3 className="mt-2 mb-1">Price</h3>
              <Input
                type="number"
                placeholder="4"
                value={price}
                onChange={(e) => dispatch(setPrice(e.target.value))}
              />
            </div>
          </div>
          <Button className="w-full mt-3 rounded-2xl">Save</Button>
        </form>
      </div>
    </>
  );
};

export default PlaceFormPage;
