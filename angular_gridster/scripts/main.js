'use strict';

var cellular; 
var cellCheck;

angular.module('app', [
	'gridster'
])

.controller('MainCtrl', function($scope, $http, $interval) {
	$scope.gridsterOpts = {
		margins: [10, 10],
		mobileBreakPoint: 600,
		columns: 5,
		defaultSizeX: 1,
		defaultSizeY: 1
	};

	$http.get('/api/testData')
		.success(function(data) {
			cellular = data;
			$scope.cells = cellular
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	var lazyUpdater = _.debounce(function(payload){
		$http.post('/api/collect', payload)
		   .success(function(data) {
			   	console.log(data);
		   })
		   .error(function(data) {
			   	console.log('Error: ' + data);
		   });
	}, 500);

	$scope.$watch('cells', function(items){
		cellCheck = items;
		lazyUpdater(items);
	}, true);

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

	var shift = 'https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=4cbc92b0a8b872e25b943667cdeb225d&format=json&nojsoncallback=1&auth_token=72157643803052984-54b4d0a7350d52af&api_sig=b12942fe1d566ce4d2687cd6e7d03e99';

	$http.get(shift)
		.success(function(data) {
			var getThisOne =  Math.floor(Math.random() * (100 - 0 + 1)) + 0;

			var gazeList = data.photos.photo;
			var stare = gazeList[getThisOne];

			var pull = 'http://farm' + stare.farm + '.staticflickr.com/' + stare.server + '/' + stare.id + '_' + stare.secret + '.jpg'

			$scope.gaze = 'url(' + pull + ')';

			console.log('url(' + pull + ');')
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	

	//WRISTWATCH

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

	$interval(getWeather, 100000);
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

})







