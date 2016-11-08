App.controller('dashboardController', ['$stateParams','$scope','DB','moment', function($stateParams,$scope,DB,moment) {
	$scope.data_kelembapan = [];
	$scope.data_labels = [];

	$scope.labels = $scope.data_labels;//["January", "February", "March", "April", "May", "June", "July"];
	$scope.series = ['Kelembapan'];
	$scope.data = $scope.data_kelembapan;
	
	
	$scope.onClick = function (points, evt) {
		console.log(points, evt);
	};
	$scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
	$scope.options = {
		scales: {
			yAxes: [
				{
					id: 'y-axis-1',
					type: 'linear',
					display: true,
					position: 'left'
				}
			]
		}
	};

	// Untuk parsing dari server agar sesuai..
	function parseData(datas){
		console.log(datas);
		$scope.data_kelembapan = [];
		$scope.data_labels = [];
		for (var i = datas.length-1; i >= 0 ; i--) {
			$scope.data_kelembapan.push(datas[i].kelembapan);
			
			var label = moment.unix(datas[i].timestamp).utcOffset("+07:00").format('HH:mm');
			$scope.data_labels.push(label);
		};
		$scope.labels = $scope.data_labels;
		$scope.data = [$scope.data_kelembapan];
	}

	$scope.selectedIdDevice = 1;
	$scope.retrieved = false;
	$scope.init = function(){
		$scope.retrieved = false;
		$scope.selectedIdDevice = $stateParams.id;
		DB.getData($scope.selectedIdDevice,function(response){
			$scope.response = response;
			parseData(response);
			$scope.retrieved = true;
		});
	}
}]);