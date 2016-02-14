var app = angular.module('app',['ngRoute', 'ngCookies']);
app.config(function configure($routeProvider) {

	$routeProvider
		         .when('/', 
		         	      { 
		         	      	controller: 'UsersController', 
		         	      	templateUrl: './templates/customers.html' 
		         	      }
		         	  )
             .when('/user/:user_id',
                         {
                           
                            controller: 'UserController', 
                            templateUrl: './templates/customer.html' 

                         }
                      )
             .when('/login',
                         {
                           
                            controller: 'LoginController', 
                            templateUrl: './templates/login.html' 

                         }
                      )
             .when('/logout',
                          {
                               
                             controller: 'LogoutController',
                             template: " ",  
                          }
                  )
              .otherwise({ redirect: '/' });
});


app.factory('Data', function Data($http) {

	return {

		  
       validateUser: function(data) { 

                         return $http.post('/public/validate-user',data); 
                     },

       }


});



app.controller('LogoutController',function LogoutController($scope,$cookieStore,$location){
       
       $cookieStore.remove("user_id");
       $location.path('/');

});


app.controller('LoginController', function UsersController($scope,$cookieStore,$location,Data) {
    
         $scope.validateData = { 'username' : '','password':'' };
         $scope.validate = function(){
              
             
              Data.validateUser($scope.validateData)
                     .success(function(data){

                             if(typeof data.id === 'undefined'){
                                   
                                 $scope.error = "Invalid Username or password";
                                 $scope.validateData.password = "";
                                 $location.path('/login');
                             
                             }
                             else{

                                $cookieStore.put('user_id',data.id);
                                $location.path('/');
                             }
                     })
                     .error(function(data){
                         
                          $scope.error = "Oops something went wrong";

                     })
              

         }
   
});