const path = require('path');

module.exports = (env, argv) => ({

  entry: '/src/index.js',
  devtool: 'eval',

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },

  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },

  output: {
    filename: 'timeously.js',
    path: path.resolve(__dirname, 'lib')
  }

});