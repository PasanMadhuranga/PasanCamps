// This review controller file defines two main functions: createReview and deleteReview. 
// These functions handle the creation and deletion of reviews for campgrounds
const Review = require("../models/review");
const Campground = require("../models/campground");

module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  const { review } = req.body;
  const camp = await Campground.findById(id);
  const newReview = new Review(review);
  newReview.author = req.user._id;
  camp.reviews.push(newReview);
  await newReview.save();
  await camp.save();
  req.flash("success", "Created new review!");
  res.redirect(`/campgrounds/${camp._id}`);
};


module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);
  await Campground.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId },
  });
  req.flash("success", "Successfully deleted review!");
  res.redirect(`/campgrounds/${id}`);
};