var path = require( 'path' );
var HtmlWebpackPlugin = require( 'html-webpack-plugin' );
var MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );

module.exports = function () {

  return {
    entry: {
      index: './src/index.js'
    },
    output: {
      path: path.resolve( __dirname, '../dev' ),
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
          use: [
            {
              loader: 'babel-loader'
            }
          ],
          exclude: /node_modules/
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: { 'minimize': true }
            }
          ],
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: [ 
            MiniCssExtractPlugin.loader,
            'css-loader'
          ],
          exclude: /node_modules/
        },
        {
          test: /\.txt|snippet|glsl$/,
          use: {
            loader: 'raw-loader'
          },
          exclude: /node_modules/
        }
      ]
    },
    devServer: {
      port: 3000,
      hot: false,
      open: false,
      host: '0.0.0.0'
    }
  };

};
