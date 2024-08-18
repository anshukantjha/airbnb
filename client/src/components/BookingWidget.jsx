import React, { useContext ,useState } from "react";
import { Button, Input } from "./index";
import { useSelector, useDispatch } from "react-redux";
import {
  setCheckIn,
  setCheckOut,
  setMaxGuest,
  setPhone,
} from "../store/slices/placeSlice";
import { UserContext } from "../user.context";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";



const BookingWidget = ({ place }) => {
  const { user } = useContext(UserContext);
  const dispatch = useDispatch();
  const { checkIn, checkOut, maxGuest, phone } = useSelector(
    (state) => state.place
  );
  const [redirect, setRedirect] = useState("");
  let noOfNight = 0;
  if (checkIn && checkOut) {
    noOfNight = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  }
  // console.log(user)
  // console.log(place)

  async function handleBooking(e) {
    e.preventDefault();
    const data = {
      place: place._id,
      checkIn,
      checkOut,
      noOfGuest: maxGuest,
      phone,
      userId: user._id,
    };
    const res= await axios.post("/bookings", data);
    setRedirect(`/account/bookings`);
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }
  

  return (
    <div className="bg-white p-4 shadow rounded-2xl grid gap-1  mt-4">
      <div className="text-2xl text-center">Price: ${place.price}</div>
      <div className="flex gap-2 items-center">
        <label className="p-2">CheckIn</label>
        <Input
          type="date"
          value={checkIn}
          onChange={(e) => dispatch(setCheckIn(e.target.value))}
        />
      </div>
      <div className="flex gap-2 items-center">
        <label className="p-1">CheckOut</label>
        <Input
          type="date"
          value={checkOut}
          onChange={(e) => dispatch(setCheckOut(e.target.value))}
        />
      </div>
      <div className="flex gap-2 items-center">
        <label className="px-2">No. of Guest</label>
        <Input
          type="number"
          value={maxGuest}
          onChange={(e) => dispatch(setMaxGuest(e.target.value))}
        />
      </div>
      {noOfNight > 0 && (
        <>
          <div className="flex gap-2 items-center">
            <label className="px-4">Phone</label>
            <Input
              type="tel"
              placeholder="+919905795383"
              value={phone}
              onChange={(e) => dispatch(setPhone(e.target.value))}
            />
          </div>
          <div className="flex gap-2 items-center">
            <label className="px-4">Email</label>
            <Input
              type="email"
              placeholder="anshu@gmail.com"
              value={user?.email}
              readOnly
            />
          </div>
        </>
      )}
      {user && noOfNight <= 0 && <Button disabled>Book Now</Button>}
      {!user && (
        <Button disabled className="cursor-not-allowed">
          Login to Book
        </Button>
      )}
      {user && noOfNight > 0 && (
        <Button onClick={handleBooking}>
          Book Now ${noOfNight * place.price}
        </Button>
      )}

    </div>
  );
};

export default BookingWidget;
