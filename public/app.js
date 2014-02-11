var relikePages = angular.module('relikePages', ['ngRoute']);

relikePages .config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
		when('/pages/pagination/:pagination', {
			templateUrl: 'templates/pages.html',
			controller: 'getPages'
		}).
		when('/pages/:page_id', {
			templateUrl: 'templates/page.html',
			controller: 'getPage'
		}).
		when('/pages', {
			templateUrl: 'templates/pages.html',
			controller: 'getPages'
		}).
		when('/videos/:video_id', {
			templateUrl: 'templates/video.html',
			controller: 'getVideo'
		}).
		when('/posts/:post_id', {
			templateUrl: 'templates/post.html',
			controller: 'getPost'
		}).
		when('/videos', {
			templateUrl: 'templates/videos.html',
			controller: 'getVideos'
		}).
		otherwise({
			redirectTo: '/pages'
		});
	}
]);
  
relikePages.controller('getPages', function ($scope, $http, $routeParams, $location) {
	if ($routeParams.pagination){
		$scope.pagination = $routeParams.pagination;
	};
	$scope.ascs = [{value:'false'},{value:'true'}];
	$scope.asc = $scope.ascs[0];
	$scope.orders = [{value:'fan_count'},{value:'posts_count'},{value:'name'}];
	$scope.order = $scope.orders[0];
	$scope.limits = [{value:'36'},{value:'48'},{value:'72'}];
	$scope.limit = $scope.limits[0];
	$scope.skip = ($scope.pagination-1)*$scope.limit.value;
	
	$http({method: 'GET', url: 'http://54.194.78.241:3000/api/stats/pages'}).success(function(data){
		$scope.pages_count = data;
		console.log($scope.pages_count.value);
	});
	$scope.setPages = function(order,limit,asc,skip){
		$http({method: 'GET', url: 'http://54.194.78.241:3000/api/pages', params:{limit:limit,order:order,asc:asc,skip:skip}}).success(function(data){
			$scope.pages = data;
			$scope.setPagination($scope.pages_count.value,$scope.limit.value);
		});
	};
	$scope.setPagination = function(pages_count,limit){
		var pagination_total = pages_count/limit;
		var pagination_total = Math.ceil(pagination_total);
		$scope.pagination = pagination_total;
	};
	$scope.getPagination = function(num) {
		return new Array(num);   
	}
	$scope.setPages($scope.order.value,$scope.limit.value,$scope.asc.value,$scope.skip);
});
  
relikePages.controller('getPage', function ($scope, $http, $routeParams) {
	$http({method: 'GET', url: 'http://54.194.78.241:3000/api/pages/' + $routeParams.page_id + '/'}).success(function(data){
		$scope.page = data; // response data 
	});
	$http({method: 'GET', url: 'http://54.194.78.241:3000/api/pages/' + $routeParams.page_id + '/posts'}).success(function(data){
		$scope.page.posts = data; // response data 
	});
});
  
relikePages.controller('getPost', function ($scope, $http, $routeParams) {
	$http({method: 'GET', url: 'http://54.194.78.241:3000/api/posts/' + $routeParams.post_id + '/'}).success(function(data){
		$scope.post = data; // response data 
	});
});
  
  
relikePages.controller('getVideo', function ($scope, $http, $routeParams) {
	$http({method: 'GET', url: 'http://54.194.78.241:3000/api/videos/' + $routeParams.video_id + '/'}).success(function(data){
		$scope.code = $routeParams.video_id;
		$scope.video = data; // response data 
	});
});
  
relikePages.controller('getVideos', function ($scope, $http) {
	$http({method: 'GET', url: 'http://54.194.78.241:3000/api/videos?limit=36'}).success(function(data){
		$scope.videos = data; // response data 
	});
});

relikePages.directive('myYoutube', function($sce) {
  return {
    restrict: 'EA',
    scope: { code:'=' },
    replace: true,
    template: '<div style="height:400px;"><iframe style="overflow:hidden;height:100%;width:100%" width="100%" height="100%" src="{{url}}" frameborder="0" allowfullscreen></iframe></div>',
    link: function (scope) {
        scope.$watch('code', function (video_id) {
           if (video_id) {
               scope.url = $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + video_id);
           }
        });
    }
  };
});
  