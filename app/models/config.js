var Model = require('models/model');

// Include all app-wise configuration data here.
 
module.exports = Model.extend({
  defaults: {
    _NAME: 'My Single Page App',
    _VERSION: '0.1',
    apiUrl: '',
    el: 'body',
    title: {
      base: "My Single Page App",
      separator: " | ",
      subSeparator: " - "
    },
    languages: {
      standard: 'en'
    },
    HTTPheaders:{
      // Add custom HTTP headers here
    }, 
  }
});
