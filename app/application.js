require('lib/view_helper');

var App = Backbone.Marionette.Application.extend({
  initialize: function(opts) {
    require('lib/view_helper');
    var _this = this;
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
    var language = this.config.get('languages').standard;
    
    return i18n.init({
      preload: ['dev'],
      lng: language,
      fallbackLng: 'dev',
      getAsync: true
    });
  },
  
  setupConfig: function(options) {
    var Config = require('models/Config');
    this.config = new Config();
    this.parseOptions(this.initOptions);
  },
  
  setupCommonModules: function(options) {
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
