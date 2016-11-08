App.controller('homeController', function($scope,DB,moment){
	//  BUAT CONTOH DROP DOWN
	$scope.sectors = [
		{ id:'1', name: 'Sector 1',region: 'Lembang'},
		{ id:'2', name: 'Sector 2',region: 'Lembang'},
		{ id:'3', name: 'Sector 3',region: 'Garut'},
		{ id:'4', name: 'Sector 4',region: 'Panyileukan'},
	  ];

	$scope.sector = {};
	$scope.sector.selectedValue = $scope.sectors[0];
});