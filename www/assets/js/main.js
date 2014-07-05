'use strict';

var cellular; 
var retryUpdate;
var columnCount = 1;
var sterGrid;

var GRIDSIZE = 200;
var GUTTERSIZE = 10;

var victim;

var populator;

var returnEmail;
var returnPass;


var signingUp = false;
var signingIn = false;

var signupCount = 0;

var externalStartUpIndex;

var $theFace;
var $theFaceOrigPos;

var theContainer = document.getElementById('ng-app');

var addFlag;

var randomizr = function(){ 
	return Math.floor(Math.random() * (1000000000 - 0 + 1)) + 0; 
}

var hoodie  = new Hoodie();
window.hoodie = hoodie;

var lazyUpdater = _.debounce(function(id){

	for (var i in cellular){
		if (cellular[i].id === id){
			hoodie.store.update('cell', cellular[i].id, {dimensions : cellular[i].dimensions})
			hoodie.store.update('cell', cellular[i].id, {title : cellular[i].title})
			hoodie.store.update('cell', cellular[i].id, {category : cellular[i].category})
			hoodie.store.update('cell', cellular[i].id, {displayed : cellular[i].displayed})
			hoodie.store.update('cell', cellular[i].id, {body : cellular[i].body})
				.done(function(object){
					console.log(object);
					console.log(id+' LAZILY UPDATED')

					addFlag = object.id;
				})
		}
	}

}, 1000);

var analyzr = function(){
	$.ajax({
		type: "POST",
		dataType:'JSON',
		data:{project:which},
		url: "php/analyzr.php"
	}).done(function(cellular){

	});
}

var columnCounter = function(){
	if (window.innerWidth > (((GRIDSIZE + GUTTERSIZE) * 1) + 60) ) columnCount = 1;
	if (window.innerWidth > (((GRIDSIZE + GUTTERSIZE) * 2) + 60) ) columnCount = 2;
	if (window.innerWidth > (((GRIDSIZE + GUTTERSIZE) * 3) + 60) ) columnCount = 3;
	if (window.innerWidth > (((GRIDSIZE + GUTTERSIZE) * 4) + 60) ) columnCount = 4;
	if (window.innerWidth > (((GRIDSIZE + GUTTERSIZE) * 5) + 60) ) columnCount = 5;
	if (window.innerWidth > (((GRIDSIZE + GUTTERSIZE) * 6) + 60) ) columnCount = 6;
	if (window.innerWidth > (((GRIDSIZE + GUTTERSIZE) * 7) + 60) ) columnCount = 7;
	if (window.innerWidth > (((GRIDSIZE + GUTTERSIZE) * 8) + 60) ) columnCount = 8;
	if (window.innerWidth > (((GRIDSIZE + GUTTERSIZE) * 9) + 60) ) columnCount = 9;
	if (window.innerWidth > (((GRIDSIZE + GUTTERSIZE) * 10) + 60) ) columnCount = 10;
	if (window.innerWidth > (((GRIDSIZE + GUTTERSIZE) * 11) + 60) ) columnCount = 11;
	if (window.innerWidth > (((GRIDSIZE + GUTTERSIZE) * 12) + 60) ) columnCount = 12;
	if (window.innerWidth > (((GRIDSIZE + GUTTERSIZE) * 13) + 60) ) columnCount = 13;

	console.log('columnCount = '+columnCount);
}


var app = angular.module('app', [
	'ngCookies',
	'ui.utils',
	'ui.sortable'
])

.controller('MainCtrl', function($window, $scope, $http, $interval, $cookieStore) {

	$scope.areWeUpdating = false;

	$scope.versionCheck = function(){
		var updateItYo = _.once($scope.versionUpdater);

		console.log('looking for NOPE')

		for (var i in cellular){
			if ((cellular[i].list === true) && (cellular[i].displayed === undefined)){
			// if ((cellular[i].list === true) && (cellular[i].displayed === false)){
				console.log('NOPE found!')
				$('.weAreUpdating').addClass('letsUpdate')
				$scope.areWeUpdating = true;
				updateItYo();
			}
		}
	}

	$scope.versionUpdater = function(){
		console.log('WE\'RE UPDATING');

		for (var i in cellular){
			cellular[i].displayed = true;

			$scope.cells[i].displayed = true;

			hoodie.store.update('cell', cellular[i].id, {displayed: true})

			console.log('UPDATED ' + cellular[i].id);
		}	
	}


	columnCounter();

	$scope.threeOpen = false;
	$scope.fourOpen = false;

	$scope.startUpIndex = 'off';
	externalStartUpIndex = 'off';
	// $scope.startUpIndex = 0;
	// externalStartUpIndex = 0;

	$scope.isFocused = false;

	theContainer.className = 'modalClear';


	// SIGN UP

	// hoodie.account.signUp('m', 'f');

	$scope.signUp = function(e){
		if (
			( $scope.threeOpen === true ) && 
			( $(signUpForm.emailSignup).hasClass('ng-valid') )
		){

			// $scope.startUpIndex = 0;

			signingUp = true;
			signingIn = false;

			var newEmail = signUpForm.emailSignup.value;
			var newPass = signUpForm.passwordSignup.value;

			localStorage.setItem('user' , newEmail);
			localStorage.setItem('pass' , newPass);

			hoodie.account.signUp(newEmail, newPass);

			console.log(newEmail + ' /// ' + newPass)

		}else{
			$(signUpForm.emailSignup).focus()
		}
	};

	hoodie.account.on('signup', function (user) {

		$scope.cells = [];

		console.log(user)

		hoodie.store.add('cell', {
			dimensions:[ {}, {}, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 } ],
			gaze: true,
		}).done(function(object){
			$scope.cells.push(object);
			cellular = $scope.cells;
		});

		hoodie.store.add('cell', {
			dimensions:[ {}, {}, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 } ],
			wristwatch: true,
		}).done(function(object){
			$scope.cells.push(object);
			cellular = $scope.cells;
		});

		hoodie.store.add('cell', {
			dimensions:[ {}, {}, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 } ],
			addcell: true,
		}).done(function(object){
			$scope.cells.push(object);
			cellular = $scope.cells;
		});

		hoodie.store.add('cell', {
			dimensions:[ {}, {}, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 } ],
			title: '',
			body: [
				{
					displayed: true,
					type:'plainText',
					tabCount:0,
					content:'This is a bit.'
				},
				{
					displayed: true,
					type:'plainText',
					tabCount:0,
					content:'This is another bit!'
				},
				{
					displayed: true,
					type:'plainText',
					tabCount:0,
					content:'Here\'s another bit...'
				},
				{
					displayed: true,
					type:'plainText',
					tabCount:0,
					content:'And one more for good measure. :)'
				}
			],
			category:1,
			displayed:true,
			list: true
		}).done(function(object){
			$scope.cells.push(object);
			cellular = $scope.cells;

			theContainer.className = 'yesLetsGo';

			setTimeout(function(){
				theContainer.className = 'yesLetsGo upUpAndAway';
			}, 550)

			setTimeout(function(){
				theContainer.className = 'yesLetsGo upUpAndAway startingUp';
			}, 1000)
		});
	});


	// LOG IN

	$scope.signIn = function(){
		if (
			($scope.fourOpen === true)
			&& ( !$(signInForm).hasClass('ng-pristine') )
		){
			cellular = $scope.cells = [];
			// $scope.startUpIndex = 1;

			signingIn = true;
			signupCount = 4;

			returnEmail = signInForm.emailSignin.value;
			returnPass = signInForm.passwordSignin.value;

			hoodie.account.signIn(returnEmail, returnPass);

			console.log(returnEmail + ' /// ' + returnPass)
		}else{
			$(signInForm.emailSignin).focus()
		}
	};

	hoodie.account.on('signin', function (user) {

		if ( !signingUp && (signupCount == 4) ){

			localStorage.setItem('user' , returnEmail);
			localStorage.setItem('pass' , returnPass);

			hoodie.store.findAll()
				.done(function (objects) {
					objects.splice(0, 1)
					cellular = $scope.cells = objects;
					console.log(cellular)

					$scope.versionCheck();

					theContainer.className = 'yesLetsGo';

					setTimeout(function(){
						theContainer.className = 'yesLetsGo upUpAndAway modalClear';

						$(signInForm).parents('.four').removeClass('active')
						$scope.fourOpen = false;
					}, 550)
				});

		}
	});

	if (localStorage.getItem('user') !== null){

		var returnEmail = localStorage.getItem('user');
		var returnPass = localStorage.getItem('pass');

		hoodie.account.signIn(returnEmail, returnPass);

		console.log(returnEmail + ' /// ' + returnPass)

		hoodie.store.findAll()
			.done(function (objects) {
				// $scope.startUpIndex = 1;
				cellular = $scope.cells = objects//.splice(0, 1);
				console.log(cellular)

				$scope.versionCheck();

				theContainer.className = 'yesLetsGo upUpAndAway modalClear';
			});
	}

	$scope.logOut = function(e){
		hoodie.account.signOut();
	}

	hoodie.account.on('signout', function (user) {
		theContainer.className = '';
		localStorage.removeItem('user');
		localStorage.removeItem('pass');
		cellular = $scope.cells = [];
	});

	$scope.sidebarActivator = function(side){
		if (side){
			if ($scope.sidebarStatus === 'open') $scope.sidebarStatus = 'closed';
				else $scope.sidebarStatus = 'open';
		}else $scope.sidebarStatus = 'closed';
	};
	
	$scope.demo = function(){
		externalStartUpIndex = 1;
		$scope.startUpIndex = 1;
		
		$('.cellFace.list').eq(0).parent().addClass('showingList');
		$theFace = $('.showingList .cellFace');
		$theFaceOrigPos = $theFace.offset();

		$scope.sidebarStatus = 'closed';
	};

	$scope.changePassword = function(e){
		var $that = $(e.target).parent()

		var oldPass = passwordChange.oldPassword.value;
		var newPass = passwordChange.newPassword.value;
		hoodie.account.changePassword(oldPass, newPass);

		$that.addClass('actionComplete');

		setTimeout(function(){
			$that.removeClass('changingPassword');
		}, 3000);

		setTimeout(function(){
			$that.removeClass('actionComplete');
		}, 3200);
	};

	$scope.versionOpener = function(){
		theContainer.className = 'yesLetsGo upUpAndAway';

		setTimeout(function(){
			theContainer.className = 'yesLetsGo upUpAndAway viewingVersion';
		}, 5);
	};

	$scope.aboutOpener = function(){
		theContainer.className = 'yesLetsGo upUpAndAway';

		setTimeout(function(){
			theContainer.className = 'yesLetsGo upUpAndAway viewingAbout';
		}, 5);
	};

	$scope.modalCloser = function(){
		theContainer.className = 'yesLetsGo upUpAndAway';

		setTimeout(function(){
			theContainer.className = 'yesLetsGo upUpAndAway modalClear';
		}, 500);
	}




	// STARTUP.JS

	$scope.SUB_left = function(){
		if ($scope.startUpIndex === 0) {
			externalStartUpIndex = 'off';
			$scope.startUpIndex = 'off';
		}

		if ($scope.startUpIndex == 9){
			externalStartUpIndex = 1;
			$scope.startUpIndex = 1;
			
			$('.cellFace.list').eq(0).parent().addClass('showingList');
			$theFace = $('.showingList .cellFace');
			$theFaceOrigPos = $theFace.offset();

			$scope.startUpOrient = '';
			$scope.startUp_X = '50%';
			$scope.startUp_Y = '50%';
		}
	};

	$scope.SUB_right = function(){
		externalStartUpIndex++;
		$scope.startUpIndex++;

		console.log($scope.startUpIndex)

		if ($scope.startUpIndex === 1){			
			$('.cellFace.list').eq(0).parent().addClass('showingList')
			$theFace = $('.showingList .cellFace')
			$theFaceOrigPos = $theFace.offset()
		}

		if ($scope.startUpIndex === 3){
			setTimeout(function(){
				$scope.startUp_Y = $theFace.offset().top + $theFace.height() - 10;
			}, 500)
		}

		if ($scope.startUpIndex === 4){
			if (
				($theFaceOrigPos.left > 150)
			){
				$scope.startUpOrient = 'topRight';
				$scope.startUp_X = $theFaceOrigPos.left - 260;
				$scope.startUp_Y = $theFaceOrigPos.top + 210;
			}

			if (
				($theFaceOrigPos.left < 150)
			){
				$scope.startUpOrient = 'topLeft';
				$scope.startUp_X = $theFaceOrigPos.left + 210;
				$scope.startUp_Y = $theFaceOrigPos.top + 210;
			}
		}

		if ($scope.startUpIndex === 5){
			if (
				($theFace.offset().left > 150)
			){
				$scope.startUpOrient = 'topRight';
				$scope.startUp_X = $theFace.offset().left - 260;
				$scope.startUp_Y = $theFace.offset().top + $theFace.height() + 10;
			}

			if (
				($theFace.offset().left < 150)
			){
				$scope.startUpOrient = 'topLeft';
				$scope.startUp_X = $theFace.offset().left;
				$scope.startUp_Y = $theFace.offset().top + $theFace.height() + 10;
			}
		}

		if ($scope.startUpIndex === 6){
			if (
				($theFace.offset().left > 150)
			){
				$scope.startUpOrient = 'topRight';
				$scope.startUp_X = $theFace.offset().left - 250;
				$scope.startUp_Y = $theFace.offset().top + $theFace.height() + 10;
			}

			if (
				($theFace.offset().left < 150)
			){
				$scope.startUpOrient = 'topLeft';
				$scope.startUp_X = $theFace.offset().left;
				$scope.startUp_Y = $theFace.offset().top + $theFace.height() + 10;
			}
		}

		if (($scope.startUpIndex === 7) || ($scope.startUpIndex === 7)){
			$('.cellFace.list').eq(0).parent().addClass('showingList')
			$theFace = $('.cellFace.addCell')
			if (
				($theFace.offset().left > 150)
			){
				$scope.startUpOrient = 'topRight';
				$scope.startUp_X = $theFace.offset().left - 250;
				$scope.startUp_Y = $theFace.offset().top + $theFace.height() + 10;
			}

			if (
				($theFace.offset().left < 150)
			){
				$scope.startUpOrient = 'topLeft';
				$scope.startUp_X = $theFace.offset().left + 210;
				$scope.startUp_Y = $theFace.offset().top + $theFace.height() + 10;
			}
		}

		if ($scope.startUpIndex === 9){
			$scope.startUpOrient = 'leftLeft';
			$scope.startUp_X = 120;
			$scope.startUp_Y = ($(window).height() - 200) / 2;
		}

		if ($scope.startUpIndex === 10){
			externalStartUpIndex = 'off';
			$scope.startUpIndex = 'off';
		}
	};




	// ACTION / REACTION

	$scope.addCell = function(e){
		hoodie.store.add('cell', {
			dimensions:[
				{},
				{},
				{ sizeX: 1, sizeY: 1, row: 2, col: 2 },
				{ sizeX: 1, sizeY: 1, row: 2, col: 2 },
				{ sizeX: 1, sizeY: 1, row: 2, col: 2 },
				{ sizeX: 1, sizeY: 1, row: 2, col: 2 },
				{ sizeX: 1, sizeY: 1, row: 2, col: 2 },
				{ sizeX: 1, sizeY: 1, row: 2, col: 2 },
				{ sizeX: 1, sizeY: 1, row: 2, col: 2 },
				{ sizeX: 1, sizeY: 1, row: 2, col: 2 },
				{ sizeX: 1, sizeY: 1, row: 2, col: 2 },
				{ sizeX: 1, sizeY: 1, row: 2, col: 2 },
				{ sizeX: 1, sizeY: 1, row: 2, col: 2 },
				{ sizeX: 1, sizeY: 1, row: 2, col: 2 },
				{ sizeX: 1, sizeY: 1, row: 2, col: 2 },
				{ sizeX: 1, sizeY: 1, row: 2, col: 2 },
				{ sizeX: 1, sizeY: 1, row: 2, col: 2 }
			],
			title: '',
			body: [
				{
					displayed: true,
					type:'plainText',
					tabCount:0,
					content:''
				}
			],
			category:1,
			list: true,
			displayed: true
		}).done(function(object){
			console.log($scope.cells)
			$scope.cells.push(object)
			cellular = $scope.cells
			console.log($scope.cells)

			addFlag = object.id;

			if ($scope.startUpIndex === 8) $scope.SUB_right();
		})
	}

	$scope.reviver = function(){

		if (victim === 'cell'){

			var theLastKilledCell = JSON.parse(localStorage.getItem('lastRemovedCell'))
			console.log(theLastKilledCell)

			theLastKilledCell.displayed = true;

			$scope.cells.push(theLastKilledCell);

			if ($scope.startUpIndex === 7) $scope.SUB_right();
		}

		else if (victim === 'bit'){

			var theLastKilledBitParentID = localStorage.getItem('lastRemovedBitParentID')
			var theLastKilledBit = JSON.parse(localStorage.getItem('lastRemovedBit'))
			var theLastKilledBitIndex = localStorage.getItem('lastRemovedBitIndex')

	    	var theCellIndex;

	    	// WHICH CELL ARE WE IN
	    	for (var i in cellular){
				if (cellular[i].id == theLastKilledBitParentID) theCellIndex = i;
			}

			cellular[theCellIndex].body.splice(theLastKilledBitIndex, 0, theLastKilledBit);
		}

		victim = '';
	}


	$scope.removeCell = function(id) {
		console.log(id)

		for (var i in $scope.cells){
			if ($scope.cells[i].id === id){
				$scope.cells[i].displayed = false;

				lazyUpdater(id)
			}
		}

		// hoodie.store.remove('cell', id).done(function(object){
		// 	console.log(object);
		// 	for (var i in $scope.cells){
		// 		if ($scope.cells[i].id === id){

		// 			localStorage.setItem('lastRemovedCell' , JSON.stringify(cellular[i]));
		// 			victim = 'cell';

		// 			$scope.cells.splice(i, 1);
		// 			cellular = $scope.cells;

		// 			if ($scope.startUpIndex === 6) $scope.SUB_right();
		// 		}
		// 	}
		// });
	};

	// existing doc updated
	hoodie.remote.on('update', function (updatedObject) {
		lazyServerUpdater(updatedObject);
	});

	var lazyServerUpdater = _.debounce(function(tehUpdated){

		console.log('INCOMING UPDATE')
		console.log(tehUpdated)

		console.log('tehUpdated.id = ' + tehUpdated.id)
		console.log('addFlag = ' + addFlag)

		console.log($scope.isFocused);
		for (var i in cellular){
			if (
				(cellular[i].id === tehUpdated.id) &&
				(tehUpdated.id !== addFlag) && 
				(!$scope.isFocused)
			){
				if ( !_.isEqual(cellular[i].dimensions, tehUpdated.dimensions) ){
					cellular[i].dimensions = tehUpdated.dimensions;
					console.log(cellular[i].id + ' // DIMENSIONS UPDATED');
				}
				if ( !_.isEqual(cellular[i].body, tehUpdated.body) ){
					cellular[i].body = tehUpdated.body;
					console.log(cellular[i].id + ' // BODY UPDATED');
				}
				if ( cellular[i].title !== tehUpdated.title ){
					cellular[i].title = tehUpdated.title;
					console.log(cellular[i].id + ' // TITLE UPDATED');
				}
				if ( cellular[i].displayed !== tehUpdated.displayed ){
					cellular[i].displayed = tehUpdated.displayed;
					console.log(cellular[i].id + ' // DISPLAYED UPDATED');
				}
				if ( cellular[i].category !== tehUpdated.category ){
					cellular[i].category = tehUpdated.category;
					console.log(cellular[i].id + ' // CATEGORY UPDATED');
				}
			}else if (tehUpdated.id === addFlag){
				addFlag = undefined;
			}
		}

		if ($scope.areWeUpdating === true) window.location.reload(false); 

	}, 500);

	// doc removed
	hoodie.remote.on('remove', function (removedObject) {
		console.log('INCOMING REMOVE')
		console.log(removedObject)
		for (var i in $scope.cells){
			if ($scope.cells[i].id === removedObject.id){
				$scope.cells.splice(i, 1);
				cellular = $scope.cells;
			}
		}
	});

	$scope.weAreFocused = function(e){
		$scope.isFocused = true;
	}

	$scope.weAreNotFocused = function(e){
		$scope.isFocused = false;
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
		navigator.geolocation.getCurrentPosition(function(coords){

			$http.get('http://api.openweathermap.org/data/2.5/weather?lat=' + coords.latitude + '&lon=' + coords.longitude)
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
		})

		
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

	var cellUpdater = _.debounce(function(cell, cellIndex){
		hoodie.store.update('cell', cell, {body : cellular[cellIndex].body} )
		.done(function(updatedObject){
			console.log(updatedObject)

			addFlag = updatedObject.id;
		})
	}, 1000);

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
				if (cellular[i].id == theCell) theCellIndex = i;
			}
	    	cellUpdater(theCell, theCellIndex);

	    	if ($scope.startUpIndex === 1) $scope.SUB_right();
	    }
	};

	$scope.cellTitle = function(e){
		var theID = e.target.parentNode.parentNode.parentNode.getAttribute('data-cellid')
		lazyUpdater(theID);
	};

	$scope.bitKiller = function(e){
		var that = e;

		var theCell = that.target.parentNode.parentNode.parentNode.parentNode.getAttribute('data-cellid');

    	var theCellIndex;

    	// WHICH CELL ARE WE IN
    	for (var i in cellular){
			if (cellular[i].id == theCell) theCellIndex = i;
		}

		var theSentencedIndex = that.target.parentNode.parentNode.getAttribute('data-index')

		$(that.target).parent().prev('.textarea-container').find('textarea').focus();

		localStorage.setItem('lastRemovedBitParentID', theCell);
		localStorage.setItem('lastRemovedBit', JSON.stringify( cellular[theCellIndex].body[theSentencedIndex] ));
		localStorage.setItem('lastRemovedBitIndex', theSentencedIndex);

		cellular[theCellIndex].body.splice(theSentencedIndex, 1);

		victim = 'bit'

		cellUpdater(theCell, theCellIndex);

		if (cellular[theCellIndex].body.length === 0){
			cellular[theCellIndex].body.push({
				displayed: true,
				type:'plainText',
				tabCount:0,
				content:''
			})

			setTimeout(function(){
				$(that.target).parent().next('.textarea-container').find('textarea').focus();
			}, 50);
		}

		if ($scope.startUpIndex === 2) $scope.SUB_right();
	}

	var map = [];

	$scope.areaText = function(e, bit){
    	var that = e;

    	map[that.keyCode] = that.type == 'keydown';

		var theActualCell = that.target.parentNode.parentNode.parentNode
		
		var theCell = theActualCell.getAttribute('data-cellid');

    	var theCellIndex;

    	// WHICH CELL ARE WE IN
    	for (var i in cellular){
			if (cellular[i].id == theCell) theCellIndex = i;
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

		// if (
		// 	(map[8] && (that.target.value == '')) & ||
		// 	(map[13]) ||
		// 	(map[9]) ||
		// 	(map[9] && map[16]) ||
		// 	(map[38]) ||
		// 	(map[40])
		// ){
		// 	analyzr(map)
		// }

		if (map[8]){ // DELETE
			if (
				(that.target.value == '') && 
				(cellular[theCellIndex].body.length > 1) // make sure we're not deleting the last bit!
			){ 

				that.preventDefault();

				var theSentencedIndex = that.target.parentNode.getAttribute('data-index')

				$(that.target).parent().prev('.textarea-container').find('textarea').focus();

				cellular[theCellIndex].body.splice(theSentencedIndex, 1);

			}
		}

    	else if (map[13]){ // ENTER KEY
    		that.preventDefault();

    		var theNewIndex = parseInt(that.target.parentNode.getAttribute('data-index')) + 1;

    		console.log(cellular[theCellIndex].body.indexOf(bit))

			var theNewBit = {
				displayed: true,
				type:'plainText',
				tabCount:0,
				content:'',
				bitID: randomizr()
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

		// 17 91 38 LINE UP OSX
		// 17 91 40 LINE DOWN OSX

		// 17 16 38 LINE UP WINDOWS
		// 17 16 40 LINE DOWN WINDOWS

		else { // DO WE NEED TO EXPAND

			var bottomBit = theActualCell
				.children[2]
				.children[
					theActualCell
					.children[2]
					.children
					.length - 1
				]
				.getBoundingClientRect()
				.bottom

			var parentHeight = theActualCell
				.getBoundingClientRect()
				.bottom;

			console.log(bottomBit + ' /// ' + parentHeight)
				
			if (bottomBit > parentHeight){ // SWEET LET'S EXPAND

				theActualCell.parentNode.classList.add('ui-resizable-resizing');

				theActualCell.parentNode.style.height = 
					theActualCell.clientHeight + 
					200 + 
					(
						(
							theActualCell.clientHeight / 
							200
						) * 10
					);

				cellular[theIndex].dimensions[columnCount].sizeY = theActualCell.parentNode.style.height /  GRIDSIZE

				setTimeout(function(){
					theActualCell.parentNode.classList.remove('ui-resizable-resizing')
				},100)
			}
		}


		// UPDATE THAT SHIT YO
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
			if (cellular[i].id == theCell){
				cellular[i].category = newCat;
			}
		}

		lazyUpdater(theCell);

		if ($scope.startUpIndex === 3) $scope.SUB_right();
	}
})

.directive('resizable', function($window) {
	return function($scope) {
		$scope.initializeWindowSize = _.debounce(function() {
			$scope.windowHeight = $window.innerHeight;
			$scope.windowWidth  = $window.innerWidth;
			columnCounter();

			// setTimeout(function(){

				// $('.cell').each(function(e){

				// 	var $that = $(this)

				// 	var cellularAlignment;

				// 	for (var i in cellular){
				// 		if (cellular[i].id === $that.children('.cellFace').data('cellid')) cellularAlignment = i;
				// 	}

				// 	cellular[cellularAlignment].dimensions[columnCount].col = parseInt($that.css('left')) / (GRIDSIZE + GUTTERSIZE)
		  //   		cellular[cellularAlignment].dimensions[columnCount].row = parseInt($that.css('top')) / (GRIDSIZE + GUTTERSIZE)
		  //   		cellular[cellularAlignment].dimensions[columnCount].sizeY = parseInt($that.css('height')) /  GRIDSIZE
		  //   		cellular[cellularAlignment].dimensions[columnCount].sizeX = parseInt($that.css('width')) /  GRIDSIZE

				// })

				// lazyUpdater();

			// }, 500)

		}, 200);
		angular.element($window).bind("resize", function() {
			$scope.initializeWindowSize();
			$scope.$apply();
		});
		$scope.initializeWindowSize();
	}
})

.directive('autonomy', ['$rootScope', function($rootScope) {
    return {
        restrict: 'A',
        scope: {
            index: '@'
        },
        link: function(scope, element, attrs) {

        	var theIndex = parseInt(attrs.index);
        	var theElement = element[0]

            if($rootScope.packery === undefined || $rootScope.packery === null){
                $rootScope.packery = new Packery(theElement.parentElement, {
                	gutter: GUTTERSIZE,
                	columnWidth: GRIDSIZE,
					rowHeight: GRIDSIZE
                });
                $rootScope.packery.bindResize();

                $rootScope.packery.addItems(theElement);
               	
                // hack to fix a bug where the first element was added twice in two different position
                $rootScope.packery.items.splice(1,1); 
            }
            else{
                $rootScope.packery.addItems(theElement);
            }

            theElement.style.height = cellular[theIndex].dimensions[columnCount].sizeY * GRIDSIZE;
            theElement.style.width = cellular[theIndex].dimensions[columnCount].sizeX * GRIDSIZE;

            $rootScope.packery.fit(
		    	element[0], 
		    	cellular[theIndex].dimensions[columnCount].col * (GRIDSIZE + GUTTERSIZE), 
		    	cellular[theIndex].dimensions[columnCount].row * (GRIDSIZE + GUTTERSIZE)
			);

            $rootScope.packery.layout();

            var $draggable = $(theElement).draggable({
            	handle:'.grab',
            	stop: function(event, ui) {
            		setTimeout(function(){
            			var $theElement = $(theElement)
	            		cellular[theIndex].dimensions[columnCount].col = parseInt($theElement.css('left')) / (GRIDSIZE + GUTTERSIZE)
	            		cellular[theIndex].dimensions[columnCount].row = parseInt($theElement.css('top')) / (GRIDSIZE + GUTTERSIZE)

	            		console.log('MOVED // ' + cellular[theIndex].id)

	            		lazyUpdater(cellular[theIndex].id)

						if (externalStartUpIndex === 5) setTimeout(function(){
							$('.SUB_right').click();
						}, 500);
            		}, 500);
				}
            }).resizable({
            	grid:210,
            	stop: function(event, ui) {
            		setTimeout(function(){
            			var $theElement = $(theElement)
	            		cellular[theIndex].dimensions[columnCount].sizeY = parseInt($theElement.css('height')) /  GRIDSIZE
	            		cellular[theIndex].dimensions[columnCount].sizeX = parseInt($theElement.css('width')) /  GRIDSIZE

	            		console.log('RESIZED // ' + cellular[theIndex].id)

	            		lazyUpdater(cellular[theIndex].id)

						if (externalStartUpIndex === 4) $('.SUB_right').click();
            		}, 500);
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










