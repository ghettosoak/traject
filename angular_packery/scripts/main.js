'use strict';

var cellular; 
var retryUpdate;
var wide = 5;
var sterGrid;

var populator

var app = angular.module('app', [
	'ngCookies',
	'ui.utils',
	'ui.sortable'
])

.controller('MainCtrl', function($scope, $http, $interval, $cookieStore) {

	// console.log($gridster);



	populator = function(){
		$http.post('/api/populator')
		   .success(function(data) {
			   	console.log(data);
			   	// console.log('CELLULAR UPDATE');
			   	// $scope.status = 'online';

			   	// $cookieStore.put('status','online');
			   	// clearInterval(retryUpdate);
		   })
		   .error(function(data) {
			   	console.log('Error: ' + data);
			   	// console.log('oh no!');
			   	// $scope.status = 'local';
			   	// $cookieStore.put('status','local');

			   	// retryUpdate = setInterval(function(){
			   	// 	lazyUpdater(thePackage);
			   	// }, 10000);
		   });
	}


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
			   	console.log('CELLULAR UPDATE');
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

	// sterGrid = $scope.gridsterOpts = {
	// 	margins: [10, 10],
	// 	// mobileBreakPoint: 768,
	// 	columns: 3,
	// 	// minColumns:3,
	// 	defaultSizeX: 1,
	// 	defaultSizeY: 1,
	// 	// colWidth:200, 
	// 	draggable: {
	// 		handle: '.grab',
	// 		start: function(event, uiWidget, $element) {
	// 			event.stopPropagation();
	// 		},
	// 		stop: function(event, uiWidget, $element) {
	// 			lazyUpdater(cellular);
	// 		}
	// 	},
	// 	resizable: {
	// 		stop: function(event, uiWidget, $element) {
	// 			console.log('RESIZED')
	// 			lazyUpdater(cellular);
	// 		}
	// 	},
	// };

	console.log($scope)

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
			   	console.log('GRANULAR UPDATE');
		   })
		   .error(function(data) {
			   	console.log('Error: ' + data);
			   	console.log('oh no!');
		   });
	}, 200);

	// $scope.cellSort = {
	//     // axis: 'y',
	//     start: function(e, ui) {
	//     	e.stopPropagation();
	//     },
	//     update: function(e, ui) {
	//   //   	console.log(e)
	//   //   	console.log(ui)
	//   //   	var that = e;
	//   //   	var theCell = that.target.parentNode.getAttribute('data-cellid');
	//   //   	var theCellIndex;
	//   //   	for (var i in cellular){
	// 		// 	if (cellular[i]._id == theCell) theCellIndex = i;
	// 		// }
	//   //   	cellUpdater(theCell, theCellIndex);
	//     }
	// };

	$scope.textSort = {
	    axis: 'y',
	    start: function(e, ui) {
	    	e.stopPropagation();
	    },
	    update: function(e, ui) {
	    	console.log(e)
	    	console.log(ui)
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

	$scope.bitKiller = function(e){
		var that = e;

		var theCell = that.target.parentNode.parentNode.parentNode.parentNode.getAttribute('data-cellid');

    	var theCellIndex;

    	// WHICH CELL ARE WE IN
    	for (var i in cellular){
			if (cellular[i]._id == theCell) theCellIndex = i;
		}

		var theSentencedIndex = that.target.parentNode.parentNode.getAttribute('data-index')

		$(that.target).parent().prev('.textarea-container').find('textarea').focus();

		localStorage.setItem('traject' , JSON.stringify(thePackage) );

		cellular[theCellIndex].body.splice(theSentencedIndex, 1);

		cellUpdater(theCell, theCellIndex);
	}

	var map = [];

	$scope.areaText = function(e, bit){
    	var that = e;

    	map[that.keyCode] = that.type == 'keydown';

		var theCell = that.target.parentNode.parentNode.parentNode.getAttribute('data-cellid');

    	var theCellIndex;

    	// WHICH CELL ARE WE IN
    	for (var i in cellular){
			if (cellular[i]._id == theCell) theCellIndex = i;
		}

		// GET CARET
		var currentCaret = $(that.target)[0].selectionStart;
		var theValue = that.target.value;

		var $theSizer = $(that.target).siblings('.sizer')

		$theSizer.html(
			theValue.substring(0, currentCaret) + 
			'<span class="hiddenCaret"></span>' + 
			theValue.substring(currentCaret, theValue.length)
		)

		if (map[8] && (that.target.value == '')){ // DELETE WHEN EMPTY
			that.preventDefault();

			var theSentencedIndex = that.target.parentNode.getAttribute('data-index')

			$(that.target).parent().prev('.textarea-container').find('textarea').focus();

			cellular[theCellIndex].body.splice(theSentencedIndex, 1);
		}

    	else if (map[13]){ // ENTER KEY
    		that.preventDefault();

    		var theNewIndex = parseInt(that.target.parentNode.getAttribute('data-index')) + 1;

    		console.log(cellular[theCellIndex].body.indexOf(bit))

			var theNewBit = {
				displayed: true,
				type:'plainText',
				tabCount:0,
				content:''
			};

			cellular[theCellIndex].body.splice(theNewIndex, 0, theNewBit);

			setTimeout(function(){
				$(that.target).parent().next('.textarea-container').find('textarea').focus();
			}, 50);
		}

		else if (map[9] && map[16]){ // SHIFT + TAB
			that.preventDefault();

			var theIndentingIndex = that.target.parentNode.getAttribute('data-index')
			if (cellular[theCellIndex].body[theIndentingIndex].tabCount > 0)
				cellular[theCellIndex].body[theIndentingIndex].tabCount --;
		}

		else if (map[9]){ // TAB
			that.preventDefault();

			var theIndentingIndex = that.target.parentNode.getAttribute('data-index')
			if (cellular[theCellIndex].body[theIndentingIndex].tabCount < 2)
				cellular[theCellIndex].body[theIndentingIndex].tabCount ++;
		}		

		else if (map[38]){ // UP ARROW

			if ($theSizer.find('.hiddenCaret').position().top < 14){
				that.preventDefault();

				var $prevTA = $(that.target).parent().prev('.textarea-container').find('textarea');
				
				var prevTACount = $prevTA.val().length;

				console.log(prevTACount-currentCaret);

				$prevTA.focus()[0]
				.setSelectionRange(10000, 10000);
			}

		}

		else if (map[40]){ // DOWN ARROW

			if ($theSizer.find('.hiddenCaret').position().top > $theSizer.height() - 28){
				that.preventDefault();

				var $nextTA = $(that.target).parent().next('.textarea-container').find('textarea');
				
				var nextTACount = $nextTA.val().length;

				console.log(nextTACount-currentCaret);

				$nextTA.focus()[0]
				.setSelectionRange(nextTACount-currentCaret, nextTACount-currentCaret);
			}

		}

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

	$scope.init = function(e){
		console.log(e)
	}

	$scope.$on('$viewContentLoaded', function(e) {
	    console.log(e)
	});
})

.directive('resizable', function($window) {
	return function($scope) {
		$scope.initializeWindowSize = function() {
			$scope.windowHeight = $window.innerHeight;
			$scope.windowWidth  = $window.innerWidth;
			console.log('WHOA')
		};
		angular.element($window).bind("resize", function() {
			$scope.initializeWindowSize();
			$scope.$apply();

			
		});
		$scope.initializeWindowSize();
	}
})

.directive('workspace', ['$rootScope', function($rootScope) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            // console.log('Running dannyPackery linking function!');
            if($rootScope.packery === undefined || $rootScope.packery === null){
                // console.log('making packery!');
                $rootScope.packery = new Packery(element[0].parentElement, {
                	gutter: 10,
                	columnWidth: 200,
					rowHeight: 200
                });
                $rootScope.packery.bindResize();
                $rootScope.packery.appended(element[0]);
                $rootScope.packery.items.splice(1,1); // hack to fix a bug where the first element was added twice in two different position
            }
            else{
                $rootScope.packery.appended(element[0]);
            }
            $rootScope.packery.layout();

            console.log(JSON.parse(attrs.dimensions))

            var $draggable = $(element[0]).draggable({
            	handle:'.grab',
            	stop: function() {
            		
				}
            }).resizable({
            	grid:210,
            	stop: function() {

				}
            });

			$rootScope.packery.bindUIDraggableEvents($draggable);

			var resizeTimeout;
			$draggable.on( 'resize', function( event, ui ) {
				if ( resizeTimeout ) {
					clearTimeout( resizeTimeout );
				}

				resizeTimeout = setTimeout( function() {
					$rootScope.packery.fit( ui.element[0] );
				}, 100 );
			});
        }
    };
}]);



