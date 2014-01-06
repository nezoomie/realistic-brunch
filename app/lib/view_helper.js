var app = require('application');
// Put your handlebars.js helpers here.

// Basic i18next handlebars helper
// Usage:
//
// {{t "my.key" }}

Handlebars.registerHelper('t', function(key) {
    var result = i18n.t(key);
    return new Handlebars.SafeString(result);
});

// Get translation from context
// Usage:
//
// {{t_context key="my.key" context="contex.to.index" }}

Handlebars.registerHelper('t_context', function(options) {
  var key =  _.isFunction(options.hash.key) ? options.hash.key() : options.hash.key,
      table = options.hash.context,
      result = i18n.t([table,key].join('.'));

  return new Handlebars.SafeString(result);
});

// Extended i18next handlebars helper
// Usage:
//
// {{tr key="trans.sample.handlebarsExtended" add="from helper" }}

Handlebars.registerHelper('tr', function(options) {
    var opts = i18n.functions.extend(options.hash, this);
    if (options.fn) opts.defaultValue = options.fn(this);
    var result = i18n.t(opts.key, opts);
    return new Handlebars.SafeString(result);
});

// Format date/time according to the current Locale
// Usage:
//
// {{time value=dateToFormat}}
// 
// additional formats can be specified in `models/Config`:
//
//  dateFormats: {
//    standard: 'MMMM Do YYYY',
//    myCustomFormat: 'MM yy'
//  }
//
// and then used:
//
// {{ time value=dateToFormat format="myCustomFormat" }}

Handlebars.registerHelper('time', function(options) {
  LOG(options.hash.value);
    var value = options.hash.value,
        dateFormats = app.config.get('dateFormats'),
        format = options.hash.format || 'standard',
        result = moment(value).format(dateFormats[format]);
        
    return new Handlebars.SafeString(result);
});