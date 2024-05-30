// require the Campground model
const Campground = require("../models/campground");

// require the mapbox geocoding service to convert location to coordinates
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

// require the mapbox token
const mapBoxToken = process.env.MAPBOX_TOKEN;

// create a new geocoding client
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

// require cloudinary 
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  const geoData = await geocoder.forwardGeocode({
    query: req.body.campground.location,
    limit: 1,
  })
    .send()
  
  const campground = new Campground(req.body.campground);

  // The geometry field of the campground is set to the first result from the geocoding response.
  campground.geometry = geoData.body.features[0].geometry;

  // Sets the author field of the campground to the ID of the currently logged-in user.
  campground.author = req.user._id;
  // Maps over each file in req.files and returns a new array of objects, each containing url and filename properties. 
  // This transforms the uploaded files into the format expected by the Campground model.
  campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))

  await campground.save();

  // Sets a success flash message to inform the user that the campground was created successfully.
  req.flash("success", "Successfully made a new campground!");

  // Redirects the client to the newly created campground's show page.
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res, next) => {
  // The ID is obtained from req.params.id, which contains the route parameter (e.g., /campgrounds/:id).
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  // First populates the reviews field of the campground document with the actual Review documents. 
  // Additionally, it populates the author field of each review with the actual User document. This is a nested population.
  // Second populates the author field of the campground document with the actual User document.

  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};

module.exports.updateCampground = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground,});
  const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
  campground.images.push(...imgs);
  await campground.save();
  if (req.body.deleteImages){
    for (let filename of req.body.deleteImages){
      await cloudinary.uploader.destroy(filename);
    }
    // The $pull operator removes all array elements that match a specified condition.
    // images is the name of the array field from which we want to remove elements.
    // filename is the field within each images array element that we are checking.
    // {$in: req.body.deleteImages}: The $in operator selects documents where the value of the filename field is in the 
    // specified array (req.body.deleteImages).
    await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
  }
  req.flash("success", "Successfully update the campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.renderEditForm = async (req, res, next) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.deleteCampground = async (req, res, next) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground");
  res.redirect("/campgrounds");
};