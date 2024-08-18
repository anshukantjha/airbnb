const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const fs = require("fs");

require("dotenv").config();
const User = require("./model/User.js");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const multer = require("multer");
const Place = require("./model/Place.js");
const Booking = require("./model/Booking.js");
const port = process.env.PORT || 4000;

const jwtSecret = process.env.JWT_TOKEN;

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB using Mongoose!");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB using Mongoose:", err);
  });

app.get("/test", (req, res) => {
  res.json("test okk");
});

app.post("/register", async (req, res) => {
  console.log("Request body:", req.body);

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required." });
  }

  try {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const userDoc = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    // login after registering
    const userDocNew = await User.findOne({ email });
    if (userDocNew) {
      const passOk = bcrypt.compareSync(password, userDocNew.password);
      if (passOk) {
        jwt.sign(
          { email: userDocNew.email, id: userDocNew._id },
          jwtSecret,
          {},
          (err, token) => {
            if (err) throw err;
            res.cookie("token", token).json(userDocNew);
          }
        );
      } else {
        res.status(422).json("Invalid User Credentials!!!");
      }
    } else {
      res.status(404).json("User not found");
    }
    res.json(userDoc);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });
    if (userDoc) {
      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (passOk) {
        jwt.sign(
          { email: userDoc.email, id: userDoc._id },
          jwtSecret,
          {},
          (err, token) => {
            if (err) throw err;
            res.cookie("token", token).json(userDoc); // Fixed cookie name
          }
        );
      } else {
        res.status(422).json("Invalid User Credentials!!!");
      }
    } else {
      res.status(404).json("User not found");
    }
  } catch (error) {
    console.error("Error Logging User In", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, cookieData) => {
      if (err) {
        return res.status(403).json({ error: "Invalid Token" });
      }
      const { name, email, _id } = await User.findById(cookieData.id);

      res.json({ name, email, _id });
    });
  } else {
    res.status(401).json({ error: "No token provided" });
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.post("/upload-by-link", async (req, res) => {
  try {
    const { link } = req.body;
    // console.log(link);
    const newName = "photo" + Date.now() + ".jpg";

    await imageDownloader.image({
      url: link,
      dest: __dirname + "/uploads/" + newName,
    });
    res.json(newName);
  } catch (error) {
    console.log(error);
  }
});

const photoMiddleWare = multer({ dest: "uploads/" });
app.post("/uploads", photoMiddleWare.array("photo", 100), (req, res) => {
  // console.log(req.files);
  // getting extenstion of the file
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, mimetype } = req.files[i];

    const parts = mimetype.split("/");
    const ext = parts[parts.length - 1];

    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads\\", ""));
  }
  res.json(uploadedFiles);
});

app.post("/places", (req, res) => {
  const { token } = req.cookies;
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
    price,
  } = req.body;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        return res.status(403).json({ error: "Invalid Token" });
      }
      const placeData = await Place.create({
        owner: userData.id,
        title,
        address,
        description,
        extraInfo,
        checkIn,
        checkOut,
        maxGuest,
        photos,
        perks,
        price,
      });
      res.json(placeData);
    });
  }
});

app.get("/user-places", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        return res.status(403).json({ error: "Invalid Token" });
      }
      const { id } = userData;
      res.json(await Place.find({ owner: id }));
    });
  }
});

app.get("/places/:id", async (req, res) => {
  const { id } = req.params;
  res.json(await Place.findById(id));
});

app.put("/places", async (req, res) => {
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    description,
    extraInfo,
    checkIn,
    checkOut,
    maxGuest,
    photos,
    perks,
    price,
  } = req.body;
  // console.log("Pehle"+photos);
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        return res.status(403).json({ error: "Invalid Token" });
      }
      const placeDoc = await Place.findById(id);
      if (userData.id === placeDoc.owner.toString()) {
        placeDoc.set({
          title,
          address,
          description,
          extraInfo,
          checkIn,
          checkOut,
          maxGuest,
          photos,
          perks,
          price,
        });
      }
      // console.log(photos);
      placeDoc.save();
      res.json("All Good");
    });
  }
});

app.get("/all-places", async (req, res) => {
  res.json(await Place.find());
});

app.post("/bookings", async (req, res) => {
  try {
    const { place, checkIn, checkOut, noOfGuest, phone, userId } =
      req.body;
    const doc = await Booking.create({
      place,
      checkIn,
      checkOut,
      noOfGuest,
      phone,
      user:userId
    });
    res.json(doc);
  } catch (error) {
    console.log(error);
  }
});

app.get("/bookings", async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) {
        return res.status(403).json({ error: "Invalid Token" });
      }
      const user_Id= userData.id;
      res.json(await Booking.find({user:user_Id}).populate('place'));
    });
  }
});
