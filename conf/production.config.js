var path = require( 'path' );
var HtmlWebpackPlugin = require( 'html-webpack-plugin' );
var MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );

module.exports = function () {

  return {
    entry: {
      index: './src/index.js'
    },
    output: {
      path: path.resolve( __dirname, '../electron/pkg' ),
      filename: '[name].js'
    },
    externals: {

    },
    plugins: [
      new HtmlWebpackPlugin( {
        template: './src/index.html',
        filename: './index.html'
      } ),
      new MiniCssExtractPlugin( {
        filename: '[name].css',
        chunkFilename: '[id].css'
      } )
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader'
            }
          ]
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: { 'minimize': true }
            }
          ]
        },
        {
          test: /\.css$/,
          use: [ 
            MiniCssExtractPlugin.loader,
            'css-loader'
          ]
        },
        {
          test: /\.txt|snippet|glsl$/,
          use: {
            loader: 'raw-loader'
          },
          exclude: /node_modules/
        }
      ]
    }
  };

};
