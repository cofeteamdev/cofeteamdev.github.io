var App = angular.module('App',["ui.router","chart.js","ngSanitize","ui.select","mcwebb.twilio"]);

App.config(['$stateProvider','$urlRouterProvider','TwilioProvider',function($stateProvider,$urlRouterProvider,TwilioProvider) {
	$urlRouterProvider.otherwise('/home');
	$stateProvider
	.state('home',{
		url:'/home',
		templateUrl:'partials/home.html',
		controller:'homeController'
	}).state('sms',{
		url:'/sms',
		templateUrl:'partials/sms.html',
		controller:'smsController'
	});
	TwilioProvider.setCredentials({
		accountSid: 'AC17482244a4335daaade3632bdfd28a52',
		authToken: '20444212c6ffbc9a5f03ab31dd8c318a'
	});
}]);

App.constant('moment', moment);

App.factory('DB', ['$http', function($http){
	var apiKey = "rc3DYHu6kFfwUmIc5G1cyVmkvvB7jXZL";
	var MongoLabURL  = "https://api.mlab.com/api/1/databases/cofe/collections/logs?apiKey="+apiKey;
	var db = {};
	db.getData = function(id_device,callback){
		return $http.get(MongoLabURL,{
			params:{
				q:'{id_device:'+id_device+'}',
				s:'{timestamp: -1}',
				l: 7
			}
		}).success(function(data){
			callback(data);
		});
	};
	return db;
}]);

App.filter('propsFilter', function() {
	return function(items, props) {
		var out = [];

		if (angular.isArray(items)) {
			var keys = Object.keys(props);

			items.forEach(function(item) {
				var itemMatches = false;

				for (var i = 0; i < keys.length; i++) {
					var prop = keys[i];
					var text = props[prop].toLowerCase();
					if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
						itemMatches = true;
						break;
					}
				}

				if (itemMatches) {
					out.push(item);
				}
			});
		} else {
      // Let the output be the input untouched
      out = items;
  }

  return out;
};
});

App.controller('homeController', ['$scope','DB','moment', function($scope,DB,moment){
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
	$scope.refresh = function(){
		$scope.retrieved = false;
		$scope.selectedIdDevice = $scope.sector.selectedValue.id;
		DB.getData($scope.selectedIdDevice,function(response){
			$scope.response = response;
			parseData(response);
			$scope.retrieved = true;
		});
	}

	//  BUAT CONTOH DROP DOWN
	$scope.sectors = [
		{ id:'1', name: 'Sector 1',region: 'Lembang'},
		{ id:'2', name: 'Sector 2',region: 'Lembang'},
		{ id:'3', name: 'Sector 3',region: 'Garut'},
		{ id:'4', name: 'Sector 4',region: 'Panyileukan'},
	  ];

	  $scope.sector = {};
	  $scope.sector.selectedValue = $scope.sectors[0];
	
	$scope.itemArray = [
		{id: 1, name: 'first'},
		{id: 2, name: 'second'},
		{id: 3, name: 'third'},
		{id: 4, name: 'fourth'},
		{id: 5, name: 'fifth'},
	];

	$scope.selected = { value: $scope.itemArray[0] };
}]);

App.controller('smsController', ['$scope','Twilio', function($scope,Twilio){
	$scope.submit = function () {
		Twilio.create('Messages', {
			From: '+16626552742',
			To: '+628112244467',
			Body: $scope.textSMS
		})
		.success(function (data, status, headers, config) {
			$scope.success = true;
			$scope.textSMS = ''; // reset text sms..
		})
		.error(function (data, status, headers, config) {
			$scope.error = status;
		});
	};
}]);