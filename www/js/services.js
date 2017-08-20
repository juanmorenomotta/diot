angular.module('starter.services', [])

.factory('diot', function() {

// Enviroments = ambientes
  var envs = [{
    id: 0,
    name: 'Sala',
    lastText: 'Actuadores y Sensores de la sala',
    environment: 'Sala',
    face: 'img/sala.png',
    item: 'img/sala2.jpg',
    topic: "sala"
  }, {
    id: 1,
    name: 'Dormitorio',
    lastText: 'Actuadores y Sensores del dormitorio',
    environment: 'Dormitorio',
    face: 'img/balcon.png',
    item: 'img/balcon2.jpg',
    topic: "dormi"
  }];

  return {
    all: function() {
      return envs;
    },
    remove: function(env) {
      envs.splice(envs.indexOf(env), 1);
    },
    get: function(envId) {
      for (var i = 0; i < envs.length; i++) {
        if (envs[i].id === parseInt(envId)) {
          return envs[i];
        }
      }
      return null;
    }
  };
});
