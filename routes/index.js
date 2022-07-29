var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Booking = require('../models/booking');
var Court = require('../models/court');


//first page
router.get('/', function (req, res, next) {
	return res.render('index.ejs');
});

router.get('/register', function (req, res, next) {
	return res.render('register.ejs');
});

 router.get('/bookingcourt', function (req, res, next) {
	console.log("profile");
	User.findOne({_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			return res.render('bookingcourt.ejs', {"name":data.username,"email":data.email,"id":data._id});
		}
	});
	
 });

// router.get('/historybooking', function (req, res, next) {
// 	return res.render('tables.ejs');
// });

//  router.get('/editbooking', function (req, res, next) {
	
	
//  	return res.render('editbooking.ejs');
//  });

router.get('/editbooking/:id', function (req, res, next) {
			//console.log(req.params.id);

			Booking.find(({_id:req.params.id}),(err, docs) => {
			if (!err) {
				console.log(docs);
				res.render("editbooking.ejs", {
					
					data: docs
				});
			} else {
				console.log('Failed to retrieve the booking List: ' + err);
			}
			});
	
	//res.json(req.params.id);





});

//  router.get('/delete/:id', function (req, res, next) {
//  	return res.render('delete.ejs');
//  });

router.get('/delete/:id', function (req, res, next) {
	console.log(req.params.id);
	Booking.findByIdAndRemove(req.params.id, (err, doc) => {
				if (!err) {
					res.render("delete.ejs", 
					
						res.redirect('/historybooking')
					);
					
				} else {
					console.log('Failed to delete booking Details: ' + err);
				}
			});
			
});






router.post('/register', function(req, res, next) { //registration
	console.log(req.body);
	var personInfo = req.body;

	if(!personInfo.email || !personInfo.username || !personInfo.password || !personInfo.passwordConf){
		res.send();
	} else {
		if (personInfo.password == personInfo.passwordConf) {

			User.findOne({email:personInfo.email},function(err,data){
				if(!data){
					var c;
					User.findOne({},function(err,data){

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}

						var newPerson = new User({
							unique_id:c,
							email:personInfo.email,
							username: personInfo.username,
							password: personInfo.password,
							passwordConf: personInfo.passwordConf
						});

						newPerson.save(function(err, Person){
							if(err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({_id: -1}).limit(1);
					
					res.redirect("/login");
					//res.alert({"Success":"You are registered,You can login now."});
				}else{
					res.send({"Success":"Email is already used."});
				}

			});
		}else{
			res.send({"Success":"password is not matched"});
		}
	}
});

router.get('/login', function (req, res, next) { //login
	return res.render('login.ejs');
});

router.get('/userdashboard', function (req, res, next) { //shortform
	return res.render('userdashboard.ejs');
});


/** 
router.post('/login', function (req, res, next) {
	//console.log(req.body);
	User.findOne({email:req.body.email},function(err,data){
		if(data){
			
			if(data.password==req.body.password){
				//console.log("Done Login");
				req.session.userId = data.unique_id;
				//console.log(req.session.userId);
				//res.send({"Success":"Success!"});
				res.redirect("/userdashboard");
				
			}else{
				res.send({"Success":"Wrong password!"});
			}
		}else{
			res.send({"Success":"This Email Is not registered!"});
		}
	});
});*/

router.get('/profile', function (req, res, next) { //check profile
	console.log("profile");
	User.findOne({_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			return res.render('userprofile.ejs', {"name":data.username,"email":data.email,"id":data.unique_id});
		}
	});
});


router.post('/updprofile', function(req, res, next) {
	// Create Mongose Method to Update a Existing Record Into Collection
	
	var data = {
		username : req.body.name,
		email:req.body.email
	}
	
		// Save User
		User.findByIdAndUpdate({_id:req.session.userId}, data, function(err, docs) {
			if (err) throw err
			else{
				console.log(docs);
				res.redirect('/profile');
			}
	
	});
});








router.get('/logout', function (req, res, next) { //logout
	console.log("logout")
	if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
    	if (err) {
    		return next(err);
    	} else {
    		return res.redirect('/');
    	}
    });
}
});

router.get('/forgetpass', function (req, res, next) { //forget password
	res.render("forget.ejs");
});

router.post('/forgetpass', function (req, res, next) {
	//console.log('req.body');
	//console.log(req.body);
	User.findOne({email:req.body.email},function(err,data){
		console.log(data);
		if(!data){
			res.send({"Success":"This Email Is not registered!"});
		}else{
			// res.send({"Success":"Success!"});
			if (req.body.password==req.body.passwordConf) {
			data.password=req.body.password;
			data.passwordConf=req.body.passwordConf;

			data.save(function(err, Person){
				if(err)
					console.log(err);
				else
					console.log('Success');
					res.send({"Success":"Password changed!"});
			});
		}else{
			res.send({"Success":"Password does not matched! Both Password should be same."});
		}
		}
	});
	
});

router.get('/editprofile', function (req, res, next) { //check profile
	console.log("profile");
	User.findOne({_id:req.session.userId},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			return res.render('editprofile.ejs', {"name":data.username,"email":data.email});
		}
	});
});


//admin------------------------------------------------------------------------------------

router.get('/admindashboard', function (req, res, next) {
	return res.render('admin/admindashboard.ejs');
});


router.get('/admincancelbooking', function (req, res, next) {
	return res.render('admin/admincancelbooking.ejs');
});

const admin = {
	email:"admin@gmail.com",
	password:"admin"
}

router.post('/login', (req, res)=>{
	
	if(req.body.email == admin.email && req.body.password == admin.password){
		req.session.user = req.body.email;
		res.redirect('/admindashboard');
	}else{
	User.findOne({email:req.body.email},function(err,data){
	if(data.email == req.body.email && data.password == req.body.password){
        req.session.userId = data._id;
        res.redirect('/userdashboard');
        //res.end("Login Successful...!");
    }else{
        res.end("Invalid Username")
    }
	})
	};
});

router.get('/adminviewuser', function (req, res, next) { //forget password
	User.find((err, docs) => {
		if (!err) {
			res.render("admin/adminviewuser.ejs", {
				data: docs
			});
		} else {
			console.log('Failed to retrieve the user List: ' + err);
		}
		});



	
});

router.get('/admincourtmanage/', function (req, res, next) { 
	//console.log(req.session);

			Court.find((err, docs) => {
			if (!err) {
				res.render("admin/admincourtmanage.ejs", {
					data: docs
				});
			} else {
				console.log('Failed to retrieve the booking List: ' + err);
			}
			});

});

router.get('/adminhistorybooking', function (req, res, next) { //forget password

	console.log(req.session);

			Booking.find((err, docs) => {
			if (!err) {
				res.render("admin/adminhistorybooking.ejs", {
					data: docs
				});
			} else {
				console.log('Failed to retrieve the booking List: ' + err);
			}
			});

			

	
});

router.get('/adminaddcourt', function (req, res, next) { //forget password



	res.render("admin/adminaddcourt.ejs");
});

router.get('/admineditcourt/:id', function (req, res, next) { //forget password
	console.log(req.params.id);

	Court.find(({_id:req.params.id}),(err, docs) => {
	if (!err) {
		console.log(docs);
		res.render("admin/admineditcourt.ejs", {
			data: docs
		});
	} else {
		console.log('Failed to retrieve the booking List: ' + err);
	}
	});


	
	
	
});

router.get('/admineditbooking/:id', function (req, res, next) { //forget password
	req.session.bookid = req.params.id;
	Booking.find(({_id:req.params.id}),(err, docs) => {
		if (!err) {
			console.log(docs);
			res.render("admin/admineditbooking.ejs", {
				data: docs
			});
		} else {
			console.log('Failed to retrieve the booking List: ' + err);
		}
		});
});
router.post('/updbook', function(req, res, next) {
	// Create Mongose Method to Update a Existing Record Into Collection
	console.log('bookid');
	var data = {
		bookdate : req.body.date,
		court:req.body.court,
		booktime:req.body.time,

	}
	
		// Save User
		Booking.findByIdAndUpdate({_id:req.session.bookid}, data, function(err, docs) {
			if (err) throw err
			else{
				console.log(docs);
				res.redirect('/adminhistorybooking');
			}
	
	});
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// router.get('/admindeletebooking/:id', function (req, res, next) { //forget password
// 	Booking.find(({_id:req.params.id}),(err, docs) => {
// 		if (!err) {
// 			console.log(docs);
// 			res.render("admin/admindeletebooking.ejs", {
// 				data: docs
// 			});
// 		} else {
// 			console.log('Failed to retrieve the booking List: ' + err);
// 		}
// 		});

	
// });
router.get('/admindeletebooking/:id', function (req, res, next) {

	console.log(req.params.id);
	Booking.findByIdAndRemove(req.params.id, (err, doc) => {
				if (!err) {
					res.render("tables.ejs",res.redirect('/adminhistorybooking') );	
					
				} else {
					console.log('Failed to delete booking Details: ' + err);
				}
			});
			
});










router.get('/adminedituser', function (req, res, next) { //forget password
	res.render("admin/adminedituser.ejs");
});



router.post("/adminaddcourt",(req,res) => {
    // validate request
	
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }
	
		Booking.findOne({},function(err,data){
			
			if (data) {
				console.log("if");
				c = data.bookingid + 1;
			}else{
				c=1;
			}

			const court = new Court({
				courtid :c,
				courtname:req.body.name, 
				status : req.body.status,
				 
			}) 

		// new booking
    	// masukkan ke dalam database
    	court
      	  .save(court)
      	  .then(data => {
     	  	     //res.send(data)
        	    res.redirect('/admincourtmanage');
   	     })
       	 .catch(err =>{
       	     res.status(500).send({
       	         message : err.message || "Some error occurred while creating a create operation"
       	     });
      	  });



		});
});


// add booking---------------------------------------------------------------------------------
router.post("/bookingcourt",(req,res) => {
    // validate request
	var c;
	console.log(req.session);
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }
	
		Booking.findOne({},function(err,data){
			
			if (data) {
				console.log("if");
				c = data.bookingid + 1;
			}else{
				c=1;
			}

			const booking = new Booking({
				bookingid :c,
				userid:req.body.id, 
				bookdate : req.body.date,
				booktime : req.body.time,
				court: req.body.court   
			}) 

		// new booking
    	// masukkan ke dalam database
    	booking
      	  .save(booking)
      	  .then(data => {
     	  	     //res.send(data)
        	    res.redirect('/historybooking');
   	     })
       	 .catch(err =>{
       	     res.status(500).send({
       	         message : err.message || "Some error occurred while creating a create operation"
       	     });
      	  });



		});
});


//---------------------DISPLAY USER--------------------------------------------------------------

router.get("/historybooking",(req, res,)=>{
	
			console.log(req.session);

			Booking.find(({userid:req.session.userId}),(err, docs) => {
			if (!err) {
				res.render("tables.ejs", {
					data: docs
				});
			} else {
				console.log('Failed to retrieve the booking List: ' + err);
			}
			});
			
			

});

module.exports = router;