const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './index.web.js',
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
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
      {
        test: /manifest\.json$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './web/index.html',
      filename: 'index.html',
      inject: true,
      favicon: false, // We'll handle favicon in HTML
    }),
    // Copy manifest, service worker, and icons
    new CopyWebpackPlugin({
      patterns: [
        { from: 'web/manifest.json', to: 'manifest.json' },
        { from: 'web/service-worker.js', to: 'service-worker.js' },
        { from: 'web/install-prompt.js', to: 'install-prompt.js' },
        { 
          from: 'web/icons', 
          to: 'icons',
          noErrorOnMissing: true, // Don't fail if icons don't exist yet
        },
      ],
    }),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(!isProduction),
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
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
    filename: isProduction ? 'bundle.[contenthash].js' : 'bundle.js',
    publicPath: '/',
    clean: true,
  },
  optimization: {
    minimize: isProduction,
    splitChunks: isProduction ? {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    } : false,
  },
  performance: {
    hints: isProduction ? 'warning' : false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
};

