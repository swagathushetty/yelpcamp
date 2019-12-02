var express=require('express')
var router=express.Router();
var CampGround=require("../models/campground")
var middleware=require('../middleware/index') //dont do /index.js as its a special name


//INDEX ROUTES-show all campgrounds
router.get("/",function(req,res){
	//get all campgrounds from DB
	CampGround.find({},function(err,allCampgrounds){
		if(err){
			console.log(err);
		}else {
			res.render("campgrounds/index",{campgrounds:allCampgrounds,currentUser:req.user});
		}
	});
});
	

//CREATE-add new campground to DB
//routes can have same name of they have different methods like POST/GET
router.post("/",middleware.isLoggedIn,function(req,res){
	//get data from form and add to campgorunds array
	var name=req.body.name;
	var image=req.body.image;
	var desc=req.body.description
	var price=req.body.price
	var author={
		id:req.user._id,
		username:req.user.username
	}
	var newCampgrounds={name:name,price:price,image:image,description:desc,author:author}
	CampGround.create(newCampgrounds,function(err,newlyCreated){
		if(err){
			console.log(err);
		}else{
			//redirect back to campgrounds page
	         res.redirect("/campgrounds");
		}
	});
	
});
//show form to create new campgrounds
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
});

//SHOW-shows info aboot one template
router.get("/:id",function(req,res){
	//find the campground with a id.its a mongodb methods
	CampGround.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err){
			console.log(err);
		}else{
			console.log(foundCampground)
			//render show template
			res.render("campgrounds/show",{campground:foundCampground})
		}
	})
	})

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
			
		//does the user own the campground ?
		CampGround.findById(req.params.id,function(err,foundCampground){
			
			res.render("campgrounds/edit",{campground:foundCampground})			
	    })
		
   })


//UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
	//find and update the correct campground
	CampGround.findByIdAndUpdate(req.params.id,req.body.campground,function(err,UpdatedCampground){
		if(err){
			res.redirect("/campgrounds")
		}else{
			res.redirect("/campgrounds/"+req.params.id)
		}
	})
		
})

//destroy campground route
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
	CampGround.findByIdAndRemove(req.params.id,function(err){
		if(err){
			res.redirect("/campgrounds")
		}else{
			res.redirect("/campgrounds")
		}
	})
})




module.exports=router
