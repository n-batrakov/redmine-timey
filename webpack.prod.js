const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const server = {
    mode: 'production',
    target: 'node',
    entry: './src/server/index.ts',
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, 'dist'),
    },
    node: {
        __dirname: false,
    },
    resolve: {
        extensions: ['.js', '.json', '.ts'],
    },
    module: {
        rules: [
            {
                test: /\.(ts)$/,
                use: 'awesome-typescript-loader'
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([{ from: 'calendar.csv', to: 'calendar.csv' }]),
    ],
    optimization: {
        minimize: false
    }
};

const client = {
    mode: 'production',
    target: 'web',
    entry: './src/index.tsx',
    output: {
        filename: "[name].[hash].js",
        path: path.resolve(__dirname, 'dist', 'public'),
        publicPath: '/'
    },
    resolve: {
        extensions: ['.js', '.json', '.ts', '.tsx'],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                use: 'awesome-typescript-loader'
            },{
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },{
                test: /\.(png|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {},
                    },
                ],
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ template: 'src/index.html' }),
        new CopyWebpackPlugin([{ from: 'src/static', to: '' }]),
        new MiniCssExtractPlugin({ filename: '[name].[hash].css', chunkFilename: '[id].[hash].css' }),
    ],
    devtool: 'source-map',
    optimization: {
        splitChunks: {
            chunks: 'all'
        },
        minimizer: [
            new TerserPlugin({
              cache: true,
              parallel: true,
              sourceMap: true,
              terserOptions: {
                // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
              }
            }),
            new OptimizeCSSAssetsPlugin({}),
        ],
    }
};

module.exports = [client, server];