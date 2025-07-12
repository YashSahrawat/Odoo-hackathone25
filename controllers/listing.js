require('dotenv').config();
const Listing = require("../models/listing.js");

// INDEX
module.exports.index = async (req, res) => {
  let { q, category } = req.query;
  let query = {};

  if (q) {
    query.$or = [
      { location: { $regex: q, $options: "i" } },
      { country: { $regex: q, $options: "i" } }
    ];
  }

  if (category) {
    query.category = category;
  }

  let allListings = await Listing.find(query);
  res.render("listings/index.ejs", { allListings });
};

// NEW FORM
module.exports.new = (req, res) => {
  res.render("listings/new.ejs");
};

// SHOW PAGE
module.exports.show = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" }
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

// CREATE
module.exports.create = async (req, res, next) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;

  if (req.file) {
    newListing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }

  // No geometry added
  await newListing.save();
  req.flash("success", "New listing created");
  res.redirect("/listings");
};

// EDIT FORM
module.exports.edit = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  let original_img = listing.image.url.replace("/upload", "/upload/h_300,w_250");
  res.render("listings/edit.ejs", { listing, original_img });
};

// UPDATE
module.exports.update = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
    await listing.save();
  }

  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};

// DELETE
module.exports.delete = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted!");
  res.redirect("/listings");
};