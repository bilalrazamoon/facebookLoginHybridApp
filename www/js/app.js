angular.module('app', ['ionic', 'ngCordova'])
    .run(function ($ionicPlatform,$rootScope,$state, $log) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
        function isLogin(){
            if(localStorage.login==undefined){
                return false;
            }
            else{
                return JSON.parse(localStorage.login)
            }
        }
        $rootScope.user={};
        if(localStorage.user!=undefined && isLogin()){
            $rootScope.user=JSON.parse(localStorage.user);
            $log.log($rootScope.user)
        }
        $rootScope.$on('$stateChangeSuccess',
            function(event, toState, toParams, fromState, fromParams){
                if(toState.name=="home" && !isLogin()){
                    event.preventDefault();
                    $state.go('login');
                }else if(toState.name=="login" && isLogin()){
                    event.preventDefault();
                    $state.go('home');
                }
            })
    })
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('login', {
                url: "/login",
                templateUrl: "templates/login.html",
                controller: 'loginCtrl'
            })
            .state('home', {
                url: "/home",
                templateUrl: "templates/home.html",
                controller: 'homeCtrl'
            });
        $urlRouterProvider.otherwise('/home');
    });