const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './index.web.js',
  mode: 'development',
  devtool: 'cheap-module-source-map',
  ignoreWarnings: [
    /react-native-worklets/,
    /Critical dependency/,
  ],
  stats: {
    warningsFilter: [
      /react-native-worklets/,
      /Critical dependency/,
    ],
  },
  resolve: {
    extensions: ['.web.js', '.js', '.web.ts', '.ts', '.web.tsx', '.tsx', '.json'],
    alias: {
      'react-native$': 'react-native-web',
      'react-native-linear-gradient': 'react-native-web-linear-gradient',
      'react-native-reanimated$': path.resolve(__dirname, 'web/mocks/react-native-reanimated.js'),
      'react-native-worklets$': path.resolve(__dirname, 'web/mocks/react-native-worklets.js'),
    },
    modules: ['node_modules', path.resolve(__dirname, 'web/mocks')],
  },
  module: {
    parser: {
      javascript: {
        exprContextCritical: false,
        unknownContextCritical: false,
        wrappedContextCritical: false,
      },
    },
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules\/(?!(react-native-.*|@react-navigation\/.*|react-native-web-linear-gradient)\/).*/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            presets: [
              ['@babel/preset-env', {
                targets: {browsers: ['last 2 versions']},
                modules: false,
              }],
              ['@babel/preset-react', {runtime: 'automatic'}],
            ],
            plugins: [
              ['@babel/plugin-proposal-class-properties', {loose: true}],
              ['@babel/plugin-transform-private-property-in-object', {loose: true}],
              ['@babel/plugin-transform-private-methods', {loose: true}],
            ],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './web/index.html',
      filename: 'index.html',
      inject: true,
    }),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
    }),
    new webpack.NormalModuleReplacementPlugin(
      /react-native-reanimated/,
      path.resolve(__dirname, 'web/mocks/react-native-reanimated.js')
    ),
    new webpack.NormalModuleReplacementPlugin(
      /react-native-worklets/,
      path.resolve(__dirname, 'web/mocks/react-native-worklets.js')
    ),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'web'),
    },
    compress: true,
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: {
      index: '/index.html',
      disableDotRule: true,
    },
    allowedHosts: 'all',
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
  output: {
    path: path.resolve(__dirname, 'web-build'),
    filename: 'bundle.js',
    publicPath: '/',
    clean: true,
  },
};

