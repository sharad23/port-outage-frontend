var app = angular.module('app',[
                                 'ngRoute',
                                 'ngCookies'
                                ]
                        );

app.config(function configure($routeProvider) {

	$routeProvider
		         .when('/', 
		         	      { 
		         	      	controller: 'UsersController', 
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

		   getUsers: function getUsers() { 

		   	                 return $http.get('/angular/public/users'); 
		   	             },

		   getUser: function getUser(id) { 

		   	                 return $http.get('/angular/public/users/'+ id); 
		   	             },
		   addUser: function addUser(data) { 

		   	                 return $http.post('/angular/public/users', data); 
		   	             },
		   removeUser: function removeUser(id) { 

		   	                 return $http.delete('/angular/public/users/'+ id); 
		   	             },
           
       addTrans : function(data){

                         return $http.post('/angular/public/transactions',data);
                        
                     },

       removeTrans: function(id) { 

                         return $http.delete('/angular/public/transactions/'+ id); 
                     },

       validateUser: function(data) { 

                         return $http.post('/angular/public/validate-user',data); 
                     },

       }


});


app.controller('UsersController', function UsersController($scope,$cookieStore,$location,Data) {
    
    (function(){
             

             if(typeof $cookieStore.get('user_id') === 'undefined'){
 
                    $location.path('/login');
              }  

    })()

  
    Data.getUsers().success(function(data){

    	  //console.log(data);
    	  $scope.users = data;
    });
     
   
     
    $scope.newUser = { username: ''};
    $scope.addUser = function() {
       
        var username = $scope.newUser.username;
        Data.addUser({
            
            username: username,
            
        })
        .success(UserAddSuccess).error(UserAddError);
        
        
    }
     
    function UserAddSuccess(data) {
        $scope.error = null;
        $scope.users.push(data);
        $scope.newUser = { username: '' };

    }
 
    function UserAddError(data) {
        $scope.error = "Oops Something went wrong";
    }
     
    $scope.removeUser = function(id) {
   
        if (confirm('Do you really want to remove this customer?')) {
                
                Data.removeUser(id).success(userRemoveSuccess);
        
        }
    }
     
    function userRemoveSuccess(data) {
        
        var i = $scope.users.length;
        while (i--) {
            
            if ($scope.users[i].id == data) {
                
                  $scope.users.splice(i, 1);
            
            }
        }
    
    }


   
});


app.controller('UserController', function UsersController($scope,$cookieStore,$routeParams,$location,Data) {
    
         (function(){
            
              if(typeof $cookieStore.get('user_id') === 'undefined'){
 
                    $location.path('/login');
              }

         })()
         
         $scope.counter = 0;
         $scope.newTransaction = {
                                 'amount' : '',
                                 'description' : '',
                                 'brokers':[

                                           ],
                               

                              }
         var getTrans = function(){                     
                 
                 Data.getUser($routeParams.user_id)
                            .success(function(data){
                                  
                                  //alert(JSON.stringify(data));
                                  $scope.user = data;
                                  $scope.transactions = data.transactions;
                                  
                                 
                            })
                            .error(function(data){
                                
                                  
                                  $scope.error = "Oops Something went wrong";
                                 
                            });
        
        
         }

         getTrans();
         
         $scope.addTrans =  function(){
                 
                 $scope.newTransaction.user_id = $routeParams.user_id;
                 
                 Data.addTrans($scope.newTransaction)
                               .success(function(data){
                                     
                                     alert(JSON.stringify($scope.newTransaction));
                                     $scope.transactions.push(data);
                                     $scope.datas.push(data);
                                     $scope.newTransaction = {
                                         'amount' : '',
                                         'description' : '',
                                          'brokers':[

                                                    ],
                               
                                     }
                               })
                               .error(function(data){

                                    $scope.error = "Opps! Somethig went wrong";
                               })
                  
                 
         }

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
