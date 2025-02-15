const Listing = require("../models/listing.js")
const review = require("../models/review.js");

module.exports.postReview = async (req,res)=>{
    let listing = await Listing.findById(req.params.id)
    let newReview = new review(req.body.review)
    newReview.author = req.user._id
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","New Review Added!");
    res.redirect(`/listings/${listing._id}`);

}

module.exports.destroyReview = async(req,res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{ $pull : {reviews : reviewId}});
    await review.findByIdAndDelete(reviewId);
    
    res.redirect(`/listings/${id}`);
    }