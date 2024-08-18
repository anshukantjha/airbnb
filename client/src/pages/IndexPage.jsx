import React, { useEffect, useState } from "react";
import axios from "axios";
import {Link} from "react-router-dom"

function IndexPage() {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get("/all-places").then((response) => {
      setPlaces([...response.data]);
    });
  }, []);

  return (
    <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10 ">
      {Array.isArray(places) &&
        places.map((place) => (
          <Link to={`/places/${place._id}`} className="" key={place._id}>
            <div className="bg-gray-200 rounded-2xl ">
              <img
                className="rounded-2xl aspect-square object-cover w-full"
                src={"http://localhost:3000/uploads/" + place.photos?.[0]}
                alt="Image:)"
              />
            </div>
            <h2 className="font-bold">{place.title}</h2>
            <h3 className="text-sm ">{place.address}</h3>
            <p>
              <span className="font-bold">{place.price}$</span> per night
            </p>
          </Link>
        ))}
    </div>
  );
}

export default IndexPage;
