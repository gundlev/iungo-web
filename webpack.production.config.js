var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  "env": {
    // only enable it when process.env.NODE_ENV is 'development' or undefined
    "development": {
      "plugins": [["react-transform", {
        "transforms": [{
          "transform": "react-transform-hmr",
          // if you use React Native, pass "react-native" instead:
          "imports": ["react"],
          // this is important for Webpack HMR:
          "locals": ["module"]
        }]
        // note: you can put more transforms into array
        // this is just one of them!
      }]]
    }
  },
  devtool: 'source-map',
  node: {
    net: 'mock',
    dns: 'mock'
  },
  entry: [
    './app/App'
  ],
  output: {
    path: path.join(__dirname, 'static'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  resolve: {
    extensions: ['', '.jsx', '.scss', '.js', '.json'],
    modulesDirectories: [
      'node_modules',
      path.resolve(__dirname, './node_modules')
    ]
  },
  postcss: [autoprefixer],
  toolboxTheme: 'theme.scss',
  plugins: [
    new ExtractTextPlugin('react-toolbox.css', { allChunks: true }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ],
  module: {
    loaders: [
      {
        test: /(\.js|\.jsx)$/,
        exclude: /(node_modules)/,
        loader: 'babel',
        include: path.join(__dirname, 'app')
      }, {
        test: /(\.scss|\.css)$/,
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass?sourceMap!toolbox')
      }
    ]
  }
};
