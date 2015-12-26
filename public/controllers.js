angular.module('app.controllers', [])

.controller('mainCtrl', function($scope, $http) {
    $scope.formData = {text:""};

    // when landing on the page, get all todos and show them
    $http.get('/api/orders')
        .success(function(data) {
            $scope.orders = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createOrder = function() {
        $http.post('/api/orders', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.orders = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a todo after checking it
    $scope.deleteOrder = function(id) {
        $http.delete('/api/orders/' + id)
            .success(function(data) {
                $scope.orders = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

})
            