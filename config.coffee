production = process.env.ENV is 'production'
testing = process.env.ENV is 'testing'
publicFolder = process.env.PUBLIC_PATH || 'public'

exports.config =
  # See docs at http://brunch.readthedocs.org/en/latest/config.html.
  overrides:
    production:
      optimize: true
      sourceMaps: false
      plugins: autoReload: enabled: false

    mocks:
      files:
        javascripts:
          joinTo:
            'javascripts/app.js': /^app/
            'javascripts/vendor.js': /^(bower_components|vendor|mocks)/

          order:
            after: [
              'bower_components/jquery-mockjax/jquery.mockjax.js'
            ]

  paths:
    public: publicFolder
    watched: ['app', 'test', 'vendor', 'mocks']

  conventions:
    vendor: /(bower_components|vendor|mocks)[\\/]/

  files:
    javascripts:
      defaultExtension: 'coffee'
      joinTo:
        'javascripts/app.js': /^app/
        'javascripts/vendor.js': (path) ->
          return /^(bower_components|vendor(\/|\\))/.test(path) and not /(jquery-mockjax|chance)/.test(path)

        'test/javascripts/test.js': /^test[\\/](?!vendor)/
        'test/javascripts/test-vendor.js': /^test[\\/](?=vendor)/

      order:
        after: [
          'test/vendor/scripts/test-helper.js'
        ]

    stylesheets:
      defaultExtension: 'styl'
      joinTo:
        'stylesheets/app.css': /^app/
        'stylesheets/vendor.css': /^(bower_components|vendor)/
      order:
        before: []
        after: []

    templates:
      defaultExtension: 'hbs'
      joinTo: 'javascripts/app.js'
      
  plugins:
    uglify:
      mangle: false
      compress:
        global_defs:
          DEBUG: false      
