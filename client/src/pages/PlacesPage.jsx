import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "../components/index";
import { AccountNav } from "./index";
import axios from "axios";

function PlacesPage() {
  const { photos } = useSelector((state) => state.place);
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get("/user-places").then(({ data }) => {
      setPlaces(data);
    });
  }, []);
  return (
    <div>
      <AccountNav />

      <div className="flex justify-center mt-6">
        <Link to={"/account/places/new"}>
          <Button className="inline-flex gap-1">
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
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add new Place
          </Button>
        </Link>
      </div>
      {/* {console.log(places)} */}
      <div className="mt-4 flex flex-col gap-2 ">
        {Array.isArray(places) &&
          places.map((place) => (
            <Link
              to={"/account/places/" + place._id}
              className="bg-gray-200 p-2 rounded-xl flex gap-4 cursor-pointer"
              key={place._id}
            >
              <div className="w-1/5 h-36 shrink-0">
                {Array.isArray(place.photos) && (
                  <img
                    className="rounded-2xl w-full h-full object-cover"
                    src={"http://localhost:3000/uploads/" + place.photos[0]}
                    alt=""
                  />
                )}
              </div>
              <div className="flex flex-col justify-center flex-grow pl-4">
                <h2 className="text-xl text-center">{place.title}</h2>
                <p className="text-sm mt-2">{place.description}</p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
}

export default PlacesPage;
