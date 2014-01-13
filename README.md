# Realistic Brunch
**THIS IS A WORK IN PROGRESS:** early alpha, do not expect it to be usable or even working at the moment.

An essential but comprehensive, healthy recipe for your responsive apps.

Javascript + [Backbone](http://backbonejs.org/) + [Handlebars](http://handlebarsjs.com/) + [Stylus](http://learnboost.github.com/stylus/) skeleton, boosted with:

* [Bootstrap 3 (stylus edition)](https://github.com/Acquisio/bootstrap-stylus)
* [MarionetteJS](http://marionettejs.com/) for practical views management, routers, event aggregator and more
* [i18next](http://i18next.com/) eases internationalization
* [Moment](http://momentjs.com/) for easy date formatting
* [FastClick](https://github.com/ftlabs/fastclick) improves tapping responsiveness on mobile devices
* [FontAwesome](http://fontawesome.io/) provides scalable graphics for your UI
* [Backbone.Pageable](https://github.com/backbone-paginator/backbone-pageable) simplifies handling paginated collections
* [Backbone.Subviews](https://github.com/rotundasoftware/backbone.subviews) eases creating complex composite views
* [Mockjax](https://github.com/appendto/jquery-mockjax) mocks up your APIs so you can work in parallel with backenders
* [jQuery](http://jquery.com/) for your DOM needs

## Getting started
* Create a new project via executing `brunch new gh:nezoomie/realistic-brunch <project-name>` option for the command.
* Build the project with `brunch b` or `brunch w`.
* Open the `public/` dir to see the result.
* Write your code.

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

## Run tests

Tests are written in Mocha and run using Mocha-PhantomJS.

* Put your tests into `test/`
* Install PhantomJS if missing, `npm install -g phantomjs`
* Install Mocha-PhantomJS if missing, `npm install -g mocha-phantomjs`
* `npm test`

# Legal Stuff (MIT License)
Distributed under MIT license.
