// set up ======================================================================
var express  = require('express');
var app      = express();
var mongoose = require('mongoose');

var port = process.env.PORT || 8080;

// configuration ===============================================================

mongoose.connect('mongodb://127.0.0.1:27017/traject'); 

app.configure(function() {
	app.use(express.static(__dirname)); 
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
});

// define model ================================================================

// var Schema = mongoose.Schema;

var Bit = new mongoose.Schema({
	type: String,
	tabCount: Number,
	content: String
}); 

var Cell = new mongoose.Schema({
	sizeX : Number,
	sizeY : Number,
	row : Number,
	col : Number,
	title: String,
	body: [Bit],
	cellID: String,
	bitCount: Number,
	category: Number,
	gaze: Boolean, 
	wristwatch: Boolean, 
	addcell:Boolean, 
	list: Boolean
});

var Cellular = mongoose.model('testData', Cell);


// routes ======================================================================

	// api ---------------------------------------------------------------------
	app.get('/api/testData', function(req, res) {
		Cellular.find(function(err, cells) {
			if (err) res.send(err);
			res.json(cells);
		});
	});

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
					category: req.body[i].category,
					title : req.body[i].title,
					body : req.body[i].body
				},
				function (err, numberAffected, raw) {
					if (err) res.send(err);

					Cellular.find(function(err, todos) {
						if (err)
							res.send(err)
						res.json(todos);
					});
				}
			);
		}
	});

	app.post('/api/add', function(req, res) {
		Cellular.create({
			sizeX : 1,
			sizeY : 1,
			row : 1,
			col : 1,
			title: '',
			body: [{
				displayed: true,
				type:'plainText',
				tabCount:0,
				content:''
			}],
			category:1,
			gaze: false, 
			wristwatch: false, 
			addcell:false, 
			list: true
		}, function(err, todo) {
			if (err) res.send(err);

			Cellular.find(function(err, todos) {
				if (err) res.send(err)
				res.json(todos);
			});
		});
	});

	app.post('/api/cellUpdate', function(req, res) {
		Cellular.findOneAndUpdate({
			'_id': req.body.theCell
		},{
			'body': req.body.theBits
		}, function(err, todo) {
			if (err)
				res.send(err);

			Cellular.find({
				'_id': req.body.theCell
			},function(err, CELLs) {
				if (err) res.send(err)
				res.json(CELLs);
			});
		});
	});

	app.post('/api/remove/:id', function(req, res) {
		Cellular.remove({
			_id : req.params.id
		}, function(err, todo) {
			if (err)
				res.send(err);

			Cellular.find(function(err, todos) {
				if (err) res.send(err)
				res.json(todos);
			});
		});
	});

	// application -------------------------------------------------------------
	app.get('*', function(req, res) {  
		res.sendfile('index.html');
	});

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
console.log("At the tone the time will be: " + new Date());





