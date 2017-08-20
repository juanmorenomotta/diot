angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('DiotsCtrl', function($scope, diot) {

  $scope.envs = diot.all();
  $scope.remove = function(sensor) {
    diot.remove(sensor);
  };


})

.controller('DiotDetailCtrl', function($scope, $stateParams, diot, $http) {
  var url    = "";
  var usr    = "";
  var pss    = "";
  $scope.sensores = {
    luz: false,
    pres: false,
    temp: 0,
    air: 0
  };

  if(window.localStorage.getItem("url") !== undefined) {
      url = window.localStorage.getItem("url");
      usr = window.localStorage.getItem("usr");
      pss = window.localStorage.getItem("pss");
  } else {
      alert("No existe Servidor configurado, ir a Configuración");
  }

  console.log(url);
  console.log(usr);
  console.log(pss);

  $scope.envs = diot.get($stateParams.diotId);

  $scope.luzChange = function() {
        var valor = ""
        valor = $scope.sensores.luz ? "on" : "off";
        console.log("Estoy en el topico: "+$scope.envs.topic + '/luz/set = ' + valor);
        client.publish($scope.envs.topic + '/luz/set', valor);
  };

  $scope.airChange = function(){
        var valor = ""
        valor = $scope.sensores.air;
        client.publish($scope.envs.topic + '/air/set', valor);
  };

  // Implementamos MQTT
  var options = {
      username: usr, //'gnkebpyu', // "pi",
      password: pss  //'VVXMeNUbeKnn'  //"raspberry"
  };
  // url = 'ws://192.168.0.20:1884'
  // wss://m21.cloudmqtt.com:35995
  // url = 'wss://' + url;
  console.log("Estoy accediendo a : "+url);
  var client = mqtt.connect(url,options);

  client.on('connect', function() {
    console.log('Client started...');
    client.subscribe($scope.envs.topic + '/+',0);
  });


  client.on('message', function(topic, message) {
          payload = message.toString();
          var env = $scope.envs.topic;
          if(topic== env + "/luz"){
            $scope.$apply(function(){
              $scope.sensores.luz  = (payload === "on" ? true: false);
            });
          } else if(topic== env + "/air"){
            $scope.$apply(function(){
              $scope.sensores.air  = payload;
            });
          } else if(topic== env + "/temp"){
            $scope.$apply(function(){
              $scope.sensores.temp  = payload;
            });
          } else if(topic== env + "/pres"){
            $scope.$apply(function(){
              $scope.sensores.pres  = payload;
              $scope.presencia     = $scope.sensores.pres === "true" ? "ion-person" : "";
            });
          }
  });  

})

.controller('SettingCtrl', function($scope, $ionicHistory, $state) {
  var url = window.localStorage.getItem("url") !== undefined ? window.localStorage.getItem("url"): "";
  var usr = window.localStorage.getItem("usr") !== undefined ? window.localStorage.getItem("usr"): "";
  var pss = window.localStorage.getItem("pss") !== undefined ? window.localStorage.getItem("pss"): "";

  $scope.configuracion = {
    url: url,
    usr: usr,
    pss: pss
  };

  $scope.submit = function(){
    window.localStorage.setItem("url", $scope.configuracion.url);
    window.localStorage.setItem("usr", $scope.configuracion.usr);
    window.localStorage.setItem("pss", $scope.configuracion.pss);

    $ionicHistory.nextViewOptions({
       disableBack: true
    });
    
    $state.go("tab.diots");
  };

});
