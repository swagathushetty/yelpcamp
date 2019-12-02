//all the middlware goes here


//campground ownership middleware
function checkCampgroundOwnership(req,res,next){
	if(req.isAuthenticated()){
	//does the user own the campground ?
		CampGround.findById(req.params.id,function(err,foundCampground){
		if(err){
			res.redirect("/campgrounds")
		}else {
			//does user own campground
			//foundCampground is object
			if(foundCampground.author.id.equals(req.user._id)){
				next()
			}else {
				req.flash("error", "You don't have permission to do that");
				res.redirect("back")
			}
			
		}
			})

			}else{
				req.flash("error", "You need to be logged in to do that");
				res.redirect("back") //previous page
			}
		}


//check comment ownership middleware
function checkCommentOwnership(req,res,next){
	if(req.isAuthenticated()){
	//does the user own the campground ?
		Comment.findById(req.params.comment_id,function(err,foundComment){
		if(err){
			res.redirect("back")
		}else {
			if(foundComment.author.id.equals(req.user._id)){
				next()
			}else {
				req.flash("error", "You don't have permission to do that");
				res.redirect("back")
			}
			
		}
		})

		}else{
			req.flash("error", "You need to be logged in to do that");
			res.redirect("back") //previous page
		}
	}


var CampGround=require("../models/campground")
var Comment=require("../models/comment")

//passport middleware
//middleware
function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","please login first")
	res.redirect("/login")
}



module.exports={
	checkCampgroundOwnership:checkCampgroundOwnership,
	checkCommentOwnership:checkCommentOwnership,
	isLoggedIn:isLoggedIn
	
}