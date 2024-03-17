const Joi = require("joi");

campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),

    location: Joi.string().pattern(new RegExp("^(.)+, (.)+$")).required(),

    image: Joi.string().uri(),

    price: Joi.number().min(0).required(),

    description: Joi.string().required(),
  }).required(),
});

reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    body: Joi.string().required(),
  }).required(),
})


module.exports = { campgroundSchema, reviewSchema }
