import React, { useEffect, useState } from "react";
import { AccountNav } from "./index";
import axios from "axios";
import { differenceInCalendarDays, format, formatDate } from "date-fns";
import { Link } from "react-router-dom";

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    axios.get("/bookings").then((res) => {
      setBookings(res.data);
    });
  }, []);

  return (
    <>
      <AccountNav />
      <div>
        {Array.isArray(bookings) &&
          bookings.map((booking) => (
            <Link
              to={`/places/${booking.place._id}`}
              key={booking._id}
              className="mt-4 flex gap-4  bg-gray-300 rounded-2xl md:w-3/4 shrink-0"
            >
              <div className="w-36">
                {booking.place.photos && (
                  <img
                    className="object-cover rounded-l-2xl aspect-square"
                    src={
                      "http://localhost:3000/uploads/" + booking.place.photos[0]
                    }
                    alt=""
                  />
                )}
              </div>
              <div className="">
                <h2 className="font-semibold text-xl  ">
                  {booking.place.title}
                </h2>
                {format(new Date(booking.checkIn), "dd-MM-yyyy")} to{" "}
                {format(new Date(booking.checkOut), "dd-MM-yyyy")}
                <div className="text-lg">
                  {differenceInCalendarDays(
                    new Date(booking.checkOut),
                    new Date(booking.checkIn)
                  )}{" "}
                  nights | Total Price :{" "}
                  {differenceInCalendarDays(
                    new Date(booking.checkOut),
                    new Date(booking.checkIn)
                  ) * booking.place.price}
                </div>
              </div>
            </Link>
          ))}
      </div>
    </>
  );
};

export default BookingsPage;
