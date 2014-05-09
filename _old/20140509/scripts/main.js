'use strict';

var cellular; 
var cellCheck;
var retryUpdate;

angular.module('app', [
	'gridster',
	'ngCookies'
])

.controller('MainCtrl', function($scope, $http, $interval, $cookieStore) {
	$scope.gridsterOpts = {
		margins: [10, 10],
		mobileBreakPoint: 768,
		columns: 5,
		defaultSizeX: 1,
		defaultSizeY: 1
	};

	var initialGet = function(){
		$http.get('/api/testData')
			.success(function(data) {
				cellular = data;
				$scope.cells = cellular;
				localStorage.setItem('traject' , JSON.stringify(cellular) );
				console.log(cellular)
				$scope.status = 'online';
			})
			.error(function(data) {
				cellular = JSON.parse(localStorage.getItem('traject'));
				$scope.cells = cellular;
				$scope.status = 'local';
				console.log('Error: ' + data);
			});
	}

	var storedStatus

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
			}, 2000);
		}
	}else{
		$cookieStore.put('status','online');
		initialGet();
	}


	var lazyUpdater = _.debounce(function(payload){
		var thePackage = payload;
		localStorage.setItem('traject' , JSON.stringify(thePackage) );

		console.log(thePackage)

		console.log(cellular)

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
			   	}, 2000);
		   });
	}, 250);

	$scope.$watch('cells', function(items){
		console.log(items)
		cellular = items;
		lazyUpdater(cellular);
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

	$scope.textArea = function(e){
		// console.log(e.keyCode)

		if (e === 13){




		}
	}

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

})

// .directive('aTextArea', function() {
//   return {
//     require: 'ngModel',
//     link: function(scope, element, attrs, ctrl) {
//       // view -> model
//       element.bind('blur', function() {
//         scope.$apply(function() {
//           ctrl.$setViewValue(element.html());
//         });
//       });

//       // model -> view
//       ctrl.$render = function() {
//         element.html(ctrl.$viewValue);
//       };

//       // load init value from DOM
//       ctrl.$render();
//     }
//   };
// });







