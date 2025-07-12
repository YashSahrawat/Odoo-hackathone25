const joi = require("joi");

const listingSchema = joi.object({
    listing : joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        location: joi.string().required(),
        country: joi.string().required(),
        price: joi.number().min(0).required(),
        image: joi.string().allow("", null),
        category: joi.string().required(),
    }).required()

});


const reviewSchema = joi.object({
    rating: joi.number().min(1).max(5).required(),
    comment: joi.string().required()
}).required()

module.exports = {
    listingSchema,
    reviewSchema
  };