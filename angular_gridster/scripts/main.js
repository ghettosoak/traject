'use strict';

var cellular; 
var retryUpdate;

angular.module('app', [
	'gridster',
	'ngCookies',
	'ui.utils',
	'ui.sortable'
])

.controller('MainCtrl', function($scope, $http, $interval, $cookieStore) {


	var initialGet = function(){
		$http.get('/api/testData')
			.success(function(data) {
				cellular = data;
				$scope.cells = cellular;
				localStorage.setItem('traject' , JSON.stringify(cellular) );
				console.log($scope.cells)
				$scope.status = 'online';
			})
			.error(function(data) {
				cellular = JSON.parse(localStorage.getItem('traject'));
				$scope.cells = cellular;
				$scope.status = 'local';
				console.log('Error: ' + data);
			});
	}

	var storedStatus;

	if ($cookieStore.get('status') !== undefined){

		storedStatus = $cookieStore.get('status');
		console.log(storedStatus);

		if (storedStatus === 'online'){
			initialGet();			
		}else{
			cellular = JSON.parse(localStorage.getItem('traject'));
			$scope.cells = cellular;
			$scope.status = 'local';

			retryUpdate = setInterval(function(){
				lazyUpdater(cellular);
			}, 10000);
		}
	}else{
		$cookieStore.put('status','online');
		initialGet();
	}

	var lazyUpdater = _.debounce(function(payload){
		var thePackage = payload;
		localStorage.setItem('traject' , JSON.stringify(thePackage) );

		$http.post('/api/collect', thePackage)
		   .success(function(data) {
			   	console.log(data);
			   	console.log('yeah!');
			   	$scope.status = 'online';

			   	$cookieStore.put('status','online');
			   	clearInterval(retryUpdate);
		   })
		   .error(function(data) {
			   	console.log('Error: ' + data);
			   	console.log('oh no!');
			   	$scope.status = 'local';
			   	$cookieStore.put('status','local');

			   	retryUpdate = setInterval(function(){
			   		lazyUpdater(thePackage);
			   	}, 10000);
		   });
	}, 250);

	$scope.gridsterOpts = {
		margins: [10, 10],
		mobileBreakPoint: 768,
		columns: 5,
		defaultSizeX: 1,
		defaultSizeY: 1,
		draggable: {
			handle: '.grab',
			start: function(event, uiWidget, $element) {
				event.stopPropagation();
			},
			stop: function(event, uiWidget, $element) {
				lazyUpdater(cellular);
			}
		}
	};

	setInterval(function(){
		lazyUpdater(cellular);
	}, 300000);

	window.onbeforeunload = function(e) {
		lazyUpdater(cellular);
	};

	$scope.addCell = function(){
		$http.post('/api/add')
		   .success(function(data) {
				cellular = data;
				$scope.cells = cellular
		   })
		   .error(function(data) {
			   	console.log('Error: ' + data);
		   });
	}

	$scope.removeCell = function(id) {
		$http.post('/api/remove/' + id)
			.success(function(data) {
				cellular = data;
				$scope.cells = cellular
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};



	// GAZE.JS

	//TODO: TURN BACK ON LOL

	var shift = 'https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=fb4e9edf281bc73c80eb89e1f847b465&format=json&nojsoncallback=1';
	var gazeList;

	$http.get(shift)
		.success(function(data) {
			gazeList = data.photos.photo;
			getGaze();
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	var getGaze = function(){
		var getThisOne =  Math.floor(Math.random() * (100 - 0 + 1)) + 0;
		var stare = gazeList[getThisOne];
		var pull = 'http://farm' + stare.farm + '.staticflickr.com/' + stare.server + '/' + stare.id + '_' + stare.secret + '.jpg'
		$scope.gaze = 'url(' + pull + ')';
	}

	$interval(getGaze, 600000);



	// WRISTWATCH.JS

	var getWeather = function(){
		$http.get('http://api.openweathermap.org/data/2.5/weather?q=bern,ch')
		.success(function(data) {
			console.log(data)
			$scope.temp = (data.main.temp - 273).toFixed(1);
			
			var theEarth = moment();
			var theSun = moment.utc(data.sys.sunrise).format()
			var theMoon = moment.utc(data.sys.sunset).format()

			var theLight;

			if (theEarth.isAfter(theSun) && theEarth.isBefore(theMoon)) theLight = 'day'
				else theLight = 'night';

			$scope.weather = 'w_' + theLight + '_' + data.weather[0].id;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	}

	$interval(getWeather, 600000);
	getWeather();

	$interval(function(){
		$scope.time = moment(new Date()).format('H:mm:ss')
	}, 1000);

	$scope.today = function(){
		return moment(new Date()).format('dddd')
	}

	$scope.date = function(){
		return moment(new Date()).format('D MMMM, YYYY')
	}



	// BITS.JS

	$scope.cellEditBody = function(e){
		var el = $(e.target).find('.textarea-container').last().find('textarea')[0]

		if (typeof el.selectionStart == "number") {
	        el.selectionStart = el.selectionEnd = el.value.length;
	    } else if (typeof el.createTextRange != "undefined") {
	        el.focus();
	        var range = el.createTextRange();
	        range.collapse(false);
	        range.select();
	    }
	}

	var cellUpdater = _.debounce(function(cell, cellIndex){
		var thePackage = {
			theCell : cell, 
			theBits : cellular[cellIndex].body
		};

		$http.post('/api/cellUpdate', thePackage)
		   .success(function(data) {
			   	console.log(data);
			   	console.log('yeah!');
		   })
		   .error(function(data) {
			   	console.log('Error: ' + data);
			   	console.log('oh no!');
		   });
	}, 200);

	$scope.sortableOptions = {
	    axis: 'y',
	    start: function(e, ui) {
	    	e.stopPropagation();
	    },
	    update: function(e, ui) {
	    	var that = e;
	    	var theCell = that.target.parentNode.getAttribute('data-cellid');
	    	var theCellIndex;
	    	for (var i in cellular){
				if (cellular[i]._id == theCell) theCellIndex = i;
			}
	    	cellUpdater(theCell, theCellIndex);
	    }
	  };

	$scope.cellTitle = function(e){
		lazyUpdater(cellular);
	};

	$scope.areaText = function(e){
    	var that = e;

		var theCell = that.target.parentNode.parentNode.parentNode.getAttribute('data-cellid');

    	var theCellIndex;

    	for (var i in cellular){
			if (cellular[i]._id == theCell) theCellIndex = i;
		}

		if ((that.keyCode === 8) && (that.target.value == '')){
			that.preventDefault();

			var theSentencedIndex = that.target.parentNode.getAttribute('data-index')

			$(that.target).parent().prev('.textarea-container').find('textarea').focus();

			cellular[theCellIndex].body.splice(theSentencedIndex, 1);
		}

    	if (that.keyCode === 13){
    		that.preventDefault();

    		var theNewIndex = that.target.parentNode.getAttribute('data-index') + 1

			var theNewBit = {
				displayed: true,
				type:'plainText',
				content:''
			};

			cellular[theCellIndex].body.splice(theNewIndex, 0, theNewBit);

			$(that.target).parent().next('.textarea-container').find('textarea').focus();
		}

		// if (that.keyCode === )

		cellUpdater(theCell, theCellIndex);
	}

	

	// CATEGORICAL.JS

	$scope.catSelector = function(e, newCat){

		console.log('WHAT')
    	var that = e;

		that.preventDefault();
		that.stopPropagation();

		var theCell = that.target.parentNode.parentNode.parentNode.getAttribute('data-cellid');

    	var theCellIndex;

    	for (var i in cellular){
			if (cellular[i]._id == theCell){
				cellular[i].category = newCat;
			}
		}

		lazyUpdater(cellular);
	}
})





