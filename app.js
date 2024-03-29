const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const { campgroundSchema, reviewSchema } = require("./validationSchemas");
const ExpressError = require("./utils/ExpressError");
const catchAsync = require("./utils/catchAsync");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const Campground = require("./models/campground");
const Review = require("./models/review");

mongoose
  .connect("mongodb://127.0.0.1:27017/pasan-camps")
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("OH NO MONGO CONNECTION ERROR!!!");
    console.log(err);
  });

app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.send("HOME");
});

app.get(
  "/campgrounds",
  catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

app.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate("reviews");
    res.render("campgrounds/show", { campground });
  })
);

app.put(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);

app.post("/campgrounds/:id/reviews", validateReview, catchAsync(async (req, res) => {
  const { id } = req.params;
  const { review } = req.body;
  const camp = await Campground.findById(id)
  const newReview = new Review(review)
  camp.reviews.push(newReview)
  await newReview.save()
  await camp.save()
  res.redirect(`/campgrounds/${camp._id}`);
}))

app.delete(
  "/campgrounds/:id/reviews/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId)
    await Campground.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId }
    });
    res.redirect(`/campgrounds/${id}`);
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, Something Went Wrong!";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("LISTENING ON PORT 3000");
});
