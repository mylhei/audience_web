/**
 * Created by leiyao on 16/12/9.
 */

AudienceApp.controller('SignInController', ['$rootScope','$scope','$http','$timeout','$state',function($rootScope, $scope, $http, $timeout,$state) {
    $scope.$on('$viewContentLoaded', function() {
        Metronic.initAjax(); // initialize core components
    });

    // set sidebar closed and body solid layout mode
    $rootScope.settings.layout.pageAutoScrollOnLoad = 1500;
    $rootScope.settings.layout.pageSidebarClosed = true;
    $rootScope.settings.layout.fullscreen = true;

    $scope.user = {};
    $scope.user.username = localStorage.user?JSON.parse(localStorage.user).username:"";
    $scope.authError = null;
    $scope.login = function () {
        $scope.authError = null;
        // Try to login
        $http.post('users/signin', {username: $scope.user.username, password: $scope.user.password})
            .then(function (response) {
                if (!response.data || response.data.header.code != 0) {
                    $scope.authError = response.data.body|| '用户名或密码不正确';
                } else {
                    $rootScope.user = response.data.body;

                    localStorage && (localStorage.user = JSON.stringify($rootScope.user));

                    console.log($rootScope.user);

                    $state.go('app.dashboard');
                    //appTools.socket_connect();
                }
            }, function (x) {
                $scope.authError = 'Server Error';
            });
    };

}]);