angular.module('Whiteboard', []);
angular.module('Whiteboard').controller('BaseCtrl', ['$scope', function ($scope){

	io.socket.get('/question', function (data){
		$scope.questions = data;
		$scope.$apply();
	});

	io.socket.on('question', function (event){
		switch (event.verb){
			case 'created':
				$scope.questions.push(event.data);
				$scope.$apply();
				break;
		}
	});

}]);