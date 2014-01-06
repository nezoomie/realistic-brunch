var app = require('application');

module.exports = Backbone.Marionette.AppRouter.extend({
  controller: require('controllers/AppController'),
  appRoutes: {
    '' : 'home'
  }
});
