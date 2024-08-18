import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "./index";
import axios from "axios";
import { setPhotos, removePhoto,selectMain } from "../store/slices/placeSlice";

function PhotoUploader() {
  const dispatch = useDispatch();
  const { photos } = useSelector((state) => state.place);
  // const [photos, setPhotos] = useState([]);
  const [photoLink, setPhotoLink] = useState("");
  // console.log("Lavna"+photos);

  // console.log(data);
  async function addPhotoByLink(e) {
    e.preventDefault();
    // console.log(photoLink)
    // console.log(photos);
    try {
      const { data: filename } = await axios.post("/upload-by-link", {
        link: photoLink,
      });
      // console.log(filename)
      setPhotoLink(filename);
      dispatch(setPhotos([...photos,filename]));
      setPhotoLink("");
    } catch (error) {
      console.log(error);
    }
  }

  async function uploadPhoto(e) {
    e.preventDefault();
    // console.log(photoLink)
    // console.log(photos);
    const files = e.target.files;
    // console.log(files);
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append("photo", files[i]);
    }
    await axios
      .post("/uploads", data, {
        headers: { "Content-Type": "multipart/form=data" },
      })
      .then((res) => {
        const { data: filenames } = res;
        dispatch(setPhotos(filenames));
      });
  }

  // function selectAsMain(e, filename) {
  //   e.preventDefault();
  //   console.log(photos)
  //   dispatch(setPhotos([filename,...photos.filter((photo)=>photo !== filename)]))
  //   console.log(photos)
  // }

  return (
    <>
      <p className="text-sm text-gray-400">
        Try to upload <span className="font-bold">maximum</span> Photos
      </p>
      <div className="flex justify-around items-center gap-1">
        <Input
          placeholder="Add photo using a link ...jpg"
          onChange={(e) => setPhotoLink(e.target.value)}
          value={photoLink}
        />
        <button
          className="py-2 px-3 bg-gray-100 rounded-lg"
          onClick={addPhotoByLink}
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
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
            />
          </svg>
        </button>
      </div>
      <div className="mt-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {/* {console.log("Just Before Image rendering"+photos)} */}
        {Array.isArray(photos) &&
          photos.map((link, index) => (
            <div
              key={`${link}-${index}`}
              className="h-36 flex items-center justify-center relative"
            >
              <img
                className="h-36 w-full object-cover rounded-3xl"
                src={"http://localhost:3000/uploads/" + link}
                alt="Image:)"
              />
              <button
                onClick={() => dispatch(removePhoto(link))}
                className="absolute bottom-0 right-0 p-1 bg-black bg-opacity-40 rounded-xl text-white"
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
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
              <button
                onClick={() =>dispatch(selectMain(link))}
                className="absolute bottom-0 left-0 p-1 bg-black bg-opacity-40 rounded-xl text-white"
              >
                {link === photos[0] && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {link !== photos[0] && (
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
                      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                    />
                  </svg>
                )}
              </button>
            </div>
          ))}
        <label className="h-32 cursor-pointer flex flex-row justify-center items-center p-2 bg-gray-100 rounded-md gap-1 text-xl">
          <input
            type="file"
            multiple
            className="hidden"
            onChange={uploadPhoto}
          />
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
              d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
            />
          </svg>
          Upload
        </label>
      </div>
    </>
  );
}

export default PhotoUploader;
