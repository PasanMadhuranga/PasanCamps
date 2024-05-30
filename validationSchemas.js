// The Joi library is a powerful and flexible validation library for JavaScript, 
// often used with Node.js to validate data structures such as request payloads, query parameters, 
// and configuration objects.. Joi provides server-side validation. 
// It is commonly used in server-side applications, especially in Node.js, to validate data before processing it.

const Joi = require("joi");

campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),

    location: Joi.string().pattern(new RegExp("^(.)+, (.)+$")).required(),

    // image: Joi.string().uri(),

    price: Joi.number().min(0).required(),

    description: Joi.string().required(),
  }).required(),
  deleteImages: Joi.array(),
});

reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(0).max(5).required(),
    body: Joi.string().required(),
  }).required(),
})


module.exports = { campgroundSchema, reviewSchema }
