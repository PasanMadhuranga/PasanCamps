const express = require("express");
const router = express.Router({ mergeParams: true });

const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

const { reviewSchema } = require("../validationSchemas");

const Review = require("../models/review");
const Campground = require("../models/campground");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const { review } = req.body;
    const camp = await Campground.findById(id);
    const newReview = new Review(review);
    camp.reviews.push(newReview);
    await newReview.save();
    await camp.save();
    req.flash("success", "Created new review!");
    res.redirect(`/campgrounds/${camp._id}`);
  })
);

router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
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
