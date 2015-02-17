'use strict';

var cellular; 
var meta;
var temp;
var planetary;
var retryUpdate;
// var columnCount = 1;
var sterGrid;

var map = [];

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

function randomizr(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = ( d + Math.random() * 16 ) % 16 | 0;
        d = Math.floor( d / 16 );
        return (c == 'x' ? r : ( r & 0x7 | 0x8 ) ).toString(16);
    });
    return uuid;
};

var hoodie  = new Hoodie();
window.hoodie = hoodie;

var lazyUpdater = _.debounce(function(id){

	for (var i in cellular){
		if (cellular[i].id === id){
			hoodie.store.update('cell', cellular[i].id, {dimensions : cellular[i].dimensions})
				.done(function(object){
					// console.log(object);
					// console.log(id + ' DIMENSIONS LAZILY UPDATED')

					addFlag = object.id;
				})

			hoodie.store.update('cell', cellular[i].id, {title : cellular[i].title})
				.done(function(object){
					// console.log(object);
					// console.log(id+' TITLE LAZILY UPDATED')

					addFlag = object.id;
				})

			hoodie.store.update('cell', cellular[i].id, {category : cellular[i].category})
				.done(function(object){
					// console.log(object);
					// console.log(id+' CATEGORY LAZILY UPDATED')

					addFlag = object.id;
				})

			hoodie.store.update('cell', cellular[i].id, {displayed : cellular[i].displayed})
				.done(function(object){
					// console.log(object);
					// console.log(id+' DISPLAYED LAZILY UPDATED')

					addFlag = object.id;
				})

			hoodie.store.update('cell', cellular[i].id, {body : cellular[i].body})
				.done(function(object){
					// console.log(object);
					// console.log(id+' BODY LAZILY UPDATED')

					addFlag = object.id;
				})
		}
	}

}, 1000);

var metaUpdate = function(){
	hoodie.store.update('meta', meta.id, {
		celsius: meta.celsius,
		twentyfour: meta.twentyfour
	}).done(function(tehmeta){
		// console.log(tehmeta)
		// console.log('META UPDATED')
	})
}

var analyzr = function(){
	$.ajax({
		type: "POST",
		dataType:'JSON',
		data:{project:which},
		url: "php/analyzr.php"
	}).done(function(cellular){

	});
}

// var columnCounter = function(){
// 	if (window.innerWidth < 768 ) columnCount = 1;
// 	if (window.innerWidth >= 768 ) columnCount = 3;
// 	if (window.innerWidth > (((GRIDSIZE + GUTTERSIZE) * 4) + 60) ) columnCount = 4;
// 	if (window.innerWidth > (((GRIDSIZE + GUTTERSIZE) * 5) + 60) ) columnCount = 5;
// 	if (window.innerWidth > (((GRIDSIZE + GUTTERSIZE) * 6) + 60) ) columnCount = 6;
// 	if (window.innerWidth > (((GRIDSIZE + GUTTERSIZE) * 7) + 60) ) columnCount = 7;
// 	if (window.innerWidth > (((GRIDSIZE + GUTTERSIZE) * 8) + 60) ) columnCount = 8;
// 	if (window.innerWidth > (((GRIDSIZE + GUTTERSIZE) * 9) + 60) ) columnCount = 9;
// 	if (window.innerWidth > (((GRIDSIZE + GUTTERSIZE) * 10) + 60) ) columnCount = 10;
// 	if (window.innerWidth > (((GRIDSIZE + GUTTERSIZE) * 11) + 60) ) columnCount = 11;
// 	if (window.innerWidth > (((GRIDSIZE + GUTTERSIZE) * 12) + 60) ) columnCount = 12;
// 	if (window.innerWidth > (((GRIDSIZE + GUTTERSIZE) * 13) + 60) ) columnCount = 13;

// 	console.log('columnCount = '+columnCount);
// }

var echo = function(thisOne){

	var theID = thisOne.getAttribute('data-cellid')

	for (var i in cellular){
		if (cellular[i].id === theID){
			console.log(cellular[i])
		}
	}
}

var app = angular.module('app', [
	'ngCookies',
	'ui.utils',
	'ui.sortable',
	'ngTouch'
])

.controller('MainCtrl', function($window, $scope, $http, $interval, $cookieStore) {

	$scope.draggingToggle = false;

	$scope.columnCount = 1;

	$scope.sidebarStatus = 'closed';

	$scope.columnCounter = function(){
		if (window.innerWidth < 768 ) $scope.columnCount = 1;
		if (window.innerWidth >= 768 ) $scope.columnCount = 3;
		if (window.innerWidth > (((GRIDSIZE + GUTTERSIZE) * 4) + 60) ) $scope.columnCount = 4;
		if (window.innerWidth > (((GRIDSIZE + GUTTERSIZE) * 5) + 60) ) $scope.columnCount = 5;
		if (window.innerWidth > (((GRIDSIZE + GUTTERSIZE) * 6) + 60) ) $scope.columnCount = 6;
		if (window.innerWidth > (((GRIDSIZE + GUTTERSIZE) * 7) + 60) ) $scope.columnCount = 7;
		if (window.innerWidth > (((GRIDSIZE + GUTTERSIZE) * 8) + 60) ) $scope.columnCount = 8;
		if (window.innerWidth > (((GRIDSIZE + GUTTERSIZE) * 9) + 60) ) $scope.columnCount = 9;
		if (window.innerWidth > (((GRIDSIZE + GUTTERSIZE) * 10) + 60) ) $scope.columnCount = 10;
		if (window.innerWidth > (((GRIDSIZE + GUTTERSIZE) * 11) + 60) ) $scope.columnCount = 11;
		if (window.innerWidth > (((GRIDSIZE + GUTTERSIZE) * 12) + 60) ) $scope.columnCount = 12;
		if (window.innerWidth > (((GRIDSIZE + GUTTERSIZE) * 13) + 60) ) $scope.columnCount = 13;

		// console.log('columnCount = '+$scope.columnCount);
	}

	$scope.columnCounter();

	meta = $scope.meta = {
		twentyfour: true,
		celsius: true
	};

	$scope.areWeUpdating = false;

	$scope.versionCheck = function(){
		var updateItYo = _.once($scope.versionUpdater);

		// console.log('looking for NOPE')

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

		hoodie.store.add('meta',{
			celsius: true,
			twentyfour: true
		})

		for (var i in cellular){
			cellular[i].displayed = true;

			$scope.cells[i].displayed = true;

			for (var b in cellular[i].body){
				cellular[i].body[b].bitID = randomizr();
			}

			hoodie.store.update(
				'cell', 
				cellular[i].id,
				{
					displayed : true,
					body : cellular[i].body
				}
			)

			// console.log('UPDATED ' + cellular[i].id);
		}

		//the reload call is handled after we get confirmation that things are updated -- hence the areWeUpdating flag
	}

	$scope.$watch('meta', metaUpdate, true);

	$scope.threeOpen = false;
	$scope.fourOpen = false;

	$scope.mobileActioning = false;

	$scope.startUpIndex = 'off';
	externalStartUpIndex = 'off';

	$scope.isFocused = false;
	$scope.thisIsFocused;

	theContainer.className = 'modalClear';


 	                                                                   
 	//  ad88888ba  88                                                     
 	// d8"     "8b ""                                                     
 	// Y8,                                                                
 	// `Y8aaaaa,   88  ,adPPYb,d8 8b,dPPYba,  88       88 8b,dPPYba,      
 	//   `"""""8b, 88 a8"    `Y88 88P'   `"8a 88       88 88P'    "8a     
 	//         `8b 88 8b       88 88       88 88       88 88       d8     
 	// Y8a     a8P 88 "8a,   ,d88 88       88 "8a,   ,a88 88b,   ,a8"     
 	//  "Y88888P"  88  `"YbbdP"Y8 88       88  `"YbbdP'Y8 88`YbbdP"'      
 	//                 aa,    ,88                         88              
 	//                  "Y8bbdP"                          88              
	                                       

	$scope.signUp = function(e){
		if (
			( $scope.threeOpen === true ) && 
			( $(signUpForm.emailSignup).hasClass('ng-valid') )
		){

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

		// console.log(user)

		hoodie.store.add('cell', {
			dimensions:[ {}, {}, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 1 } ],
			gaze: true,
			displayed: true,
		}).done(function(object){
			$scope.cells.push(object);
			cellular = $scope.cells;

			hoodie.store.add('cell', {
				dimensions:[ {}, {}, { sizeX: 1, sizeY: 1, row: 1, col: 2 }, { sizeX: 1, sizeY: 1, row: 1, col: 2 }, { sizeX: 1, sizeY: 1, row: 1, col: 2 }, { sizeX: 1, sizeY: 1, row: 1, col: 2 }, { sizeX: 1, sizeY: 1, row: 1, col: 2 }, { sizeX: 1, sizeY: 1, row: 1, col: 2 }, { sizeX: 1, sizeY: 1, row: 1, col: 2 }, { sizeX: 1, sizeY: 1, row: 1, col: 2 }, { sizeX: 1, sizeY: 1, row: 1, col: 2 }, { sizeX: 1, sizeY: 1, row: 1, col: 2 }, { sizeX: 1, sizeY: 1, row: 1, col: 2 }, { sizeX: 1, sizeY: 1, row: 1, col: 2 } ],
				wristwatch: true,
				displayed: true,
			}).done(function(object){
				$scope.cells.push(object);
				cellular = $scope.cells;

				hoodie.store.add('cell', {
					dimensions:[ {}, {}, { sizeX: 1, sizeY: 1, row: 2, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 3 }, { sizeX: 1, sizeY: 1, row: 1, col: 3 }, { sizeX: 1, sizeY: 1, row: 1, col: 3 }, { sizeX: 1, sizeY: 1, row: 1, col: 3 }, { sizeX: 1, sizeY: 1, row: 1, col: 3 }, { sizeX: 1, sizeY: 1, row: 1, col: 3 }, { sizeX: 1, sizeY: 1, row: 1, col: 3 }, { sizeX: 1, sizeY: 1, row: 1, col: 3 }, { sizeX: 1, sizeY: 1, row: 1, col: 3 }, { sizeX: 1, sizeY: 1, row: 1, col: 3 }, { sizeX: 1, sizeY: 1, row: 1, col: 3 } ],
					addcell: true,
					displayed: true,
				}).done(function(object){
					$scope.cells.push(object);
					cellular = $scope.cells;

					hoodie.store.add('cell', {
						dimensions:[ {}, {}, { sizeX: 1, sizeY: 1, row: 2, col: 2 }, { sizeX: 1, sizeY: 1, row: 2, col: 1 }, { sizeX: 1, sizeY: 1, row: 1, col: 4 }, { sizeX: 1, sizeY: 1, row: 1, col: 4 }, { sizeX: 1, sizeY: 1, row: 1, col: 4 }, { sizeX: 1, sizeY: 1, row: 1, col: 4 }, { sizeX: 1, sizeY: 1, row: 1, col: 4 }, { sizeX: 1, sizeY: 1, row: 1, col: 4 }, { sizeX: 1, sizeY: 1, row: 1, col: 4 }, { sizeX: 1, sizeY: 1, row: 1, col: 4 }, { sizeX: 1, sizeY: 1, row: 1, col: 4 }, { sizeX: 1, sizeY: 1, row: 1, col: 4 } ],
						title: 'Your very first cell!',
						body: [
							{
								displayed: true,
								type:'plainText',
								tabCount:0,
								content:'This is a bit.',
								bitID: randomizr()
							},
							{
								displayed: true,
								type:'plainText',
								tabCount:0,
								content:'This is another bit!',
								bitID: randomizr()
							},
							{
								displayed: true,
								type:'plainText',
								tabCount:0,
								content:'Here\'s another bit...',
								bitID: randomizr()
							},
							{
								displayed: true,
								type:'plainText',
								tabCount:0,
								content:'And one more for good measure. :)',
								bitID: randomizr()
							}
						],
						category:1,
						displayed: true,
						list: true
					}).done(function(object){
						$scope.cells.push(object);
						cellular = $scope.cells;

						theContainer.className = 'yesLetsGo';

						setTimeout(function(){
							theContainer.className = 'yesLetsGo upUpAndAway modalClear';
						}, 550)

						setTimeout(function(){
							$scope.startUpIndex = 0;
							externalStartUpIndex = 0;
						}, 1000)
					});
				});
			});
		});
		
	});


	                                                      
	// 88                                    88              
	// 88                                    ""              
	// 88                                                    
	// 88          ,adPPYba,   ,adPPYb,d8    88 8b,dPPYba,   
	// 88         a8"     "8a a8"    `Y88    88 88P'   `"8a  
	// 88         8b       d8 8b       88    88 88       88  
	// 88         "8a,   ,a8" "8a,   ,d88    88 88       88  
	// 88888888888 `"YbbdP"'   `"YbbdP"Y8    88 88       88  
	//                         aa,    ,88                    
	//                          "Y8bbdP"                       
	                                   

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

			hoodie.store.findAll('cell')
				.done(function (objects) {
					objects.splice(0, 1)
					cellular = $scope.cells = objects;
					// console.log(cellular)

					$scope.versionCheck();

					theContainer.className = 'yesLetsGo';

					setTimeout(function(){
						theContainer.className = 'yesLetsGo upUpAndAway modalClear';

						$(signInForm).parents('.four').removeClass('active')
						$scope.fourOpen = false;
					}, 550)
				});

			hoodie.store.findAll('meta')
				.done(function(metas){
					meta = $scope.meta = metas[0];
					// console.log(meta);
				})
		}
	});

	hoodie.task.on('error', function (errorMessage, task) {
		// console.log(errorMessage)
		// console.log(task)
	});

	if (localStorage.getItem('user') !== null){

		var returnEmail = localStorage.getItem('user');
		var returnPass = localStorage.getItem('pass');

		hoodie.account.signIn(returnEmail, returnPass);

		// console.log(returnEmail + ' /// ' + returnPass)

		hoodie.store.findAll('cell')
			.done(function (objects) {
				// $scope.startUpIndex = 1;
				cellular = $scope.cells = objects
				// console.log(cellular)

				$scope.versionCheck();

				theContainer.className = 'yesLetsGo upUpAndAway modalClear';
			});

		hoodie.store.findAll('meta')
			.done(function(metas){
				meta = $scope.meta = metas[0];
				// console.log(meta);
			})
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


	                                                         
	                                                      
	// 88b           d88                                     
	// 888b         d888                                     
	// 88`8b       d8'88                                     
	// 88 `8b     d8' 88  ,adPPYba, 8b,dPPYba,  88       88  
	// 88  `8b   d8'  88 a8P_____88 88P'   `"8a 88       88  
	// 88   `8b d8'   88 8PP""""""" 88       88 88       88  
	// 88    `888'    88 "8b,   ,aa 88       88 "8a,   ,a88  
	// 88     `8'     88  `"Ybbd8"' 88       88  `"YbbdP'Y8                                          
	                                                         
	
	$scope.demo = function(){
		externalStartUpIndex = 0;
		$scope.startUpIndex = 0;

		$scope.SUB_right(false);
		
		$('.cellFace.list').eq(0).parent().addClass('showingList');
		$theFace = $('.showingList .cellFace');
		$theFaceOrigPos = $theFace.offset();

		$scope.sidebarStatus = 'closed';
	};

	$scope.tempUnitsChange = function(){
		$scope.meta.celsius = ($scope.meta.celsius !== true) ? true : false;
		setWeather();
	}

	$scope.timeUnitsChange = function(){
		$scope.meta.twentyfour = ($scope.meta.twentyfour !== true) ? true : false;
		setCurrentTime();
	}

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




	                                                                                          
	//  ad88888ba                                                                  88            
	// d8"     "8b ,d                            ,d                                ""            
	// Y8,         88                            88                                              
	// `Y8aaaaa, MM88MMM ,adPPYYba, 8b,dPPYba, MM88MMM 88       88 8b,dPPYba,      88 ,adPPYba,  
	//   `"""""8b, 88    ""     `Y8 88P'   "Y8   88    88       88 88P'    "8a     88 I8[    ""  
	//         `8b 88    ,adPPPPP88 88           88    88       88 88       d8     88  `"Y8ba,   
	// Y8a     a8P 88,   88,    ,88 88           88,   "8a,   ,a88 88b,   ,a8" 888 88 aa    ]8I  
	//  "Y88888P"  "Y888 `"8bbdP"Y8 88           "Y888  `"YbbdP'Y8 88`YbbdP"'  888 88 `"YbbdP"'  
	//                                                             88             ,88            
	//                                                             88           888P"            

	$scope.startUpCloser = function(){
		externalStartUpIndex = 'off';
		$scope.startUpIndex = 'off';

		$scope.modalCloser();
	}

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

	$scope.SUB_right = function(jump){
		externalStartUpIndex++;
		$scope.startUpIndex++;

		// console.log(externalStartUpIndex)
		// console.log($scope.startUpIndex)

		if ($scope.startUpIndex === 1){			
			// $('.cellFace.list').eq(0).parent().addClass('showingList')
			var smallest,
				selected

			$('.cellFace.list').each(function(){

			})
			// .eq(0).parent().addClass('showingList')
			$theFace = $('.showingList .cellFace')
			$theFaceOrigPos = $theFace.offset()
			$scope.sidebarStatus = 'closed';

			$scope.startUp_X = '50%';
			$scope.startUp_Y = '50%';
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
				$scope.startUp_X = $theFaceOrigPos.left - 250;
				$scope.startUp_Y = $theFaceOrigPos.top + $theFace.height() + 10;
			}

			if (
				($theFaceOrigPos.left < 150)
			){
				$scope.startUpOrient = 'topLeft';
				$scope.startUp_X = $theFaceOrigPos.left + 210;
				$scope.startUp_Y = $theFaceOrigPos.top + $theFace.height() + 10;
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

		if (($scope.startUpIndex === 7) || ($scope.startUpIndex === 8)){
			$('.cellFace.list').eq(0).parent().addClass('showingList')
			$theFace = $('.cellFace.addCell')
			setTimeout(function(){
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
			}, 500);

			if (jump === true){ 
				// console.log('OU FUCK')
				$scope.SUB_right(false);
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




	//                                                                                
	//        db                          88                                      d8  
	//       d88b                   ,d    ""                                    ,8P'  
	//      d8'`8b                  88                                         d8"    
	//     d8'  `8b     ,adPPYba, MM88MMM 88  ,adPPYba,  8b,dPPYba,          ,8P'     
	//    d8YaaaaY8b   a8"     ""   88    88 a8"     "8a 88P'   `"8a        d8"       
	//   d8""""""""8b  8b           88    88 8b       d8 88       88      ,8P'        
	//  d8'        `8b "8a,   ,aa   88,   88 "8a,   ,a8" 88       88     d8"          
	// d8'          `8b `"Ybbd8"'   "Y888 88  `"YbbdP"'  88       88    8P'           
	//                                                                              
	// 88888888ba                                          88                          
	// 88      "8b                                   ,d    ""                          
	// 88      ,8P                                   88                                
	// 88aaaaaa8P' ,adPPYba, ,adPPYYba,  ,adPPYba, MM88MMM 88  ,adPPYba,  8b,dPPYba,   
	// 88""""88'  a8P_____88 ""     `Y8 a8"     ""   88    88 a8"     "8a 88P'   `"8a  
	// 88    `8b  8PP""""""" ,adPPPPP88 8b           88    88 8b       d8 88       88  
	// 88     `8b "8b,   ,aa 88,    ,88 "8a,   ,aa   88,   88 "8a,   ,a8" 88       88  
	// 88      `8b `"Ybbd8"' `"8bbdP"Y8  `"Ybbd8"'   "Y888 88  `"YbbdP"'  88       88  
	                                                                                
	                                                                                

	$scope.cellOrder = function(cell){
		return cell.dimensions[$scope.columnCount].row;
	}

	$scope.cellSort = {
	    axis: 'y',
	    handle: '.grab',
	    placeholder: 'cellPlaceholder',
	    start: function(e, ui) {
	    	$scope.draggingToggle = 'active';
	    	// e.stopPropagation();
	    	// console.log('CELLSORTNIG LOL')
	    },
	    stop: function(e, ui) {
			$scope.draggingToggle = 'false';
	    	// console.log('CELLSORTNIG STOP')

	    	// console.log(e)
	    	// console.log(ui)

	    	var that = e;

	    	var theCell = ui.item[0].children[0].getAttribute('data-cellid');

			for (var i in cellular){
				if (cellular[i].id == theCell){
					cellular[i].dimensions[1].row = ui.item.index();

					// console.log(cellular[i].dimensions[1]);

					lazyUpdater(theCell)
				}
			}
	    }
	};

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
			// console.log($scope.cells)
			$scope.cells.push(object)
			cellular = $scope.cells
			// console.log($scope.cells)

			addFlag = object.id;

			setTimeout(function(){
				$('.grid').find('.list').each(function(){
					var $that = $(this);
					if ($that.data('cellid') === object.id){
						$that.find('.title').focus();
					}
				});
			}, 500);

			if ($scope.startUpIndex === 8) $scope.SUB_right(false);
		})
	}

	$scope.reviver = function(){

		if (victim === 'cell'){
			var theLastKilledCell = localStorage.getItem('lastRemovedCell')
			console.log(theLastKilledCell)
			if ($scope.startUpIndex === 7) $scope.SUB_right(false);

			for (var i in $scope.cells){
				if ($scope.cells[i].id === theLastKilledCell){
					$scope.cells[i].displayed = true;
					lazyUpdater(id)
				}
			}			
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
		// console.log('KILLED ' + id)

		localStorage.setItem('lastRemovedCell' , id);
		victim = 'cell';

		for (var i in $scope.cells){
			if ($scope.cells[i].id === id){
				$scope.cells[i].displayed = false;

				lazyUpdater(id)
				if ($scope.startUpIndex === 6) $scope.SUB_right(false);
			}
		}

		// hoodie.store.remove('cell', id).done(function(object){
		// 	console.log(object);
		// 	for (var i in $scope.cells){
		// 		if ($scope.cells[i].id === id){

					

		// 			$scope.cells.splice(i, 1);
		// 			cellular = $scope.cells;

		// 		}
		// 	}
		// });
	};

	// existing doc updated
	hoodie.remote.on('update', function (updatedObject) {
		lazyServerUpdater(updatedObject);
	});

	var lazyServerUpdater = _.debounce(function(tehUpdated){

		// console.log('INCOMING UPDATE')
		// console.log(tehUpdated)

		// console.log('tehUpdated.id = ' + tehUpdated.id)
		// console.log('addFlag = ' + addFlag)

		// console.log($scope.isFocused);
		for (var i in cellular){
			if (
				(cellular[i].id === tehUpdated.id) &&
				(tehUpdated.id !== addFlag) && 
				(!$scope.isFocused) && 
				(tehUpdated.id !== $scope.thisIsFocused)
			){
				if ( !_.isEqual(cellular[i].dimensions, tehUpdated.dimensions) ){
					cellular[i].dimensions = tehUpdated.dimensions;
					// console.log(cellular[i].id + ' // DIMENSIONS UPDATED');
				}
				if ( !_.isEqual(cellular[i].body, tehUpdated.body) ){
					cellular[i].body = tehUpdated.body;
					// console.log(cellular[i].id + ' // BODY UPDATED');
				}
				if ( cellular[i].title !== tehUpdated.title ){
					cellular[i].title = tehUpdated.title;
					// console.log(cellular[i].id + ' // TITLE UPDATED');
				}
				if ( cellular[i].displayed !== tehUpdated.displayed ){
					cellular[i].displayed = tehUpdated.displayed;
					// console.log(cellular[i].id + ' // DISPLAYED UPDATED');
				}
				if ( cellular[i].category !== tehUpdated.category ){
					cellular[i].category = tehUpdated.category;
					// console.log(cellular[i].id + ' // CATEGORY UPDATED');
				}
			}else if (tehUpdated.id === addFlag){
				addFlag = undefined;
			}
		}

		if ($scope.areWeUpdating === true) window.location.reload(false); 

	}, 500);

	// doc removed
	hoodie.remote.on('remove', function (removedObject) {
		// console.log('INCOMING REMOVE')
		// console.log(removedObject)
		for (var i in $scope.cells){
			if ($scope.cells[i].id === removedObject.id){
				$scope.cells.splice(i, 1);
				cellular = $scope.cells;
			}
		}
	});

	$scope.weAreFocused = function(e){
		$scope.theFocusedElement = document.activeElement;
		$scope.thisIsFocused = e.target.parentNode.parentNode.parentNode.getAttribute('data-cellid')
		$scope.isFocused = true;

		$scope.focusedToggle = true;
	}

	$scope.weAreNotFocused = function(e){
		if (!$scope.mobileActioning){
			$scope.isFocused = false;
		}
		else{
			$scope.mobileActioning = false;
		}
	};



	//                                                                 
	//   ,ad8888ba,                                      88            
	//  d8"'    `"8b                                     ""            
	// d8'                                                             
	// 88            ,adPPYYba, 888888888  ,adPPYba,     88 ,adPPYba,  
	// 88      88888 ""     `Y8      a8P" a8P_____88     88 I8[    ""  
	// Y8,        88 ,adPPPPP88   ,d8P'   8PP"""""""     88  `"Y8ba,   
	//  Y8a.    .a88 88,    ,88 ,d8"      "8b,   ,aa 888 88 aa    ]8I  
	//   `"Y88888P"  `"8bbdP"Y8 888888888  `"Ybbd8"' 888 88 `"YbbdP"'  
	//                                                  ,88            
	//                                                888P"            

	//TODO: TURN BACK ON LOL

	var shift = 'https://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=fb4e9edf281bc73c80eb89e1f847b465&format=json&nojsoncallback=1';
	var gazeList;

	$http.get(shift)
		.success(function(data) {
			gazeList = data.photos.photo;
			getGaze();
		})
		.error(function(data) {
			// console.log('Error: ' + data);
		});

	var getGaze = function(){
		var getThisOne =  Math.floor(Math.random() * (100 - 0 + 1)) + 0;
		var stare = gazeList[getThisOne];
		var pull = 'http://farm' + stare.farm + '.staticflickr.com/' + stare.server + '/' + stare.id + '_' + stare.secret + '.jpg'
		$scope.gaze = 'url(' + pull + ')';
	}

	$interval(getGaze, 600000);



	                                                                                                                                    
	// I8,        8        ,8I          88                                                                   88              88            
	// `8b       d8b       d8'          ""             ,d                                    ,d              88              ""            
	//  "8,     ,8"8,     ,8"                          88                                    88              88                            
	//   Y8     8P Y8     8P 8b,dPPYba, 88 ,adPPYba, MM88MMM 8b      db      d8 ,adPPYYba, MM88MMM ,adPPYba, 88,dPPYba,      88 ,adPPYba,  
	//   `8b   d8' `8b   d8' 88P'   "Y8 88 I8[    ""   88    `8b    d88b    d8' ""     `Y8   88   a8"     "" 88P'    "8a     88 I8[    ""  
	//    `8a a8'   `8a a8'  88         88  `"Y8ba,    88     `8b  d8'`8b  d8'  ,adPPPPP88   88   8b         88       88     88  `"Y8ba,   
	//     `8a8'     `8a8'   88         88 aa    ]8I   88,     `8bd8'  `8bd8'   88,    ,88   88,  "8a,   ,aa 88       88 888 88 aa    ]8I  
	//      `8'       `8'    88         88 `"YbbdP"'   "Y888     YP      YP     `"8bbdP"Y8   "Y888 `"Ybbd8"' 88       88 888 88 `"YbbdP"'  
	//                                                                                                                      ,88            
	//                                                                                                                    888P"            

	var setWeather = function(){
		if ($scope.meta.celsius){ //CELSIUS
			$scope.temp = (temp - 273).toFixed(1);
		}
		else{ // FAHRENHEIT
			$scope.temp = (((temp - 273.15) * 1.8) + 32.00).toFixed(1);
		}

		$scope.planetary = planetary;
	}

	var getWeather = function(){
		navigator.geolocation.getCurrentPosition(function(coords){

			// console.log(coords)

			$http.get('http://api.openweathermap.org/data/2.5/weather?lat=' + coords.coords.latitude + '&lon=' + coords.coords.longitude)
			.success(function(data) {
				// console.log(data)

				planetary = data.name + ', ' + data.sys.country;

				temp = data.main.temp

				setWeather();

				var theEarth = moment();
				var theSun = moment.utc(data.sys.sunrise).format()
				var theMoon = moment.utc(data.sys.sunset).format()

				var theLight;

				if (theEarth.isAfter(theSun) && theEarth.isBefore(theMoon)) theLight = 'day'
					else theLight = 'night';

				$scope.weather = 'w_' + theLight + '_' + data.weather[0].id;
			})
			.error(function(data) {
				// console.log('Error: ' + data);
			});
		})
	}

	$interval(getWeather, 600000);
	getWeather();

	var setCurrentTime = function(){
		if ($scope.meta.twentyfour){ //24h
			$scope.time = moment(new Date()).format('H:mm:ss')	
		}
		else{ //12h
			$scope.time = moment(new Date()).format('h:mm:ss a')		
		}		
	}

	$interval(setCurrentTime, 1000);
	setCurrentTime();

	$scope.today = function(){
		return moment(new Date()).format('dddd')
	}

	$scope.date = function(){
		return moment(new Date()).format('D MMMM, YYYY')
	}



	                                                                                                
	// 88b           d88             88          88 88               88          88                    
	// 888b         d888             88          "" 88               88          ""   ,d               
	// 88`8b       d8'88             88             88               88               88               
	// 88 `8b     d8' 88  ,adPPYba,  88,dPPYba,  88 88  ,adPPYba,    88,dPPYba,  88 MM88MMM ,adPPYba,  
	// 88  `8b   d8'  88 a8"     "8a 88P'    "8a 88 88 a8P_____88    88P'    "8a 88   88    I8[    ""  
	// 88   `8b d8'   88 8b       d8 88       d8 88 88 8PP"""""""    88       d8 88   88     `"Y8ba,   
	// 88    `888'    88 "8a,   ,a8" 88b,   ,a8" 88 88 "8b,   ,aa    88b,   ,a8" 88   88,   aa    ]8I  
	// 88     `8'     88  `"YbbdP"'  8Y"Ybbd8"'  88 88  `"Ybbd8"'    8Y"Ybbd8"'  88   "Y888 `"YbbdP"'  

	$scope.mobileAction = function(e){

		$scope.mobileActioning = true;
		// console.log('mobile button!')

		$scope.theFocusedElement.focus();

		var theBit, theCellIndex, theBitIndex;
		var theCellID = $($scope.theFocusedElement).parents('.list').data('cellid')
		var theBitID = $($scope.theFocusedElement).data('bitid')

		for (var i in cellular){
			if (cellular[i].id === theCellID){
				theCellIndex = i;
				for (var j in cellular[i].body){
					if (cellular[i].body[j].bitID === theBitID){
						theBitIndex = j;
					}	
				}
			}
		}

		if (e === ('up')){
			var movingUp = cellular[theCellIndex].body.splice(theBitIndex, 1)[0];
			cellular[theCellIndex].body.splice(theBitIndex - 1, 0, movingUp);
			$($scope.theFocusedElement).focus();
		}
		else if (e === ('down')){
			var movingUp = cellular[theCellIndex].body.splice(theBitIndex, 1)[0];
			cellular[theCellIndex].body.splice(theBitIndex + 1, 0, movingUp);
			$(that.target).focus();
		}
		else if (e === ('in')){
			if (cellular[theCellIndex].body[theBitIndex].tabCount > 0)
				cellular[theCellIndex].body[theBitIndex].tabCount --;
		}
		else if (e === ('out')){
			if (cellular[theCellIndex].body[theBitIndex].tabCount < 2)
				cellular[theCellIndex].body[theBitIndex].tabCount ++;
		}

		cellUpdater(theCellID, theCellIndex);
	}

	$scope.canWeNotBeFocusedAnymore = function(){
		$scope.focusedToggle = false;
	}

	                                                   
	// 88888888ba  88                       88            
	// 88      "8b ""   ,d                  ""            
	// 88      ,8P      88                                
	// 88aaaaaa8P' 88 MM88MMM ,adPPYba,     88 ,adPPYba,  
	// 88""""""8b, 88   88    I8[    ""     88 I8[    ""  
	// 88      `8b 88   88     `"Y8ba,      88  `"Y8ba,   
	// 88      a8P 88   88,   aa    ]8I 888 88 aa    ]8I  
	// 88888888P"  88   "Y888 `"YbbdP"' 888 88 `"YbbdP"'  
	//                                     ,88            
	//                                   888P"            

	var cellUpdater = _.debounce(function(cell, cellIndex){
		hoodie.store.update('cell', cell, {body : cellular[cellIndex].body} )
		.done(function(updatedObject){
			// console.log(updatedObject)

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
	    	// console.log(e)
	    	// console.log(ui)
	    	var that = e;
	    	var theCell = that.target.parentNode.getAttribute('data-cellid');
	    	var theCellIndex;
	    	for (var i in cellular){
				if (cellular[i].id == theCell) theCellIndex = i;
			}
	    	cellUpdater(theCell, theCellIndex);

	    	if ($scope.startUpIndex === 1) $scope.SUB_right(false);
	    }
	};

	$scope.cellTitle = function(e){
		var that = e;

		var theActualCell = that.target.parentNode.parentNode.parentNode

		var theID = theActualCell.getAttribute('data-cellid')

		if (that.keyCode === 13){
			that.preventDefault();
			$(theActualCell).find('.cellEdit textarea').first().focus();
		}

		lazyUpdater(theID);
	};

	$scope.bitKiller = function(e, bit){
		var that = e;

		var theCell = that.target.parentNode.parentNode.parentNode.parentNode.getAttribute('data-cellid');

    	var theCellIndex;

    	// WHICH CELL ARE WE IN
    	for (var i in cellular){
			if (cellular[i].id == theCell) theCellIndex = i;
		}

		// var theSentencedIndex = that.target.parentNode.parentNode.getAttribute('data-index')
		var theSentencedIndex = cellular[theCellIndex].body.indexOf(bit);

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

		if ($scope.startUpIndex === 2) $scope.SUB_right(false);
	}

	$scope.curiosity = function(e, content){
		// console.log(e)
		// console.log(content)

		var win = window.open('https://www.google.com/search?q=' + content, '_blank');
	    win.focus();

		//clientX / Y!
	}

	$scope.areaText = function(e, bit){
    	var that = e;

    	// console.log(that)
    	// console.log(bit)

    	map[that.keyCode] = that.type == 'keydown';

    	console.log(map)

		var theActualCell = that.target.parentNode.parentNode.parentNode.parentNode
		
		var theCell = theActualCell.getAttribute('data-cellid');

    	var theCellIndex;

    	// WHICH CELL ARE WE IN
    	for (var i in cellular){
			if (cellular[i].id == theCell) theCellIndex = i;
		}

		var theBitIndex = cellular[theCellIndex].body.indexOf(bit);

		// GET CARET
		var currentCaret = $(that.target)[0].selectionStart;
		var theValue = that.target.value;

		var $theSizer = $(that.target).siblings('.sizer')

		$theSizer.html(
			'<span class="delicate">'+
			theValue.substring(0, currentCaret) + 
			'<span class="hiddenCaret"></span>' + 
			theValue.substring(currentCaret, theValue.length)+
			'</span>'
		)

		if (map[8]){ // DELETE
			if (
				(that.target.value == '') && 
				(cellular[theCellIndex].body.length > 1) // make sure we're not deleting the last bit!
			){ 
				that.preventDefault();
				$(that.target).parent().parent().prev('.textarea-container').find('textarea').focus();
				cellular[theCellIndex].body.splice(theBitIndex, 1);
			}
		}

    	else if (map[13]){ // ENTER KEY
    		that.preventDefault();

			var theNewBit = {
				displayed: true,
				type:'plainText',
				tabCount:0,
				content:'',
				bitID: randomizr()
			};

			cellular[theCellIndex].body.splice(theBitIndex + 1, 0, theNewBit);

			setTimeout(function(){
				$(that.target).parent().parent().next('.textarea-container').find('textarea').focus();
			}, 50);
		}

		else if (map[9] && map[16]){ // SHIFT + TAB
			that.preventDefault();
			if (cellular[theCellIndex].body[theBitIndex].tabCount > 0)
				cellular[theCellIndex].body[theBitIndex].tabCount --;
		}

		else if (map[9]){ // TAB
			that.preventDefault();
			if (cellular[theCellIndex].body[theBitIndex].tabCount < 2)
				cellular[theCellIndex].body[theBitIndex].tabCount ++;
		}

		else if (
			(map[17] && map[91] && map[38]) || // MOVE LINE UP
			(map[17] && map[16] && map[38])
		){
			var movingUp = cellular[theCellIndex].body.splice(theBitIndex, 1)[0];
			cellular[theCellIndex].body.splice(theBitIndex - 1, 0, movingUp);
			$(that.target).focus();
			// reset the map array, else it fires up arrow on key up
			map = [];
		}		

		else if (map[38]){ // UP ARROW

			if ($theSizer.find('.hiddenCaret').position().top < 14){
				that.preventDefault();

				var $prevTA = $(that.target).parent().parent().prev('.textarea-container').find('textarea');
				
				var prevTACount = $prevTA.val().length;

				$prevTA.focus()[0]
				.setSelectionRange(10000, 10000);
			}
		}

		else if (
			(map[17] && map[91] && map[40]) || // MOVE LINE DOWN
			(map[17] && map[16] && map[40])
		){
			var movingUp = cellular[theCellIndex].body.splice(theBitIndex, 1)[0];
			cellular[theCellIndex].body.splice(theBitIndex + 1, 0, movingUp);
			$(that.target).focus();
			map = [];
		}

		else if (map[40]){ // DOWN ARROW
			if ($theSizer.find('.hiddenCaret').position().top > $theSizer.height() - 28){
				that.preventDefault();

				var $nextTA = $(that.target).parent().parent().next('.textarea-container').find('textarea');
				
				var nextTACount = $nextTA.val().length;

				// console.log(nextTACount-currentCaret);

				$nextTA.focus()[0]
				.setSelectionRange(nextTACount-currentCaret, nextTACount-currentCaret);
			}
		}

		else if (
			(map[17] && map[86]) || // PASTE
			(map[91] && map[86])
		){
			setTimeout(function(){

				var lines = that.target.value.split(/\r\n|\r|\n/g);

				cellular[theCellIndex].body[theBitIndex].content = lines[0];

				for (var l in lines){
					// HTTP
					if (
						lines[l].indexOf("http://") === 0 ||
						lines[l].indexOf("https://") === 0 
					){
						$.ajax({
							type: "GET",
							dataType:'JSONP',
							data:{
								URL: lines[l]
							},
							url: "http://re.ject.ch/tra/php/title.php"
						}).done( function(theTitle){
							cellular[theCellIndex].body[theBitIndex].content = _.unescape(theTitle.title);
							cellular[theCellIndex].body[theBitIndex].link = lines[l];


							var theNewBit = {
								displayed: true,
								type:'plainText',
								tabCount:0,
								content:'',
								bitID: randomizr()
							};

							cellular[theCellIndex].body.splice(theBitIndex + 1, 0, theNewBit);

							setTimeout(function(){
								$(that.target).parent().parent().next('.textarea-container').find('textarea').focus();
							}, 50);

						})
					}

					if (l > 0){

						var theNewBit = {
							displayed: true,
							type: 'plainText',
							tabCount: 0,
							content: lines[l],
							bitID: randomizr()
						};

						cellular[theCellIndex].body.splice((theBitIndex + l), 0, theNewBit);
						$theSizer.html(lines[0]);

					}
				}
			}, 250)
		}


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
				
			if (bottomBit > parentHeight){ // SWEET LET'S EXPAND

				for (var i in cellular[theCellIndex].dimensions) {
					cellular[theCellIndex].dimensions[i].sizeY++;

					var addition = (cellular[theCellIndex].dimensions[i].sizeY - 1) * .05;

					cellular[theCellIndex].dimensions[i].sizeY = parseInt(cellular[theCellIndex].dimensions[i].sizeY) + addition;
				}

				theActualCell.parentNode.classList.add('ui-resizable-resizing');

				theActualCell.parentNode.style.height = (cellular[theCellIndex].dimensions[$scope.columnCount].sizeY * GRIDSIZE) 
					// + ((cellular[theCellIndex].dimensions[columnCount].sizeY - 1) * GUTTERSIZE);

				setTimeout(function(){
					theActualCell.parentNode.classList.remove('ui-resizable-resizing')

					// make sure that the element isn't scrolled up!
					theActualCell.scrollIntoView;

					$scope.$parent.$root.packery.layout();

					lazyUpdater(theCell);
				},200)
			}
		}

		// UPDATE THAT SHIT YO
		cellUpdater(theCell, theCellIndex);
	}



	//                                                                                                                             
	//   ,ad8888ba,                                                                  88                       88     88            
	//  d8"'    `"8b              ,d                                                 ""                       88     ""            
	// d8'                        88                                                                          88                   
	// 88            ,adPPYYba, MM88MMM ,adPPYba,  ,adPPYb,d8  ,adPPYba,  8b,dPPYba, 88  ,adPPYba, ,adPPYYba, 88     88 ,adPPYba,  
	// 88            ""     `Y8   88   a8P_____88 a8"    `Y88 a8"     "8a 88P'   "Y8 88 a8"     "" ""     `Y8 88     88 I8[    ""  
	// Y8,           ,adPPPPP88   88   8PP""""""" 8b       88 8b       d8 88         88 8b         ,adPPPPP88 88     88  `"Y8ba,   
	//  Y8a.    .a8P 88,    ,88   88,  "8b,   ,aa "8a,   ,d88 "8a,   ,a8" 88         88 "8a,   ,aa 88,    ,88 88 888 88 aa    ]8I  
	//   `"Y8888Y"'  `"8bbdP"Y8   "Y888 `"Ybbd8"'  `"YbbdP"Y8  `"YbbdP"'  88         88  `"Ybbd8"' `"8bbdP"Y8 88 888 88 `"YbbdP"'  
	//                                             aa,    ,88                                                       ,88            
	//                                              "Y8bbdP"                                                      888P"            

	$scope.catSelector = function(e, newCat){

		// console.log('WHAT')
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

		if ($scope.startUpIndex === 3) $scope.SUB_right(false);
	}
})

                                                                                   
// 88888888ba                      88                      88          88             
// 88      "8b                     ""                      88          88             
// 88      ,8P                                             88          88             
// 88aaaaaa8P' ,adPPYba, ,adPPYba, 88 888888888 ,adPPYYba, 88,dPPYba,  88  ,adPPYba,  
// 88""""88'  a8P_____88 I8[    "" 88      a8P" ""     `Y8 88P'    "8a 88 a8P_____88  
// 88    `8b  8PP"""""""  `"Y8ba,  88   ,d8P'   ,adPPPPP88 88       d8 88 8PP"""""""  
// 88     `8b "8b,   ,aa aa    ]8I 88 ,d8"      88,    ,88 88b,   ,a8" 88 "8b,   ,aa  
// 88      `8b `"Ybbd8"' `"YbbdP"' 88 888888888 `"8bbdP"Y8 8Y"Ybbd8"'  88  `"Ybbd8"'  
                                                                                   
.directive('resizable', function($window) {
	return function($scope) {
		$scope.initializeWindowSize = _.debounce(function() {
			$scope.windowHeight = $window.innerHeight;
			$scope.windowWidth  = $window.innerWidth;
			$scope.$$childHead.columnCounter();

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

                                                                                                       
//        db                                                                                              
//       d88b                    ,d                                                                       
//      d8'`8b                   88                                                                       
//     d8'  `8b    88       88 MM88MMM ,adPPYba,  8b,dPPYba,   ,adPPYba,  88,dPYba,,adPYba,  8b       d8  
//    d8YaaaaY8b   88       88   88   a8"     "8a 88P'   `"8a a8"     "8a 88P'   "88"    "8a `8b     d8'  
//   d8""""""""8b  88       88   88   8b       d8 88       88 8b       d8 88      88      88  `8b   d8'   
//  d8'        `8b "8a,   ,a88   88,  "8a,   ,a8" 88       88 "8a,   ,a8" 88      88      88   `8b,d8'    
// d8'          `8b `"YbbdP'Y8   "Y888 `"YbbdP"'  88       88  `"YbbdP"'  88      88      88     Y88'     
//                                                                                               d8'      
//                                                                                              d8'       

.directive('autonomy', ['$rootScope', function($rootScope) {
    return {
        restrict: 'A',
        scope: {
            index: '@'
        },
        link: function(scope, element, attrs) {

        	var theIndex = parseInt(attrs.index);
        	var theElement = element[0];

        	var columnCount = scope.$parent.$parent.$parent.$parent.columnCount;

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

            // console.log('CELL HEIGHT IS ' + cellular[theIndex].dimensions[columnCount].sizeY)
            // console.log('FOR CELL ' + cellular[theIndex].id)

            $rootScope.packery.fit(
		    	element[0], 
		    	cellular[theIndex].dimensions[columnCount].col * (GRIDSIZE + GUTTERSIZE), 
		    	cellular[theIndex].dimensions[columnCount].row * (GRIDSIZE + GUTTERSIZE)
			);

            $rootScope.packery.layout();

            var $draggable = $(theElement).draggable({
            	handle:'.grab',
            	start: function(event, ui) {
            		// scope.$parent.$parent.$parent.$parent.draggingToggle = true;
            	},
            	stop: function(event, ui) {
            		// scope.$parent.$parent.$parent.$parent.draggingToggle = false;
            		setTimeout(function(){
            			var $theElement = $(theElement)
	            		cellular[theIndex].dimensions[columnCount].col = parseInt($theElement.css('left')) / (GRIDSIZE + GUTTERSIZE)
	            		cellular[theIndex].dimensions[columnCount].row = parseInt($theElement.css('top')) / (GRIDSIZE + GUTTERSIZE)

	            		// console.log('MOVED // ' + cellular[theIndex].id)

	            		lazyUpdater(cellular[theIndex].id)

						if (externalStartUpIndex === 5) setTimeout(function(){
							scope.$parent.$parent.$parent.$parent.SUB_right();
						}, 500);
            		}, 500);
				}
            }).resizable({
            	grid:210,
            	stop: function(event, ui) {
            		setTimeout(function(){
            			var $theElement = $(theElement)

            			for (var i in cellular[theIndex].dimensions){
		            		cellular[theIndex].dimensions[i].sizeY = parseInt($theElement.css('height')) / GRIDSIZE;
		            		cellular[theIndex].dimensions[i].sizeX = parseInt($theElement.css('width')) / GRIDSIZE;
            			}

	            		// console.log('RESIZED // ' + cellular[theIndex].id)
	            		// console.log(scope)

	            		lazyUpdater(cellular[theIndex].id)

						if (externalStartUpIndex === 4) setTimeout(function(){
							scope.$parent.$parent.$parent.$parent.SUB_right();
						}, 500);
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
}])









