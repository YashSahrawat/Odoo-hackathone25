const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpError = require("../utils/ExpError.js");
const {reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");


const validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body.review);
    if(error){
      const msg = error.details.map(el => el.message).join(", ");
      throw new ExpError(400, msg);
    }
    else{
      next();
    }
  }

// Reviews Show Route
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.createReview)
);

// Reviews Delete Route
router.delete("/:reviewId", isLoggedIn,isReviewAuthor,wrapAsync(reviewController.delete)
);

module.exports = router;