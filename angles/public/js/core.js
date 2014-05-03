var scotchTodo = angular.module('scotchTodo', []);

var helper;

function mainController($scope, $http) {
	// when landing on the page, get all todos and show them
	$http.get('/api/testData')
		.success(function(data) {
			// $scope.traject = data;
			console.log(data)
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	// when submitting the add form, send the text to the node API
	$scope.createTodo = function() {
		$http.post('/api/testData', $scope.formData)
			.success(function(data) {
				$scope.formData = {}; // clear the form so our user is ready to enter another
				// $scope.traject = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	// delete a todo after checking it
	$scope.deleteTodo = function(id) {
		$http.delete('/api/testData/' + id)
			.success(function(data) {
				$scope.testData = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	$scope.init = function () {
		// console.log($('.grid'))	
	    $(".grid").gridster({
	        widget_margins: [10,10],
	        widget_base_dimensions:
	        	[140,140
	        // 		($windowPane.width() / 5 ) - 20,
	    	 		// ($windowPane.height() / 5 ) - 20
	        	],
	        resize: {
				enabled: true
			},
			draggable: {
	            handle: '.grab'
	        }
	    });
	};



	$scope.gridsterOpts = {
		margins: [20, 20],
		draggable: {
			enabled: false
		},
		resizable: {
			enabled: false
		}
	};

	// these map directly to gridsterItem options
	$scope.standardItems = [
		{ sizeX: 2, sizeY: 1, row: 0, col: 0 },
		{ sizeX: 2, sizeY: 2, row: 0, col: 2 },
		{ sizeX: 1, sizeY: 1, row: 0, col: 4 },
		{ sizeX: 1, sizeY: 1, row: 0, col: 5 },
		{ sizeX: 2, sizeY: 1, row: 1, col: 0 },
		{ sizeX: 1, sizeY: 1, row: 1, col: 4 },
		{ sizeX: 1, sizeY: 2, row: 1, col: 5 },
		{ sizeX: 1, sizeY: 1, row: 2, col: 0 },
		{ sizeX: 2, sizeY: 1, row: 2, col: 1 },
		{ sizeX: 1, sizeY: 1, row: 2, col: 3 },
		{ sizeX: 1, sizeY: 1, row: 2, col: 4 }
	];

	// these are non-standard, so they require mapping options
	$scope.customItems = [
		{ size: { x: 2, y: 1 }, position: [0, 0] },
		{ size: { x: 2, y: 2 }, position: [0, 2] },
		{ size: { x: 1, y: 1 }, position: [0, 4] },
		{ size: { x: 1, y: 1 }, position: [0, 5] },
		{ size: { x: 2, y: 1 }, position: [1, 0] },
		{ size: { x: 1, y: 1 }, position: [1, 4] },
		{ size: { x: 1, y: 2 }, position: [1, 5] },
		{ size: { x: 1, y: 1 }, position: [2, 0] },
		{ size: { x: 2, y: 1 }, position: [2, 1] },
		{ size: { x: 1, y: 1 }, position: [2, 3] },
		{ size: { x: 1, y: 1 }, position: [2, 4] }
	];

	$scope.emptyItems = [
		{ name: 'Item1' },
		{ name: 'Item2' },
		{ name: 'Item3' },
		{ name: 'Item4' }
	];

	// map the gridsterItem to the custom item structure
	$scope.customItemMap = {
		sizeX: 'item.size.x',
		sizeY: 'item.size.y',
		row: 'item.position[0]',
		col: 'item.position[1]'
	};

}