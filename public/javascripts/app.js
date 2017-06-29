/***
Metronic AngularJS App Main Script
***/

/* Metronic App */
var AudienceApp = angular.module("AudienceApp", [
    "ui.router", 
    "ui.bootstrap", 
    "oc.lazyLoad",  
    "ngSanitize"
]); 

/* Configure ocLazyLoader(refer: https://github.com/ocombe/ocLazyLoad) */
AudienceApp.config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        cssFilesInsertBefore: 'ng_load_plugins_before' // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
    });
}]);

/********************************************
 BEGIN: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/
/**
`$controller` will no longer look for controllers on `window`.
The old behavior of looking on `window` for controllers was originally intended
for use in examples, demos, and toy apps. We found that allowing global controller
functions encouraged poor practices, so we resolved to disable this behavior by
default.

To migrate, register your controllers with modules rather than exposing them
as globals:

Before:

```javascript
function MyController() {
  // ...
}
```

After:

```javascript
angular.module('myApp', []).controller('MyController', [function() {
  // ...
}]);

Although it's not recommended, you can re-enable the old behavior like this:

```javascript
angular.module('myModule').config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);
**/

//AngularJS v1.3.x workaround for old style controller declarition in HTML
AudienceApp.config(['$controllerProvider', function($controllerProvider) {
  // this option might be handy for migrating old apps, but please don't use it
  // in new ones!
  $controllerProvider.allowGlobals();
}]);

/********************************************
 END: BREAKING CHANGE in AngularJS v1.3.x:
*********************************************/

/* Setup global settings */
AudienceApp.factory('settings', ['$rootScope', function($rootScope) {
    // supported languages
    var settings = {
        layout: {
            pageSidebarClosed: false, // sidebar state
            pageAutoScrollOnLoad: 1000 // auto scroll to top on page load
        },
        layoutImgPath: Metronic.getAssetsPath() + 'admin/layout/img/',
        layoutCssPath: Metronic.getAssetsPath() + 'admin/layout/css/'
    };

    $rootScope.settings = settings;

    return settings;
}]);

/* Setup App Main Controller */
AudienceApp.controller('AppController', ['$scope', '$rootScope', function($scope, $rootScope) {
    $scope.$on('$viewContentLoaded', function() {
        Metronic.initComponents(); // init core components
        //Layout.init(); //  Init entire layout(header, footer, sidebar, etc) on page load if the partials included in server side instead of loading with ng-include directive 
    });
}]);

/***
Layout Partials.
By default the partials are loaded through AngularJS ng-include directive. In case they loaded in server side(e.g: PHP include function) then below partial 
initialization can be disabled and Layout.init() should be called on page load complete as explained above.
***/

/* Setup Layout Part - Header */
AudienceApp.controller('HeaderController', ['$rootScope','$scope','$http', function($rootScope,$scope,$http) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initHeader(); // init header
    });

    $scope.logout = function () {
        $http.get('/users/logout').then(function (response) {
            $rootScope.$emit("userIntercepted", "logout", response);
        }, function () {
            $rootScope.$emit("userIntercepted", "logout", response);

        });
    };
}]);

/* Setup Layout Part - Sidebar */
AudienceApp.controller('SidebarController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initSidebar(); // init sidebar
    });
}]);

/* Setup Layout Part - Sidebar */
AudienceApp.controller('PageHeadController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {        
        Demo.init(); // init theme panel
    });
}]);

/* Setup Layout Part - Footer */
AudienceApp.controller('FooterController', ['$scope', function($scope) {
    $scope.$on('$includeContentLoaded', function() {
        Layout.initFooter(); // init footer
    });
}]);

/* Setup Rounting For All Pages */
AudienceApp.config(['$stateProvider', '$urlRouterProvider','$locationProvider', function($stateProvider, $urlRouterProvider,$locationProvider) {

    // Redirect any unmatched url
     $urlRouterProvider.otherwise("/app/dashboard.html");
    //$locationProvider.html5Mode(true);
    $stateProvider
        .state('app', {
            url: '/app',
            templateUrl: 'app.html'
        })
        // .state('app.dashboard', {
        //     url: '/dashboard.html',
        //     controller: ["$rootScope", "$state", function($rootScope, $state) {
        //                 $state.go('app.dashboard');
        //         }]
        // })
        // Dashboard
        .state('app.dashboard', {
            url: "/dashboard.html",
            templateUrl: "views/dashboard.html",            
            data: {pageTitle: 'Dashboard', pageSubTitle: 'statistics & reports'},
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'AudienceApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '/global/plugins/morris/morris.css',
                            '/admin/pages/css/tasks.css',
                            
                            '/global/plugins/morris/morris.min.js',
                            '/global/plugins/morris/raphael-min.js',
                            '/global/plugins/jquery.sparkline.min.js',

                            '/admin/pages/scripts/index3.js',
                            '/admin/pages/scripts/tasks.js',

                             'javascripts/controllers/DashboardController.js'
                        ] 
                    });
                }]
            }
        })
        .state('app.audience', { 
            url: '/audience',
            template: '<div ui-view></div>'
        })
        .state('app.audience.list', {
            url: "/list",
            templateUrl: "views/audience/audienceList.html",            
            data: {pageTitle: 'Dashboard', pageSubTitle: 'statistics & reports'},
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'AudienceApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                            '/global/plugins/select2/select2.css',
                            '/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                            '/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',
                            '/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',

                        ] 
                    });
                }]
            }
        })
        .state('app.audience.create', {
            url: "/create",
            templateUrl: "views/audience/audienceCreate.html",            
            data: {pageTitle: 'Dashboard', pageSubTitle: 'statistics & reports'},
            controller: "DashboardController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'AudienceApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'javascripts/controllers/DashboardController.js',
                            '/global/plugins/select2/select2.css',
                            '/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css'
                        ] 
                    });
                }]
            }
        })


        // AngularJS plugins
        .state('app.fileupload', {
            url: "/file_upload.html",
            templateUrl: "views/file_upload.html",
            data: {pageTitle: 'AngularJS File Upload', pageSubTitle: 'angularjs file upload'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'angularFileUpload',
                        files: [
                            '/global/plugins/angularjs/plugins/angular-file-upload/angular-file-upload.min.js',
                        ] 
                    }, {
                        name: 'AudienceApp',
                        files: [
                            'javascripts/controllers/GeneralPageController.js'
                        ]
                    }]);
                }]
            }
        })

        // UI Select
        .state('uiselect', {
            url: "/ui_select.html",
            templateUrl: "views/ui_select.html",
            data: {pageTitle: 'AngularJS Ui Select', pageSubTitle: 'select2 written in angularjs'},
            controller: "UISelectController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'ui.select',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '/global/plugins/angularjs/plugins/ui-select/select.min.css',
                            '/global/plugins/angularjs/plugins/ui-select/select.min.js'
                        ] 
                    }, {
                        name: 'AudienceApp',
                        files: [
                            'javascripts/controllers/UISelectController.js'
                        ] 
                    }]);
                }]
            }
        })

        // UI Bootstrap
        .state('uibootstrap', {
            url: "/ui_bootstrap.html",
            templateUrl: "views/ui_bootstrap.html",
            data: {pageTitle: 'AngularJS UI Bootstrap', pageSubTitle: 'bootstrap components written in angularjs'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'AudienceApp',
                        files: [
                            'javascripts/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })

        // Tree View
        .state('tree', {
            url: "/tree",
            templateUrl: "views/tree.html",
            data: {pageTitle: 'jQuery Tree View', pageSubTitle: 'tree view samples'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'AudienceApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '/global/plugins/jstree/dist/themes/default/style.min.css',

                            '/global/plugins/jstree/dist/jstree.min.js',
                            '/admin/pages/scripts/ui-tree.js',
                            'javascripts/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })     

        // Form Tools
        .state('formtools', {
            url: "/form-tools",
            templateUrl: "views/form_tools.html",
            data: {pageTitle: 'Form Tools', pageSubTitle: 'form components & widgets sample'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'AudienceApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '/global/plugins/bootstrap-switch/css/bootstrap-switch.min.css',
                            '/global/plugins/jquery-tags-input/jquery.tagsinput.css',
                            '/global/plugins/bootstrap-markdown/css/bootstrap-markdown.min.css',
                            '/global/plugins/typeahead/typeahead.css',

                            '/global/plugins/fuelux/js/spinner.min.js',
                            '/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',
                            '/global/plugins/jquery-inputmask/jquery.inputmask.bundle.min.js',
                            '/global/plugins/jquery.input-ip-address-control-1.0.min.js',
                            '/global/plugins/bootstrap-pwstrength/pwstrength-bootstrap.min.js',
                            '/global/plugins/bootstrap-switch/js/bootstrap-switch.min.js',
                            '/global/plugins/jquery-tags-input/jquery.tagsinput.min.js',
                            '/global/plugins/bootstrap-maxlength/bootstrap-maxlength.min.js',
                            '/global/plugins/bootstrap-touchspin/bootstrap.touchspin.js',
                            '/global/plugins/typeahead/handlebars.min.js',
                            '/global/plugins/typeahead/typeahead.bundle.min.js',
                            '/admin/pages/scripts/components-form-tools.js',

                            'javascripts/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })        

        // Date & Time Pickers
        .state('pickers', {
            url: "/pickers",
            templateUrl: "views/pickers.html",
            data: {pageTitle: 'Date & Time Pickers', pageSubTitle: 'date, time, color, daterange pickers'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'AudienceApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '/global/plugins/clockface/css/clockface.css',
                            '/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '/global/plugins/bootstrap-timepicker/css/bootstrap-timepicker.min.css',
                            '/global/plugins/bootstrap-colorpicker/css/colorpicker.css',
                            '/global/plugins/bootstrap-daterangepicker/daterangepicker-bs3.css',
                            '/global/plugins/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',

                            '/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '/global/plugins/bootstrap-timepicker/js/bootstrap-timepicker.min.js',
                            '/global/plugins/clockface/js/clockface.js',
                            '/global/plugins/bootstrap-daterangepicker/moment.min.js',
                            '/global/plugins/bootstrap-daterangepicker/daterangepicker.js',
                            '/global/plugins/bootstrap-colorpicker/js/bootstrap-colorpicker.js',
                            '/global/plugins/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',

                            '/admin/pages/scripts/components-pickers.js',

                            'javascripts/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        })

        // Custom Dropdowns
        .state('dropdowns', {
            url: "/dropdowns",
            templateUrl: "views/dropdowns.html",
            data: {pageTitle: 'Custom Dropdowns', pageSubTitle: 'select2 & bootstrap select dropdowns'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load([{
                        name: 'AudienceApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '/global/plugins/bootstrap-select/bootstrap-select.min.css',
                            '/global/plugins/select2/select2.css',
                            '/global/plugins/jquery-multi-select/css/multi-select.css',

                            '/global/plugins/bootstrap-select/bootstrap-select.min.js',
                            '/global/plugins/select2/select2.min.js',
                            '/global/plugins/jquery-multi-select/js/jquery.multi-select.js',

                            '/admin/pages/scripts/components-dropdowns.js',

                            'javascripts/controllers/GeneralPageController.js'
                        ] 
                    }]);
                }] 
            }
        }) 

        // Advanced Datatables
        .state('datatablesAdvanced', {
            url: "/datatables/advanced.html",
            templateUrl: "views/datatables/advanced.html",
            data: {pageTitle: 'Advanced Datatables', pageSubTitle: 'advanced datatables samples'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'AudienceApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '/global/plugins/select2/select2.css',                             
                            '/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css', 
                            '/global/plugins/datatables/extensions/Scroller/css/dataTables.scroller.min.css',
                            '/global/plugins/datatables/extensions/ColReorder/css/dataTables.colReorder.min.css',

                            '/global/plugins/select2/select2.min.js',
                            '/global/plugins/datatables/all.min.js',
                            'javascripts/scripts/table-advanced.js',

                            'javascripts/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // Ajax Datetables
        .state('datatablesAjax', {
            url: "/datatables/ajax.html",
            templateUrl: "views/datatables/ajax.html",
            data: {pageTitle: 'Ajax Datatables', pageSubTitle: 'ajax datatables samples'},
            controller: "GeneralPageController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'AudienceApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '/global/plugins/select2/select2.css',                             
                            '/global/plugins/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
                            '/global/plugins/datatables/plugins/bootstrap/dataTables.bootstrap.css',

                            '/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '/global/plugins/select2/select2.min.js',
                            '/global/plugins/datatables/all.min.js',

                            '/global/scripts/datatable.js',
                            'javascripts/scripts/table-ajax.js',

                            'javascripts/controllers/GeneralPageController.js'
                        ]
                    });
                }]
            }
        })

        // User Profile
        .state("profile", {
            url: "/profile",
            templateUrl: "views/profile/main.html",
            data: {pageTitle: 'User Profile', pageSubTitle: 'user profile sample'},
            controller: "UserProfileController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'AudienceApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '/global/plugins/bootstrap-fileinput/bootstrap-fileinput.css',
                            '/admin/pages/css/profile.css',
                            '/admin/pages/css/tasks.css',
                            
                            '/global/plugins/jquery.sparkline.min.js',
                            '/global/plugins/bootstrap-fileinput/bootstrap-fileinput.js',

                            '/admin/pages/scripts/profile.js',

                            'javascripts/controllers/UserProfileController.js'
                        ]                    
                    });
                }]
            }
        })

        // User Profile Dashboard
        .state("profile.dashboard", {
            url: "/dashboard",
            templateUrl: "views/profile/dashboard.html",
            data: {pageTitle: 'User Profile', pageSubTitle: 'user profile dashboard sample'}
        })

        // User Profile Account
        .state("profile.account", {
            url: "/account",
            templateUrl: "views/profile/account.html",
            data: {pageTitle: 'User Account', pageSubTitle: 'user profile account sample'}
        })

        // User Profile Help
        .state("profile.help", {
            url: "/help",
            templateUrl: "views/profile/help.html",
            data: {pageTitle: 'User Help', pageSubTitle: 'user profile help sample'}      
        })

        // Todo
        .state('todo', {
            url: "/todo",
            templateUrl: "views/todo.html",
            data: {pageTitle: 'Todo', pageSubTitle: 'user todo & tasks sample'},
            controller: "TodoController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({ 
                        name: 'AudienceApp',  
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            '/global/plugins/bootstrap-datepicker/css/datepicker3.css',
                            '/global/plugins/select2/select2.css',
                            '/admin/pages/css/todo.css',
                            
                            '/global/plugins/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
                            '/global/plugins/select2/select2.min.js',

                            '/admin/pages/scripts/todo.js',

                            'javascripts/controllers/TodoController.js'  
                        ]                    
                    });
                }]
            }
        })
        .state('access',{
            url:'/access',
            templateUrl: "views/admin/signin.html",
            data: {pageTitle: '登录', pageSubTitle: ''},
            controller: "SignInController",
            resolve: {
                deps: ['$ocLazyLoad', function($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'AudienceApp',
                        insertBefore: '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
                        files: [
                            'javascripts/controllers/SigninController.js'
                        ]
                    });
                }]
            }

        })

}]);

/* Init global settings and run the app */
AudienceApp.run(["$rootScope", "settings", "$state",'$location', function($rootScope, settings, $state,$location) {
    var defaultRoutePage = {
        //"app.dashboard": "app.dashboard"
    };

    if (typeof window.curUser !== 'undefined' && window.curUser) {
        $rootScope.user = window.curUser;
    }

    //用户状态变化
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if (toState.name.indexOf('access') >= 0) return; // 如果是进入登录界面则允许
        console.log(toState.name);
        // 如果用户不存在
        if (!$rootScope.user || !$rootScope.user.UserId) {
            event.preventDefault(); // 取消默认跳转行为
            var data = {};
            if (toState.name.indexOf('access') < 0) {
                data = {
                    from: toState.name,
                    w: 'notLogin'
                };
            }
            $state.go("access", data); //跳转到登录界面
        } else {
            if($rootScope.user.permission == -1){
                // 管理员随意
                return;
            } else if ($rootScope.user.permissions && $rootScope.user.permissions.length > 0) {
                // 否则没有权限则跳转到403
                if (toState.name != 'app.dashboard') {
                    var hasRight = $rootScope.user.permissions.filter(item => {
                        return item.weight == 2 && item.target_uri == toState.name;
                    });
                    if (hasRight.length == 0) {
                        $location.path('access/403');
                    }
                }
            } else {
                //$location.path('app/dashboard.html');
            }
        }
        if (defaultRoutePage[toState.name]) {
            //$state.go(defaultRoutePage[toState.name]);
            event.preventDefault();
        }
    });

    $rootScope.$on('userIntercepted', function (errorType) {
        $rootScope.user = null;
        var data = {};
        if ($state.current.name.indexOf('access') < 0) {
            data = {
                from: $state.current.name,
                w: errorType
            };
        } else {
            $state.go("access", data);
        }
        location.reload();
        // $state.go("access.signin", data);
    });

    $rootScope.$state = $state; // state to be accessed from view
}]);