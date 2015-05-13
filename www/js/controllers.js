angular.module('app')
    .controller('loginCtrl', function ($scope, $rootScope, $state, $cordovaFacebook, $ionicLoading, $http, $log) {
        var permissions = ["public_profile", "email", "user_birthday"];

        var getBase64Image = function (url, success, error) {
            $http.get(url, {responseType: 'blob'})
                .success(function (data) {
                    var reader = new FileReader();
                    reader.onloadend = function () {
                        success(reader.result);
                    };
                    reader.readAsDataURL(data);
                }).error(function (msg, code) {
                    $log.log(msg, code);
                });
        };
        $scope.login = function () {
            $ionicLoading.show({template: "Logging..."});
            $cordovaFacebook.login(permissions).then(function (data) {
                $cordovaFacebook.api('/me', []).then(function (result) {
                    $rootScope.user = result;
                    $cordovaFacebook.api('/me/picture?width=500&redirect=false', []).then(function (picResult) {
                        $rootScope.user.picture = picResult.data.url;
                        getBase64Image($rootScope.user.picture, function (image) {
                            $rootScope.user.picture = image;
                            localStorage.user = JSON.stringify($rootScope.user);
                        }, function () {

                        });
                        $ionicLoading.hide();
                        console.log($rootScope.user);
                        localStorage.user = JSON.stringify($rootScope.user);
                        localStorage.login = true;
                        $state.go('home')
                    }, function (err) {
                        $ionicLoading.hide();
                        $log.log(JSON.stringify(err))
                    })
                }, function (err) {
                    $ionicLoading.hide();
                    $log.log(JSON.stringify(err))
                });
            }, function (err) {
                $ionicLoading.hide();
                alert('Try Again');
            })
        }
    })
    .controller('homeCtrl', function ($scope, $state, $cordovaFacebook) {
        $scope.logout = function () {
            $cordovaFacebook.logout()
                .then(function (success) {
                    localStorage.login = false;
                    $state.go('login')
                }, function (err) {
                    alert("Can't logged out");
                });
        }
    });