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
		defaultSizeY: 1,
		draggable: {
			handle: '.grab', // optional selector for resize handle
		}
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


	// $scope.buildBits = function() {

	//   var returnArr = [];

	//   angular.forEach(cellular, function(valueC, keyC) {
	//       angular.forEach(key.body, function(Bvalue, Bkey) {
	//         this.push( {

	// 			content:'this is some text'

	//         });            
	//       }, returnArr);
	//   }, returnArr);

	//    //apply sorting logic here

	//   return returnArr;
	// };

	// $scope.listBits = $scope.buildBits();


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
			   	}, 10000);
		   });
	}, 250);

	$scope.$watch('cells', function(items){
		// console.log(items)
		// cellular = items;
		// lazyUpdater(cellular);
	}, true);

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

	$scope.$watch('textArea', function(items){
		console.log(items)
		// console.log(items)
		// cellular = items;
		// lazyUpdater(cellular);
	}, true);

	//TODO: TURN BACK ON LOL

	// var shift = 'https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=fb4e9edf281bc73c80eb89e1f847b465&format=json&nojsoncallback=1';
	// var gazeList;

	// $http.get(shift)
	// 	.success(function(data) {
	// 		gazeList = data.photos.photo;
	// 		getGaze();
	// 	})
	// 	.error(function(data) {
	// 		console.log('Error: ' + data);
	// 	});

	// var getGaze = function(){
	// 	var getThisOne =  Math.floor(Math.random() * (100 - 0 + 1)) + 0;
	// 	var stare = gazeList[getThisOne];
	// 	var pull = 'http://farm' + stare.farm + '.staticflickr.com/' + stare.server + '/' + stare.id + '_' + stare.secret + '.jpg'
	// 	$scope.gaze = 'url(' + pull + ')';
	// }

	// $interval(getGaze, 600000);

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


	$scope.cellEditBody = function(e){
		// console.log();
		$(e.target).find('li').last().focus()
	}
})

.directive('contenteditable', function($http) {

	var granularLazyUpdater = _.debounce(function(cell, bit, content){
		var thePackage = {
			theCell : cell,
			theBit : bit,
			theContent : content
		};
		localStorage.setItem('traject' , JSON.stringify(thePackage) );

		// console.log(thePackage)

		// console.log(cellular)

		$http.post('/api/updateBit', thePackage)
		   .success(function(data) {
			   	console.log(data);
			   	console.log('yeah!');
		   })
		   .error(function(data) {
			   	console.log('Error: ' + data);
			   	console.log('oh no!');
		   });
	}, 200);



    return {
        require: 'ngModel',
        link: function(scope, elem, attrs, ctrl) {
            elem.bind('keydown', function(e){
            	var that = this;

            	if (e.keyCode === 8){
            		e.preventDefault();
            	}else if (e.keyCode === 13){
            		e.preventDefault();
            	}else{
            		var theCell = that.parentNode.parentNode.parentNode.getAttribute('data-cellid');
            		var theBit = that.getAttribute('data-bitid');
            		var theContent = that.innerHTML;

            		granularLazyUpdater(theCell, theBit, theContent);
            	}
            });

            elem.bind('blur', function() {
            	
            });

            // model -> view
            ctrl.$render = function() {
                console.log('here!')
                // elem.html(ctrl.$viewValue);
            };

            // load init value from DOM
            // ctrl.$setViewValue(elem.html());
        }
    };
});

// .directive("contenteditable", function() {
//   return {
//     restrict: "A",
//     require: "ngModel",
//     link: function(scope, element, attrs, ngModel) {

//       function read() {
//         ngModel.$setViewValue(element.html());
//       }

//       ngModel.$render = function() {
//         element.html(ngModel.$viewValue || "");
//       };

//       element.bind("blur keyup change", function() {
//         scope.$apply(read);
//       });

//       // read();
//     }
//   };
// });







