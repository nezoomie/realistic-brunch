var app = require('application'),
    HomeView = require('views/cart/HomeView');

var AppController = {
  home: function(){
    var homeView = new HomeView();
    app.layout.content.show(homeView);
    app.vent.trigger('title:change',[i18n.t('home.title')]);    
  }
};

app.vent.on({
  'navigate:home' : function(){
    Backbone.history.navigate('home', {trigger:false});
    AppController.home();
  }
});

module.exports = CartController;