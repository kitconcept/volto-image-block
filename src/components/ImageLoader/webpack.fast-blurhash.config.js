var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

var config = {
  entry: __dirname + '/fast-blurhash.js',
  output: {
    path: __dirname + '/dist',
    filename: 'fast-blurhash.min.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['env', 'react'],
          plugins: ['transform-class-properties'],
        },
      },
      { test: /\.css$/, loaders: ['style', 'css'] },
    ],
  },
  devtool: 'eval-source-map',
};

/*
 * If bundling for production, optimize output
 */
if (process.env.NODE_ENV === 'production') {
  config.devtool = false;
  config.optimization = {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: true,
          ecma: 6,
          mangle: true,
        },
        sourceMap: false,
      }),
    ],
  };
}

module.exports = config;
