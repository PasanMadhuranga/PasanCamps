// The Joi library is a powerful and flexible validation library for JavaScript, 
// often used with Node.js to validate data structures such as request payloads, query parameters, 
// and configuration objects.. Joi provides server-side validation. 
// It is commonly used in server-side applications, especially in Node.js, to validate data before processing it.
const BaseJoi = require('joi');

// This is a library that allows you to sanitize HTML input to prevent XSS attacks.
const sanitizeHtml = require('sanitize-html');

// This is a custom Joi extension that sanitizes HTML input.
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

// This extends the Joi library with the custom extension.
const Joi = BaseJoi.extend(extension)

campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required().escapeHTML(),

    location: Joi.string().pattern(new RegExp("^(.)+, (.)+$")).required(),

    // image: Joi.string().uri(),

    price: Joi.number().min(0).required(),

    description: Joi.string().required().escapeHTML(),
  }).required(),
  deleteImages: Joi.array(),
});

reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(0).max(5).required(),
    body: Joi.string().required().escapeHTML(),
  }).required(),
})


module.exports = { campgroundSchema, reviewSchema }
