const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams: true is required to access the params from the parent router

const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const Review = require("../models/review");
const Campground = require("../models/campground");

router.post(
  "/",
  isLoggedIn, validateReview,
  catchAsync(async (req, res) => {
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
  })
);

router.delete(
  "/:reviewId",
  isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
    req.flash("success", "Successfully deleted review!");
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
