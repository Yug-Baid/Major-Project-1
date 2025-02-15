const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")

const Listing = require("../models/listing.js")
const WrapAsync = require("../utils/wrapAsync.js")
const {isLogged, isOwner,validatelisting} = require("../middleware.js")
const listingController = require("../controllers/listing.js")
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage})



router.route("/")
.get(wrapAsync(listingController.index))
.post(isLogged,upload.single("listing[image]"),validatelisting,WrapAsync(listingController.createListing))


//New Route
router.get("/new",isLogged,wrapAsync(listingController.newListing))     

//Edit Route
router.get("/:id/edit",isLogged,isOwner,wrapAsync(listingController.editListing))


router.route("/:id")
.get(wrapAsync(listingController.showlisting))
.put(isLogged,isOwner,upload.single("listing[image]"),validatelisting,wrapAsync(listingController.updateListing))
.delete(isOwner,isLogged,wrapAsync(listingController.destroyRoute))
    




module.exports = router;