(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("application", function(exports, require, module) {
var App = Backbone.Marionette.Application.extend({
  initialize: function(opts) {
    var _this = this;
    require('lib/view_helper');
    this.setupConfig(opts);
    
    this.addInitializer(this.setupCommonModules);
    this.addInitializer(this.extendBackbone);     
    this.addInitializer(this.extendAjax);
    this.addInitializer(this.mobileFixes);
    this.addInitializer(this.bindAppEvents);
    this.addInitializer(function(options) {
      Backbone.history.start(); 
      return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
    });
    
    this.setupLocale().done(function() {_this.start();});
  },
  
  extendBackbone: function(options) {
    var _this = this;
    // Extend models to support resource nesting
    _.extend(Backbone.Model.prototype, {
      context: null,
      urlPath: '',
      url: function(){
        return _([_this.config.get('apiUrl'), this.getPartialUrl()])
            .compact()
            .join('/');
      },
      getPartialUrl: function() {
        var context = this.collection ? this.collection.context : this.context,
            basePath = context ? context.getPartialUrl() : '';

        return _([basePath, this.urlRoot || '', this.id || ''])
            .compact()
            .join('/');
      }
    });
    
    // Extend collections to support resource nesting
    _.extend(Backbone.Collection.prototype, {
      context: null,
      urlPath: '',
      url: function(){
        return _([_this.config.get('apiUrl'), this.getPartialUrl()])
            .compact()
            .join('/');
      },
      getPartialUrl: function() {
        var basePath = this.context ? this.context.getPartialUrl() : '';
        return _([basePath, this.urlRoot || ''])
          .compact()
          .join('/');
      }
    });
  },
  
  setupLocale: function(options) {
    var language = this.config.get('languages').standard,
        deferred = i18n.init({
          preload: ['dev'],
          lng: language,
          fallbackLng: 'dev',
          getAsync: true
        }, function() {
          moment.lang(i18n.lng());
        });
        
      return deferred;
  },
  
  setLocale: function(locale) {
    if(i18n.lng() == locale)
        return;
  
    i18n.setLng(locale);
    moment.lang(locale);
    this.layout.render();
  },
  
  setupConfig: function(options) {
    var Config = require('models/Config');
    this.config = new Config();
    this.parseOptions(this.initOptions);
  },
  
  setupCommonModules: function(options) {
    require('lib/view_helper');
    // Set up the Layout
    var AppRouter = require('routers/AppRouter'),
        AppLayout = require('views/AppLayout');
        
    this.routers = {
      app: new AppRouter()
    };
    
    this.layout = new AppLayout({el: this.config.get('el')});
    this.layout.render();
  },
  
  extendAjax: function(options) {
    var _this = this;
    // Add custom headers
    $.ajaxSetup({
      headers : _this.config.get('HTTPheaders')
    });
    
    // Handle default errors
    $(document).ajaxError(function(event, jqXHR, ajaxSettings, thrownError) {
      var status = jqXHR.statusCode().status;
      if (status >= 500) {
        _this.vent.trigger('flash:message', {
          'text' : i18n.t('errors.internal_server_error'),
          'type' : 'error'
        });

        _this.vent.trigger('navigate:home');
      }
    });
  },
  
  bindAppEvents: function() {
    var _this = this;
    
    this.vent.on({
      'title:change': function(data) {
        if (!_(data).isArray()) data = [data];
        _this.changeTitle(data);
      },
    });
  },
  
  mobileFixes: function(options) {
    // Start FastClick library on touch devices
    window.addEventListener('load', function() {
      FastClick.attach(document.body);
    }, false);
  },
  
  changeTitle: function(elements) {
    var options = this.config.get('title'), title;
    title = _([ _(elements).compact().join(options.subSeparator), options.base ])
            .compact().join(options.separator);
            
    document.title = title;
  },
  
  parseOptions: function(options) {
    // If the option is an object, extend configuration defaults, otherwise
    // replaces it.
    LOG('-> '+this.config.get('_NAME')+' v' + this.config.get('_VERSION'));
    _.each(options, function(option, name) {
      var mergedOption = option;
      if (_(option).isObject() && !_(option).isArray()) {
        LOG('-> Config: setting '+name+' to:');
        LOG(option);
        var defaults = this.config.get(name);
        var mergedOption = $.extend(true,{},defaults,option);
      }

      this.config.set(name,mergedOption);
    },this);

    LOG('-> Config: merged configuration:');
    LOG(this.config.attributes);
  }
});

module.exports = new App();

});

;require.register("controllers/AppController", function(exports, require, module) {
var app = require('application'),
    HomeView = require('views/HomeView');

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

module.exports = AppController;
});

;require.register("initialize", function(exports, require, module) {
var app = require('application')

$(document).ready(function() {
  app.initialize();
});

});

;require.register("lib/view_helper", function(exports, require, module) {
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
});

;require.register("models/Config", function(exports, require, module) {
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
    dateFormats: {
      standard: 'MMMM Do YYYY'
    },
    HTTPheaders:{
      // Add custom HTTP headers here
    }, 
  }
});

});

;require.register("models/collection", function(exports, require, module) {
// Base class for all collections.

module.exports = Backbone.Collection.extend({});

});

;require.register("models/model", function(exports, require, module) {
// Base class for all models.

module.exports = Backbone.Model.extend({});

});

;require.register("routers/AppRouter", function(exports, require, module) {
module.exports = Backbone.Marionette.AppRouter.extend({
  controller: require('controllers/AppController'),
  appRoutes: {
    '' : 'home'
  }
});

});

;require.register("views/AppLayout", function(exports, require, module) {
var app = require('application');

module.exports = Backbone.Marionette.Layout.extend({
  template: 'views/templates/appLayout',
  
	el: 'body',

	regions: {
    content: '#content' 
	}
});

});

;require.register("views/HomeView", function(exports, require, module) {
module.exports = Backbone.Marionette.ItemView.extend({
  id: 'home-view',
  
	template: 'views/templates/home',
	
	templateHelpers: {
	  now: new Date()
	}
});

});

;require.register("views/templates/appLayout", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  buffer += "<div class=\"navbar navbar-fixed-top\">\n  <div class=\"navbar-inner\">\n    <div class=\"container\">\n      <a class=\"brand\" href=\"#\">";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers['t'] || depth0['t']),stack1 ? stack1.call(depth0, "home.title", options) : helperMissing.call(depth0, "t", "home.title", options)))
    + "</a>\n    </div>\n  </div>\n</div>\n\n<div id=\"content\" class=\"container\"></div>\n";
  return buffer;
  });
});

;require.register("views/templates/home", function(exports, require, module) {
module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  buffer += "<div class=\"row\">\n  <div class=\"span12\">\n    ";
  options = {hash:{
    'value': (depth0.now)
  },data:data};
  buffer += escapeExpression(((stack1 = helpers.time || depth0.time),stack1 ? stack1.call(depth0, options) : helperMissing.call(depth0, "time", options)))
    + "\n    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n  </div>\n</div>\n\n    ";
  return buffer;
  });
});

;
//# sourceMappingURL=app.js.map