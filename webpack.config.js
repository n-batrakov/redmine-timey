const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: {
        app: "./src/index.tsx"
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, 'dist/public'),
        publicPath: '/'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new CopyWebpackPlugin([{
            from: 'src/static',
            to: ''
        }])
    ],
    resolve: {
        extensions: ['.js', '.json', '.ts', '.tsx'],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                loader: "awesome-typescript-loader"
            }
        ]
    },
    devtool: 'source-map',
    devServer: {
        historyApiFallback: true,
        proxy: {
            '/api': 'http://127.0.0.1:3000',
          },
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        },
        minimizer: []
    }
};