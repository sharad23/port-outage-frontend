var app = angular.module('app',[
                                 'ngRoute',
                                 'ngCookies'
                                ]
                        );

app.config(function configure($routeProvider) {

	$routeProvider
		         .when('/', 
		         	      { 
		         	      	controller: 'UserController', 
		         	      	templateUrl: 'home/home.html' 
		         	      }
		         	  )
           
             .when('/login',
                         {
                           
                            controller: 'LoginController', 
                            templateUrl: 'login/login.html' 

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

app.run(function() {
  
    
     

});

app.factory('Data', function Data($http) {

	return {
			getUser: function getUser(id) { 

		   	                 return $http.get('user.php',id); 
		   	             },
		
			validateUser: function(data) { 

							 return $http.post('validateuser.php',data); 
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
              console.log('validating form');
             
              Data.validateUser($scope.validateData)
                     .success(function(data, status, headers, config)
					 
						/*{
							console.log(status + ' - ' + data);
						})
						.error(function(data, status, headers, config)
						{
							console.log('error');
						});*/
					 
					 
					 {
					 console.log(data);
                             if(typeof data
							 === 'undefined'){
                                   
                                 $scope.error = "Invalid Username or password";
                                 $scope.validateData.password = "";
                                 $location.path('/login');
                             
                             }
                             else{
							 
								console.log(data);

                                $cookieStore.put('user_id',data);
                                $location.path('/');
                             }
                     })
                     .error(function(data){
                         console.log('failed');
                          $scope.error = "Oops something went wrong";

                     })
              

         }
   
});



app.controller('UserController', function UsersController($scope,$cookieStore,$routeParams,$location,Data) {
    
         (function(){
            
              if(typeof $cookieStore.get('user_id') === 'undefined'){
 
                    $location.path('/login');
              }

         })()
         
         var get_login_user = function(){                     
                 
                 Data.getUser($routeParams.user_id)
                            .success(function(data){
                                  
                                  alert(JSON.stringify(data));
                                  $scope.user = data;
                                  
                                 
                            })
                            .error(function(data){
                                
                                  
                                  $scope.error = "Oops Something went wrong";
                                 
                            });
        
        
         }

         get_login_user();
         
       

         $scope.removeTrans =  function(id){
                
                
                Data.removeTrans(id)
                               .success(function(data){

                                     getTrans();

                                     
                               })
                               .error(function(data){

                                    $scope.error = "Opps! Somethig went wrong";
                               })
                 


         }
         

});
app.filter('range', function() {
 
    return function(input, total) {
        total = parseInt(total);
        for (var i=1; i<=total; i++)
        input.push(i);
        
        return input;
    };


});