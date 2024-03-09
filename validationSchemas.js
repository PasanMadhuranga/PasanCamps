const Joi = require("joi");

module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),

    location: Joi.string().pattern(new RegExp("^(.)+, (.)+$")).required(),

    image: Joi.string().uri(),

    price: Joi.number().min(0).required(),

    description: Joi.string().required(),
  }).required(),
});
