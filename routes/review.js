const express = require("express")
const router = express.Router({mergeParams : true});
const WrapAsync = require("../utils/wrapAsync.js")
const wrapAsync = require("../utils/wrapAsync.js");

const expressError = require("../utils/expressError.js");

const {validateReview, isLogged, isReviewAuthor} = require("../middleware.js")
const reviewController = require("../controllers/review.js")


//Reviews
//Post Review Route
router.post("/",isLogged,wrapAsync(reviewController.postReview))

//Delete Review Route
router.delete("/:reviewId",isLogged,isReviewAuthor,wrapAsync(reviewController.destroyReview))

module.exports = router;