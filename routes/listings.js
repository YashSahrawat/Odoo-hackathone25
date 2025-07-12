const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpError = require("../utils/ExpError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const{storage} = require("../cloudConfig.js");
const upload = multer({storage })


const validateListing = (req,res,next)=>{
    const {error} = listingSchema.validate(req.body);
    if(error){
      const msg = error.details.map(el => el.message).join(", ");
      throw new ExpError(400,msg);
    }
    else{
      next();
    }
  }

  // Index & Create
  router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn, upload.single('listing[image]'),validateListing, wrapAsync(listingController.create));

  
  // New Route
  router.get("/new", isLoggedIn, listingController.new);

  // Show & update & delete
  router
  .route("/:id")
  .get(wrapAsync(listingController.show))
  .put(isLoggedIn,isOwner, upload.single('listing[image]'),validateListing, wrapAsync(listingController.update))
  .delete(isLoggedIn,isLoggedIn,wrapAsync(listingController.delete));

  // Edit route
  router.get("/:id/edit",isLoggedIn,isLoggedIn, wrapAsync(listingController.edit)
  );

  module.exports = router;