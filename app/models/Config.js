var Model = require('models/model');

// Include all app-wise configuration data here.
 
module.exports = Model.extend({
  defaults: {
    _NAME: 'My Single Page App',
    _VERSION: '0.1',
    apiUrl: '',
    appRoot: '/',
    el: 'body',
    title: {
      base: "My Single Page App",
      separator: " | ",
      subSeparator: " - "
    },
    locale: {
      languages: ['en', 'de'],
      standard: 'en'
    },
    dateFormats: {
      standard: 'MMMM Do YYYY'
    },
    HTTPheaders:{
      // Add custom HTTP headers here
    }
  }
});
