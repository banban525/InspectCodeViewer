// Karma configuration
// Generated on Mon Aug 21 2017 12:30:18 GMT+0900 (東京 (標準時))

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      './src_js/*.spec.js',
      './src_js/*.spec.js'
    ],

    preprocessors: {
      './src_js/*.spec.js': ['coverage','webpack', 'sourcemap'],
      './src_js/*.spec.ts': ['coverage','webpack', 'sourcemap']
    },

    webpack: {
      devtool: 'inline-source-map',
      
      resolve: {
        extensions: ['.ts', '.js', ".tsx"]
      },
      module: {
        rules: [
          {
            enforce:"pre",
            test: /\.js$/,
            exclude: /(node_modules)/,
            use: [
              {loader: "istanbul-instrumenter-loader"}
            ]
          },
          {
            test: /\.tsx?$/,
            use: [
              {loader: "ts-loader"}
            ]
          }
        ]
      }
    },

    // list of files to exclude
    exclude: [
    ],



    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress','mocha'],
    
    coverageReporter: {
      dir: 'report',
      reporters: [
        { type: 'html' },
        { type: 'cobertura' }
      ]
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
