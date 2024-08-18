import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BookingWidget } from "../components/index";
import axios from "axios";
import { useSelector} from "react-redux";

const OnePlacePage = () => {
  const { booked } = useSelector((state) => state.place);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [place, setPlace] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/places/${id}`).then((res) => setPlace(res.data));
  }, [id]);

  // console.log(place);
  if (!place) {
    return <div className="text-red-300">Loading</div>;
  }

  if (showAllPhotos) {
    return (
      <div className="  bg-black absolute inset-0 min-w-full min-h-screen">
        <h2 className="text-3xl text-white top-6  ml-4">{place.title}</h2>
        <button
          onClick={() => setShowAllPhotos(false)}
          className="flex gap-1 right-8 bg-gray-200 p-2 rounded-2xl fixed"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
          Close Photos
        </button>
        <div className=" bg-black p-8 mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto">
          {place.photos.length > 0 &&
            place.photos.map((photo) => (
              <div className="flex justify-center" key={photo}>
                <img
                  className="aspect-square object-cover"
                  src={"http://localhost:3000/uploads/" + photo}
                  alt=""
                />
              </div>
            ))}
        </div>
      </div>
    );
  }

  console.log(booked)
  return (
    <>
      <div className="my-4 pb-5 bg-gray-100  ">
        <h2 className="text-2xl">{place.title}</h2>
        <div className="underline font-semibold  ">
          <a
            className="flex gap-1"
            target="_blank"
            href={"https://maps.google.com/?q=" + place.address}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              />
            </svg>

            {place.address}
          </a>
        </div>
        {/* {
          booked && 
          <div className="bg-gray-300 p-4 flex rounded-2xl justify-center items-center">
            Already Booked 
          </div>
        } */}
        <div className="relative">
          <div className="grid gap-2 grid-cols-[2fr_1fr] mt-2 px-16 shadow-2xl ">
            <div className=" h-96">
              {place.photos?.[0] && (
                <img
                  className="w-full h-full object-cover rounded-2xl"
                  src={"http://localhost:3000/uploads/" + place.photos?.[0]}
                  alt=""
                />
              )}
            </div>
            <div className=" flex flex-col gap-2 h-96">
              {place.photos?.[1] && (
                <img
                  className="w-full h-1/2  object-cover rounded-2xl "
                  src={"http://localhost:3000/uploads/" + place.photos?.[1]}
                  alt=""
                />
              )}
              {place.photos?.[2] && (
                <img
                  className="w-full h-1/2 object-cover  rounded-2xl overflow-hidden"
                  src={"http://localhost:3000/uploads/" + place.photos?.[2]}
                  alt=""
                />
              )}
            </div>
          </div>
          <button
            onClick={() => setShowAllPhotos(true)}
            className="absolute bottom-2 right-24 bg-white border-black py-1 px-2 rounded-2xl flex gap-1 shadow-2xl"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
            Show more Photos
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] my-8 mx-4">
          <div>
            <h2 className="font-semibold text-2xl">Description</h2>
            <p className="">{place.description}</p>
            <div className="mt-2 ">
              <h3 className="text-lg">Check-In : {place.checkIn}</h3>
              <h3 className="text-lg">Check-Out : {place.checkOut}</h3>
              <h3 className="text-lg">MaxGuest : {place.maxGuest}</h3>
            </div>
          </div>
          <BookingWidget place={place} />
        </div>
      </div>
      <div className="mx-4">
        <h2 className="font-semibold text-2xl">Extra Info</h2>
        <p>{place.extraInfo}</p>
      </div>
    </>
  );
};

export default OnePlacePage;
