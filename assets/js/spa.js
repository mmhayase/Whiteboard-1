angular.module('Whiteboard', []);
angular.module('Whiteboard').controller('BaseCtrl', ['$scope', function ($scope){

	io.socket.get('/question', function (data){
		$scope.questions = data;
		// $scope.questions.converted = "thistext"
		$scope.$apply();
	});

	io.socket.on('question', function (event){
		switch (event.verb){
			case 'created':
				$scope.questions.push(event.data);
				console.log("Here in sockets");
				$scope.$apply();
				break;
			case 'destroyed':
				console.log("something was destroyed")
				var index = $scope.questions.indexOf(event.data);
				$scope.questions.splice(index,1);
				$scope.$apply();
		}
	});
}]);