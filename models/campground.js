const mongoose = require("mongoose");
const { Schema } = mongoose;
const Review = require("./review")

const ImageSchema = new Schema({
  url: String,
  filename: String
});

// ImageSchema.virtual("thumbnail"): This creates a virtual property named thumbnail on the ImageSchema.
// A virtual property is not stored in the database.
// Instead, it is a property that is calculated dynamically based on other properties in the schema.
// .get(function () { ... }): This defines a getter function for the thumbnail virtual property.
// A getter function is a method that gets the value of a specific property.
ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const CampgroundSchema = new Schema({
  title: String,
  images: [ImageSchema],
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  price: Number,
  description: String,
  location: String,
  // This field stores a reference to a User document.
  author: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
  ]
});

// This piece of code defines a Mongoose middleware (also known as a hook) that runs after the findOneAndDelete operation is executed on the Campground model.
// The post method is used to define a post-hook.
// The purpose of this middleware is to clean up associated Review documents when a Campground is deleted.
CampgroundSchema.post("findOneAndDelete", async function (camp) {
  if (camp.reviews.length) {
    await Review.deleteMany({ _id: { $in: camp.reviews } });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
