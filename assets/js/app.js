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
	}).state('dashboard',{
		url:'/dashboard/:id',
		templateUrl:'partials/dashboard.html',
		controller:'dashboardController'
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