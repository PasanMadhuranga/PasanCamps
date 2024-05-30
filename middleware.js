// require joi validation schemas
const { campgroundSchema, reviewSchema } = require("./validationSchemas");
// require ExpressError to throw custom error messages
const ExpressError = require("./utils/ExpressError");

// require models
const Campground = require("./models/campground");
const Review = require("./models/review");

// due to some recent security improvements in the Passport.js version updates (used for authentication in our YelpCamp application), 
// the session now gets cleared after a successful login. 
// This causes a problem with our returnTo redirect logic because we store the returnTo route path 
// (i.e., the path where the user should be redirected back after login) in the session (req.session.returnTo), 
// which gets cleared after a successful login.
// To resolve this issue, we will use this middleware function to transfer the returnTo value from the session (req.session.returnTo) 
// to the Express.js app res.locals object before the passport.authenticate() function is executed in the /login POST route.
module.exports.storeReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  // The next() function is a callback that passes control to the next middleware function in the stack. 
  // Without calling next(), the request would be left hanging, and the subsequent middleware functions or route handlers would not execute. 
  next();
};


module.exports.isLoggedIn = (req, res, next) => {
  // req.isAuthenticated() method is provided by Passport.js to determine if the user is logged in.
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    // When you use connect-flash in an Express.js application, it augments the req object with a flash method. 
    // This method is used to set flash messages that will be stored in the session and can be accessed in the next request.
    req.flash("error", "You must be signed in first!");
    // Then redirects the user to the login page. 
    // The return statement ensures that the function exits after the redirect, preventing any further processing.
    return res.redirect("/login");
  }
  next();
};


module.exports.validateCampground = (req, res, next) => {
  // Joi’s validate method returns an object containing the results of the validation. 
  // This object has several properties, including error and value.
  // The destructuring assignment extracts the error property from the validation result object.
  // If the validation fails, error will contain details about what went wrong. 
  // If the validation passes, error will be undefined.
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    // An ExpressError is thrown with the concatenated error message and a 400 status code (Bad Request).
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};


// This middleware checks if the currently logged-in user is the author of the campground they are trying to modify.
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};


// This middleware validates the req.body against the reviewSchema.
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};


// This middleware checks if the currently logged-in user is the author of the review they are trying to delete.
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};