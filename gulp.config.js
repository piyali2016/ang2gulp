var historyApiFallback = require('connect-history-api-fallback');

module.exports = function () {  
  var root = '';
  var app = root + 'app/';
  var index = root + 'index.html';

  var build = {
    path: 'dist/',
    app: 'build/app/',
    fonts: 'build/fonts',
    assetPath: 'build/assets/',
    assets: {
      lib: {
        js: 'lib.js',
        css: 'lib.css'
      }
    }
  };

  var bootstrapSass = {
    in: './node_modules/bootstrap-sass'
  };

  var fonts = {
    in: ['app/fonts/*.*', bootstrapSass.in + 'assets/fonts/**/*'],
    out: 'dist/fonts'
  };

  var sass = {
    in: 'public/styles/main.scss',
    out: 'dist/styles/',
    watch: 'public/styles/**/*',
    sassOpts: {
      outputStyle: 'nested',
      precision: 3,
      errLogToConsole: true,
      includePaths: [bootstrapSass.in + '/assets/stylesheets']
    }
  };

  var browserSync = {
    dev: {
      injectChanges: true,
      port: 3000,
      server: {
        baseDir: './dist',
        middleware: [historyApiFallback()]
      }
    },
    prod: {
      port: 3001,
      server: {
        baseDir: './' + build.path,
        middleware: [historyApiFallback()]
      }
    }
  };

  var systemJs = {
    builder: {
      normalize: true,
      minify: true,
      mangle: true,
      globalDefs: { DEBUG: false }
    }
  };

  var config = {
    root: root,
    app: app,
    fonts: fonts,
    bootstrapSass: bootstrapSass,
    sass: sass,
    browserSync: browserSync,
    systemJs: systemJs
  };

  return config;

};