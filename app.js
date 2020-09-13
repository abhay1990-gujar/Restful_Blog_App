       const express = require("express"),
	expressSanitizer= require("express-sanitizer"),
	 methodOverride = require("method-override"),
	            app = express(),
          bodyParser = require("body-parser"),
	       mongoose = require("mongoose");
	    
//app config
mongoose.connect("mongodb://localhost/restful_blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//mongoose/model config
const blogSchema = new mongoose.Schema({
	title: String,
	image: String,
	body : String,
   created: {type: Date, default: Date.now}
});

const Blog = mongoose.model("Blog", blogSchema);

//RESTful routes
app.get("/", function(req, res){
	res.redirect("/blogs");
});


//index route
app.get("/blogs", function(req, res){
	Blog.find({}, function(err, blogs){
		if(err){
			console.log("ERROR!");
		} else{
			res.render("index", {blogs: blogs});
		}
	});
});


//new route
app.get("/blogs/new", function(req, res){
	res.render("new");
});


// create route
app.post("/blogs", function(req, res){
	req.body.blog.body= req.sanitize(req.body.blog.body);
	// creblogslog
	Blog.create(req.body.blog, function(err, newBlog){
		if(err){
			res.render("new");
		} else{
			// redirect to the index
			res.redirect("/blogs");
		}
	});	
});
//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		} else{
			res.render("show",{blog: foundBlog});
		}
		
	});
});
//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
	Blog.findById(req.params.id, function(err, foundBlog){
		if(err){
			res.redirect("/blogs");
		} else{
			res.render("edit",{blog: foundBlog});
		}
	});
});
//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
	req.body.blog.body= req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
		if(err){
			res.redirect("/blogs");
		} else{
			res.redirect("/blogs/"+ req.params.id);
		}
	});
});

//DELETE ROUTE
app.delete("/blogs/:id", function(req, res){
	//destroy
	Blog.findByIdAndRemove(req.params.id, function(err){
		if(err){
			res.redirect("/blogs");
		} else{
			res.redirect("/blogs");
		}
	});
	
	// redirect
});





app.listen(3000, () => {
	console.log("server is listening")
});


app.listen(process.env.PORT, process.env.IP, function(){
	console.log("SERVER IS RUNNING")
});
