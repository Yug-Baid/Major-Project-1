const Listing = require("./models/listing.js")
const Review = require('./models/review.js');
const expressError = require("./utils/expressError.js");
const {listingSchema,reviewSchema} = require("./schema.js");

module.exports.isLogged = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You are not Logged in")
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl =  req.session.redirectUrl;
    }
    next(); 
}   

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","You are not the Owner of listing")
    return res.redirect(`/listings/${id}`);
}
next(); 
}

module.exports.validatelisting = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
      if(error){
        let errMsg = error.details.map((el) => el.message).join(",");   
          throw new expressError(400 ,errMsg)
      }else{
        next();
      }
}

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    console.log(error)
    let errMsg = error.details.map((el) => el.message).join(",");
      if(error){
          throw new expressError(400 ,errMsg)
      }else{
        next();
      }
}

module.exports.isReviewAuthor = async (req,res,next)=>{
    let {id,reviewId} = req.params;
    let listing = await Review.findById(reviewId);
if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","You are not the Author of this Review")
    return res.redirect(`/listings/${id}`);
}
next(); 
}
