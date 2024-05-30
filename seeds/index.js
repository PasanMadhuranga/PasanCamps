const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const axios = require("axios");

mongoose
  .connect("mongodb://127.0.0.1:27017/pasan-camps")
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


// An asynchronous function that seeds the database with sample campgrounds.
const seedDB = async () => {
  // deletes all existing campgrounds in the collection.
  await Campground.deleteMany({});
  // A loop runs 50 times to create 50 sample campgrounds.
  for (let i = 0; i < 50; i++) {
    const randLoc = Math.floor(Math.random() * cities.length);
    await Campground.create({
      title: `${getSample(descriptors)} ${getSample(places)}`,
      price: Math.floor(Math.random() * 20) + 10,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos dolor sit amet consectetur adipisicing elit.",
      location: `${cities[randLoc].city}, ${cities[randLoc].state}`,
      images: [
        {
          url: 'https://res.cloudinary.com/dujhq8egd/image/upload/v1716796340/PasanCamps/gmuma6z9rmqzh6wlojyr.jpg',
          filename: 'PasanCamps/gmuma6z9rmqzh6wlojyr',
        },
        {
          url: 'https://res.cloudinary.com/dujhq8egd/image/upload/v1716796340/PasanCamps/kb3ieqf3pg5yywzf55ft.webp',
          filename: 'PasanCamps/kb3ieqf3pg5yywzf55ft',
        }
      ],
      author: "661c93abfa05c435380bd8bd",
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
