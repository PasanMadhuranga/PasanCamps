const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/pasan-camps";
// const axios = require("axios");

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("OH NO MONGO CONNECTION ERROR!!!");
    console.log(err);
  });

const getSample = (array) => array[Math.floor(Math.random() * array.length)];

// const getImageURL = async () => {
//   try {
//     const config = {
//       params: {
//         client_id: "gdnO96bpcvOdIYScVESUOLZpznjI4rLFkDZ6fQQixDw",
//         collections: "483251",
//       },
//     };
//     const res = await axios.get(
//       "https://api.unsplash.com/photos/random",
//       config
//     );
//     return res.data.urls.regular;
//   } catch (e) {
//     console.log(e);
//   }
// };

const sampleImgs = [
  {
    url: "https://res.cloudinary.com/dujhq8egd/image/upload/v1717397393/PasanCamps/ixgdwn7lig5bczf4dnql.jpg",
    filename: "PasanCamps/ixgdwn7lig5bczf4dnql",
  },
  {
    url: "https://res.cloudinary.com/dujhq8egd/image/upload/v1717397622/PasanCamps/flgmtoi5uqzihlxrdkpr.jpg",
    filename: "PasanCamps/flgmtoi5uqzihlxrdkpr",
  },
  {
    url: "https://res.cloudinary.com/dujhq8egd/image/upload/v1717397624/PasanCamps/uqwdvxhjcozvqgdn2ud2.jpg",
    filename: "PasanCamps/uqwdvxhjcozvqgdn2ud2",
  },
  {
    url: "https://res.cloudinary.com/dujhq8egd/image/upload/v1717397624/PasanCamps/kveuhchgj9mu8lsahatz.jpg",
    filename: "PasanCamps/kveuhchgj9mu8lsahatz",
  },
  {
    url: "https://res.cloudinary.com/dujhq8egd/image/upload/v1717397769/PasanCamps/cwfh9umrudrb1j5et8ms.jpg",
    filename: "PasanCamps/cwfh9umrudrb1j5et8ms",
  },
];

// An asynchronous function that seeds the database with sample campgrounds.
const seedDB = async () => {
  // deletes all existing campgrounds in the collection.
  // await Campground.deleteMany({});
  // A loop runs 50 times to create 50 sample campgrounds.
  for (let i = 0; i < 10; i++) {
    const randLoc = Math.floor(Math.random() * cities.length);
    await Campground.create({
      title: `${getSample(descriptors)} ${getSample(places)}`,
      price: Math.floor(Math.random() * 20) + 10,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos dolor sit amet consectetur adipisicing elit.",
      location: `${cities[randLoc].city}, ${cities[randLoc].state}`,
      geometry: {
        type: "Point",
        coordinates: [cities[randLoc].longitude, cities[randLoc].latitude],
      },
      images: [sampleImgs[Math.floor(Math.random() * sampleImgs.length)]],
      // The author field is set to the ID of the user with the username "bob".
      author: "665d5b5916b52867a7279689",
    });
  }
};

// The seeding function is executed, and the MongoDB connection is closed upon completion.
seedDB()
  .then(() => {
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error("Error during seeding:", err);
    mongoose.connection.close();
  });
