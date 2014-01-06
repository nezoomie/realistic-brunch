# Realistic Brunch
**THIS IS A WORK IN PROGRESS:** early alpha, do not expect it to be usable or even working at the moment.

An essential but comprehensive, healthy recipe for your responsive apps.

Javascript + [Backbone](http://backbonejs.org/) + [Handlebars](http://handlebarsjs.com/) + [Stylus](http://learnboost.github.com/stylus/) skeleton, boosted with:

* [Bootstrap 3 (stylus edition)](https://github.com/Acquisio/bootstrap-stylus), as source code for easy customization
* [MarionetteJS](http://marionettejs.com/) for practical views management, routers, event aggregator and more
* [i18next](http://i18next.com/) eases internationalization
* [Moment](http://momentjs.com/) for easy date formatting
* [FastClick](https://github.com/ftlabs/fastclick) improves tapping responsiveness on mobile devices
* [FontAwesome](http://fontawesome.io/) provides scalable graphics for your UI
* [Backbone.Pageable](https://github.com/backbone-paginator/backbone-pageable) simplifies handling paginated collections
* [jQuery](http://jquery.com/) for your DOM needs

## Handy practices included

* A `Config` model is provided for storing app-wise data. It merges defaults with the initialization option on startup
* Models and Collections uses a `context` field for easily building URIs for nested resources.

		var myCollection = new Collection({
			urlRoot: 'theCollectionPath'
		});
		
		var myModel = new Model({
			id: 1234,
			urlRoot: 'theModelPath' 
		});
		
		myCollection.context = myModel;
		myCollection.fetch();
		
		// `theModelPath/4/theCollectionPath`

	Supports nesting:

		var rootModel = new Model({
			id: 1234,
			urlRoot: 'rootPath'
		});

		var nestedModel = new Model({
			id: 5678,
			urlRoot: 'nestedPath'
		});

		var myCollection = new Collection({
			urlRoot: 'theCollectionPath'
		});
		
		var myModel = new Model({
			id: 9012,
			urlRoot: 'theModelPath' 
		});
		
		nestedModel.context = rootModel;
		myCollection.context = nestedModel;
		myCollection.add(myModel);
		myModel.fetch();
		
		// `rootPath/1234/nestedPath/5678/theCollectionPath/9012`	
	
* Marionette.js `vent` dispatcher for app-wise event bindings

		var app = require('application');
		
		app.vent.trigger('title:change','A different title');  


* Utility function for changing page title via events
* Handlebars template helpers for integrated translations and date formatting
* Setup additional HTTP Headers for AJAX requests in the Config directly
* Custom `LOG()` function wrapping `console.log()`, stripped out when building the app with `ENV=production`


## Getting started
* Create new project via executing `brunch new <project name> --skeleton https://github.com/nezoomie/realistic-brunch.git` option for the command.
* Build the project with `brunch b` or `brunch w`.
* Open the `public/` dir to see the result.
* Write your code.

## Other
Versions of software the skeleton uses:

* jQuery 1.10.2
* Backbone 1.1.0
* Backbone.Pageable 1.4.3
* Underscore 1.5.2
* Twitter Bootstrap 3.0.0
* i18next 1.7.1
* Moment 2.5.0
* MarionetteJS 1.4.1
* FastClick 0.6.8

# Legal Stuff (MIT License)
Original template is Copyright (c) 2013 Simeon Bateman; SimB & Company. We assume no rights or liablities for the code contained.  All libraries are owned and licensed by the ownsers.  Use at your own risk.

Distributed under MIT license.