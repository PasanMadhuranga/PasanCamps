const express = require("express");

// By using router, you create a modular and maintainable structure for your application’s routing, 
// making it easier to scale and manage your codebase.
const router = express.Router();

// catchAsync is a function that takes in a function and returns a new function that catches any errors that occur during the execution of the original function.
const catchAsync = require("../utils/catchAsync");

// The campgrounds controller contains functions that define the logic for handling requests to the /campgrounds route.
const campgrounds = require("../controllers/campgrounds");

// require all the middleware functions that we will use in the campgrounds routes
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

// multer is a middleware for handling multipart/form-data, which is primarily used for uploading files.
const multer = require("multer");

// { storage }: This object passed to multer contains the configuration for where and how to store uploaded files. 
// By passing { storage }, you are telling multer to use the Cloudinary storage configuration that was imported in the fisrt line.
const { storage } = require("../cloudinary");
const upload = multer({ storage });

// upload.array("image"): This middleware handles the uploading of multiple files (images in this case) attached to the field named image in the form. 
// The uploaded files are processed using the storage configuration from Cloudinary.
router.route("/")
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array("image"), validateCampground, catchAsync(campgrounds.createCampground));

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.route("/:id")
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array("image"), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;
