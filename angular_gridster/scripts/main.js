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


	// var initialGet = function(){
		$http.get('/api/testData')
			.success(function(data) {
				cellular = data;
				$scope.cells = cellular;
				// localStorage.setItem('traject' , JSON.stringify(cellular) );
				console.log($scope.cells)
				$scope.status = 'online';
			})
			.error(function(data) {
				// cellular = JSON.parse(localStorage.getItem('traject'));
				// $scope.cells = cellular;
				// $scope.status = 'local';
				console.log('Error: ' + data);
			});
	// }

	var storedStatus;

	if ($cookieStore.get('status') !== undefined){

		// storedStatus = $cookieStore.get('status');
		// console.log(storedStatus);

		if (storedStatus === 'online'){
			// initialGet();			
		}else{
			// cellular = JSON.parse(localStorage.getItem('traject'));
			// $scope.cells = cellular;
			// $scope.status = 'local';

			// retryUpdate = setInterval(function(){
			// 	lazyUpdater(cellular);
			// }, 10000);
		}
	}else{
		// $cookieStore.put('status','online');
		// initialGet();
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

	$scope.gridsterOpts = {
		margins: [10, 10],
		mobileBreakPoint: 768,
		columns: 5,
		defaultSizeX: 1,
		defaultSizeY: 1,
		draggable: {
			handle: '.grab',
			stop: function(event, uiWidget, $element) {
				lazyUpdater(cellular);
			}
		}
	};

	setInterval(function(){
		lazyUpdater(cellular);
	}, 300000);

	// window.onbeforeunload = function(e) {
	// 	lazyUpdater(cellular);
	// };

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

	// $scope.$watch('textArea', function(items){
	// 	console.log(items)
	// 	// console.log(items)
	// 	// cellular = items;
	// 	// lazyUpdater(cellular);
	// }, true);

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
		$(e.target).find('.textarea-container').last().find('textarea').focus()
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
	    update: function(e, ui) {
	    	var that = e;
	    	var theCell = that.target.parentNode.getAttribute('data-cellid');
	    	var theCellIndex;
	    	for (var i in cellular){
				if (cellular[i].cellID == theCell) theCellIndex = i;
			}
	    	cellUpdater(theCell, theCellIndex);
	    }
	  };


	$scope.killBit = function(e){
		console.log(e)

	};

	$scope.cellTitle = function(e){
		lazyUpdater(cellular);

		var that = e;

		var theCell = that.target.parentNode.parentNode.parentNode.getAttribute('data-cellid');

		// cellUpdater(theCell, theCellIndex);
	};

	$scope.areaText = function(e){
    	var that = e;

		var theCell = that.target.parentNode.parentNode.parentNode.getAttribute('data-cellid');

    	var theCellIndex;

    	for (var i in cellular){
			if (cellular[i].cellID == theCell) theCellIndex = i;
		}

		if ((that.keyCode === 8) && (that.target.value == '')){
			that.preventDefault();

			var theSentencedIndex = that.target.parentNode.getAttribute('data-index')

			$(that.target).parent().prev('.textarea-container').find('textarea').focus();

			cellular[theCellIndex].body.splice(theSentencedIndex, 1);

		}

		console.log(e)

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

		cellUpdater(theCell, theCellIndex);

	}


})

// .directive('areaText', function(){
// 	return {
// 	        require: 'ngModel',
// 	        // scope:true,
// 	        link: function(scope, elem, attrs, ctrl) {


// 	        	elem.bind('keydown', function(e){
// 	        		console.log(elem)
// 	        	})
// 	        }
// 	    }
// })

// .directive('contenteditable', function($http) {

// 	// var bitAdder = _.debounce(function(cell, newBit, newIndex, newCount){
// 	// 	var thePackage = {
// 	// 		theCell : cell,
// 	// 		theNewBit: newBit,
// 	// 		theNewIndex : newIndex,
// 	// 		theNewBitCount : newCount
// 	// 	};

// 	// 	$http.post('/api/addBit', thePackage)
// 	// 	   .success(function(data) {
// 	// 		   	console.log(data);
// 	// 		   	console.log('yeah!');
// 	// 	   })
// 	// 	   .error(function(data) {
// 	// 		   	console.log('Error: ' + data);
// 	// 		   	console.log('oh no!');
// 	// 	   });
// 	// }, 200);

// 	// var granularLazyUpdater = _.debounce(function(cell, bit, content){
// 	// 	var thePackage = {
// 	// 		theCell : cell,
// 	// 		theBit : bit,
// 	// 		theContent : content
// 	// 	};

// 	// 	$http.post('/api/updateBit', thePackage)
// 	// 	   	.success(function(data) {
// 	// 		   	console.log(data);
// 	// 		   	console.log('yeah!');
// 	// 	   	})
// 	// 	   	.error(function(data) {
// 	// 		   	console.log('Error: ' + data);
// 	// 		   	console.log('oh no!');
// 	// 	   	});
// 	// }, 200);

// 	var cellUpdater = _.debounce(function(cell, cellIndex){
// 		var thePackage = {
// 			theCell : cell, 
// 			theBits : cellular[cellIndex].body
// 		};
// 		$http.post('/api/cellUpdate', thePackage)
// 		   .success(function(data) {
// 			   	console.log(data);
// 			   	console.log('yeah!');
// 		   })
// 		   .error(function(data) {
// 			   	console.log('Error: ' + data);
// 			   	console.log('oh no!');
// 		   });
// 	}, 200);

//     return {
//         require: 'ngModel',
//         // scope:true,
//         link: function(scope, elem, attrs, ctrl) {

//         	console.log('DIRECTED!')

//         	elem.bind('mousedown', function(e){
//         		console.log(e)
//         		this.focus();
//         	})



//             elem.bind('keydown', function(e){

//             	// console.log(document.activeElement)

//             	var that = this;

//         		var theCell = that.parentNode.parentNode.parentNode.getAttribute('data-cellid');

//         		// console.log(scope.cells)

//         		// var theContent = [];

//         		// for (var i in elem[0].children){
//         		// 	theContent[i] = elem[0].children[i].innerHTML;

//         		// }

//         		// granularLazyUpdater(theCell, theContent);

//             	// if (e.keyCode === 8){
//             	// }

//             	var theCellIndex;

//             	for (var i in cellular){
//         			if (scope.cells[i].cellID == theCell) theCellIndex = i;
//     			}

//             	if (e.keyCode === 13){
//             		e.preventDefault();

//             		var theNewIndex = $(elem).index() + 1;

//             		// var theOrder = parseInt(that.getAttribute('data-order'));

//             		// console.log('THE ORDER = ' + theOrder);

//     				// var theNewBitCount = scope.cells[theCellIndex].bitCount++;

//     				var theNewBit = {
// 				 		// bitID:theNewBitCount,
// 			 			opened: new Date(),
// 						closed: null,
// 						displayed: true,
// 						// order: theOrder,
// 						type:'plainText',
// 						content:''
// 					};

// 					scope.cells[theCellIndex].body.splice(theNewIndex, 0, theNewBit)

// 					// // scope.$apply();
				
//     	// 			// scope.cells[theCellIndex].body.push(theNewBit);

//             		// bitAdder(theCell, theNewBit, theNewIndex, theNewBitCount);
//             		// cellUpdater(theCellIndex)
//             	}
//             	// else{
//             	// 	var theBit = that.getAttribute('data-bitid');
//             		var theContent = that.innerHTML//.slice(13);

//             	// 	console.log(theBit)

//             		// granularLazyUpdater(theCell, theBit, theContent);

//             		// scope.cells[theCellIndex].body
//             		// scope.$apply();

//             		// scope.$apply(function() {
//                         // ctrl.$setViewValue(elem.html());
//                     // });

// 					var thisBitHere = that.getAttribute('data-index');

// 					console.log(thisBitHere)

// 					// scope.$apply(function() {
// 	    //                 ctrl.$setViewValue(elem.html());
// 	    //             });

//                     // scope.cells[theCellIndex].body[thisBitHere].content = that.innerHTML;
//             		cellUpdater(theCell, theCellIndex);
//             	// }
//             });


// // scope.$watch(scope.cells);

//             elem.bind('blur', function() {
            	
//             });

//             // model -> view
//             ctrl.$render = function() {
//             	console.log(ctrl.$viewValue)
//                 elem.html(ctrl.$viewValue);
//             };

//             // load init value from DOM
//             ctrl.$setViewValue(elem.html());
//         }
//     };
// })

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







