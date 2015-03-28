angular.module('walletApp', [])
  .constant('CURRENCIES',
    [
      {value: 0, name: 'GBP', symbol:'£'},
      {value: 1, name: 'USD', symbol:'$'},
      {value: 2, name: 'EUR', symbol:'€'}
    ]
  )
  .controller('MainCtrl', function ($scope, CURRENCIES) {
    function init() {
      $scope.wallet = angular.fromJson(localStorage.getItem('wallet')) || {};
      $scope.money = {};
      $scope.money.in = $scope.money.out = 0;
      $scope.money.currencies = CURRENCIES;
      $scope.wallet.currency = $scope.wallet.currency ?
        $scope.money.currencies[$scope.wallet.currency.value] :
        $scope.money.currencies[0];
      $scope.wallet.total = $scope.wallet.total || 0;
      $scope.wallet.hasCurrency = function () {
        return localStorage.getItem('wallet');
      };

      $scope.wallet.checkFunds = function () {
        return ($scope.money.in - $scope.money.out + $scope.wallet.total >= 0)
      }
    };

    init();

    $scope.$on('reset', function () {
      init();
    });

    $scope.operate = function () {
      if (!$scope.wallet.operations) {
        $scope.wallet.operations = [];
      }

      var inAndOut = {'in': $scope.money.in, 'out': $scope.money.out};

      if ($scope.money.in - $scope.money.out + $scope.wallet.total < 0) {

        return;
      }

      angular.forEach(inAndOut, function (value, key) {
        if (value) {
          value = key === 'in' ? value : -value;

          $scope.wallet.operations.push({amount: value, date: new Date()});
        }
      });

      // reset total, then sum all operations made so far
      $scope.wallet.total = 0;

      angular.forEach($scope.wallet.operations, function (value) {
        $scope.wallet.total += value.amount;
      });

      localStorage.setItem('wallet', angular.toJson($scope.wallet));

      // clear fields
      $scope.money.in = $scope.money.out = 0;
    };
  })
  .controller('NavigationCtrl', function ($scope, $rootScope) {
    $scope.reset = function () {
      localStorage.clear();
      $rootScope.$broadcast('reset');
    };
  })
  .directive('cuEnsurePositiveNumber', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, ele, attrs, c) {
        scope.$watch(attrs.ngModel, function () {
          if(parseFloat(ele.val(),10) >= 0) {
            c.$positive = true;
            c.$valid = true;
          }
          else {
            if (ele.val() == ''){
              c.$positive = false;
              c.$valid = true;
            } else {
              c.$positive = false;
              c.$valid = false;
            }
          }
        })
      }
    }
  });