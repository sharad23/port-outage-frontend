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

		   	                 return $http.get('/angular/getusers'); 
		   	             },

		   getUser: function getUser(id) { 

		   	                 return $http.get('/angular/users/'+ id); 
		   	             },
		   addUser: function addUser(data) { 

		   	                 return $http.post('/angular/users', data); 
		   	             },
		   removeUser: function removeUser(id) { 

		   	                 return $http.delete('/angular/users/'+ id); 
		   	             },
     
       validateUser: function(data) { 

                         return $http.post('/angular/validate-user',data); 
                     },

       }


});




app.controller('LogoutController',function LogoutController($scope,$cookieStore,$location){
       
       $cookieStore.remove("user_id");
       $location.path('/');

});


app.controller('LoginController', function UsersController($scope,$cookieStore,$location,Data) {
	
	  $http.get('employees.json').success(function (data){
        $scope.employees = data;
    });


    
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


app.controller('UsersController', function UsersController($scope,$cookieStore,$location,Data) {
    
    (function(){
             

             if(typeof $cookieStore.get('user_id') === 'undefined'){
			 
					//console.log('login');
 
                    $location.path('/login');
              }  

    })()

  
    Data.getUsers().success(function(data){

    	  console.log(data);
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
app.filter('range', function() {
 
    return function(input, total) {
        total = parseInt(total);
        for (var i=1; i<=total; i++)
        input.push(i);
        
        return input;
    };


});

app.directive('test2', function ($compile) {
      
      return {
          restrict: 'A',
          link: function ($scope, element, attrs) {
              
           
              var element1 = element.find('a').first();
              element1.click(function(e){
                  e.preventDefault();
                  $scope.counter++;
                  var input = angular.element("<p><input placeholder='Broker' ng-model=newTransaction.brokers["+ $scope.counter +"] style='width: 99%'><a class=remove>[-]</a><p>");
                  var compile = $compile(input)($scope);
                  element.append(input);
               


              });
              
              $(document).on('click','.remove',function(e){
                  e.preventDefault();
                  $(this).closest('p').remove();
              });
              
          },
         

      };
  });

app.directive('datatable',function(){

     return {

         restrict: 'A',
         link: function($scope,element,attrs){
                 
                  element.on('click','.test',function(){

                       $('.active').removeClass("active");
                       $(this).addClass("active");
                     
                  });

                  element.on('click','.remove',function(){

                         $(this).closest('tr').remove();
                  })


         },
         controller: function($scope,DataTables,$cookieStore,$routeParams){
                

                (function(){
                       
                       
                       $scope.limit = 5;
                       $scope.search = "";
                       $scope.offset = 0;
                       DataTables.getTransacation($routeParams.user_id,$scope.offset,$scope.limit,$scope.search)
                                .success(function(data){
                                      
                                   
                                      $scope.datas = data.trans;
                                      $scope.total = data.total;
                                      $scope.pages = Math.ceil($scope.total/$scope.limit);

                                })
                                .error(function(error){

                                      $scope.msg = "Oops something went wrong";
                                })

                      var fetch =  function(){
                       
                            DataTables.getTransacation($cookieStore.get('user_id'),$scope.offset,$scope.limit,$scope.search)
                                .success(function(data){
                                     
                                        //alert(JSON.stringify(data))
                                        $scope.datas = data.trans;
                                        $scope.total = data.total;
                                        $scope.pages = Math.ceil($scope.total/$scope.limit);

                                });
                          
                      }
                      $scope.doSearch = function(){
                            
                            $scope.offset = 0;
                            fetch();

                      }
                      $scope.page = function(num){
                             
                             $scope.offset = num - 1;
                             fetch();
                      }
                                

                })(); 
         },
         templateUrl:'./packages/templates/datatable.html',
     }

});




  