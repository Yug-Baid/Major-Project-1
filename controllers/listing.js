const Listing = require("../models/listing.js")
const mapToken = process.env.MAP_TOKEN

const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxgeocoding({accessToken : mapToken})

module.exports.index = async (req,res)=>{
    let allListings = await Listing.find({})
    res.render("./listings/index.ejs",{allListings})
}

module.exports.newListing = (req,res)=>{
    res.render("./listings/new.ejs")
}

module.exports.showlisting = async (req,res)=>{
    let {id} = req.params
   
    const listing = await Listing.findById(id).populate({path : "reviews",populate : {path : "author"}}).populate("owner")
    if(!listing){
        req.flash("error","The listing you searched for doesn't exist");
        res.redirect("/listings")
    }
  
    res.render("./listings/show.ejs", {listing})
}

module.exports.createListing = async (req,res,next)=>{
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send()
        
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id;    
    newListing.image = {url,filename}
    newListing.geometry = response.body.features[0].geometry
    
    let saveListing = await newListing.save();
console.log(saveListing)
    req.flash("success","New Listing Created !");
     res.redirect("/listings")

}

module.exports.editListing = async (req,res)=>{
    let {id} = req.params
    const listing = await Listing.findById(id)
    if(!listing){
        req.flash("error","The listing you searched for doesn't exist");
        res.redirect("/listings")
    }

    let originalImageUrl = listing.image.url
    originalImageUrl = originalImageUrl.replace("/upload","/upload/h_250,w_350");
  
    res.render("./listings/edit.ejs",{listing,originalImageUrl})
}

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params
   let listing =  await Listing.findByIdAndUpdate(id,{...req.body.listing})

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url ,filename}
        await listing.save();
    
    }
 
    req.flash("success","Listing Updated !");
    res.redirect(`/listings/${id}`)
}

module.exports.destroyRoute = async (req,res)=>{
    let {id} = req.params
    const deletedList = await Listing.findByIdAndDelete(id)
    console.log(deletedList)
    req.flash("success","Listing Deleted !");
    res.redirect("/listings")
}
