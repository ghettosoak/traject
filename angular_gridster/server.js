// set up ======================================================================
var express  = require('express');
var app      = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb

var port = process.env.PORT || 8080;

// configuration ===============================================================

mongoose.connect('mongodb://127.0.0.1:27017/traject'); 	// connect to mongoDB database on modulus.io

app.configure(function() {
	app.use(express.static(__dirname)); 		// set the static files location /public/img will be /img for users
	app.use(express.logger('dev')); 						// log every request to the console
	app.use(express.bodyParser()); 							// pull information from html in POST
	app.use(express.methodOverride()); 						// simulate DELETE and PUT
});

// define model ================================================================

// var Schema = mongoose.Schema;

var Bit = new mongoose.Schema({
	bitID: Number,
	opened: Date,
	closed: Date,
	displayed: Boolean,
	order: Number,
	type: String,
	content: String
});

var Cell = new mongoose.Schema({
	sizeX : Number,
	sizeY : Number,
	row : Number,
	col : Number,
	title: String,
	body: [Bit],
	cellID: Number,
	gaze: Boolean, 
	wristwatch: Boolean, 
	addcell:Boolean, 
	list: Boolean
});

var Cellular = mongoose.model('testData', Cell);


// routes ======================================================================

	// api ---------------------------------------------------------------------
	// get all cells
	app.get('/api/testData', function(req, res) {

		// use mongoose to get all cells in the database
		Cellular.find(function(err, cells) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err) res.send(err);

			var theCells = cells;

			var theBits;

			for (var aCell in theCells){
				// console.log(aCell)
				// console.log(theCells[aCell].body);

				for (var aBit in theCells[aCell].body){
					// console.log(aBit)
					// console.log(theCells[aCell].body[aBit])
					// console.log(aCell[aBit])
					// console.log(theCells[aCell][aBit])

				}
			}

			res.json(cells); // return all cells in JSON format

			// console.log(cells)

		});
	});

	// create todo and send back all cells after creation
	app.post('/api/collect', function(req, res) {
		for (var i = 0; i < req.body.length; i++){

			Cellular.update(
				{ 
					"_id" : req.body[i]._id 
				},
				{
					sizeX : req.body[i].sizeX,
					sizeY : req.body[i].sizeY,
					row : req.body[i].row,
					col : req.body[i].col,
					title : req.body[i].title,
					body : req.body[i].body
				},
				{ 
					multi: true 
				},
				function (err, numberAffected, raw) {
					if (err) return handleError(err);
				}
			);
		}
		res.send('SAVE')
	});

	app.post('/api/add', function(req, res) {
			Cellular.create({
				sizeX : 1,
				sizeY : 1,
				row : 1,
				col : 1,
				title: '',
				body: '',
				gaze: false, 
				wristwatch: false, 
				addcell:false, 
				list: true
			}, function(err, todo) {
				if (err)
					res.send(err);

				// get and return all the todos after you create another
				Cellular.find(function(err, todos) {
					if (err)
						res.send(err)
					res.json(todos);
				});
			});
	});

	app.post('/api/updateBit', function(req, res) {

		// console.log(req.body)

		// Cellular.find({
		// 	'cellID': req.body.theCell,
		// 	'body.bitID': req.body.theBit
		// }, function(err, found){
		// 	console.log(found)
		// 	res.send(found)

		// 	// for (var i in found){
		// 	// 	res.send(i)
		// 	// }
		// })

		// console.log(theTarget)
		

		Cellular.findOneAndUpdate({
			'cellID': req.body.theCell,
			'body.bitID': req.body.theBit
		},{
			'body.$.content': req.body.theContent
		}, function(err, todo) {
			if (err)
				res.send(err);

			// get and return all the todos after you create another
			Cellular.find(function(err, todos) {
				if (err)
					res.send(err)
				res.send('GOT IT')
				// res.json(todos);

			});
		});
	});


	// delete a todo
	app.post('/api/remove/:id', function(req, res) {
		Cellular.remove({
			_id : req.params.id
		}, function(err, todo) {
			if (err)
				res.send(err);

			// get and return all the todos after you create another
			Cellular.find(function(err, todos) {
				if (err)
					res.send(err)
				res.json(todos);
			});
		});
	});

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {  
		res.sendfile('index.html'); // load the single view file (angular will handle the page changes on the front-end)
	});

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
console.log("At the tone the time will be: " + new Date());





