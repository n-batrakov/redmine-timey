const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const server = {
    mode: 'production',
    target: 'node',
    entry: './src/server/index.ts',
    output: {
        filename: "[name].js",
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
        filename: "[name].js",
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
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" }
                ]
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
        ],
    }
};

module.exports = [client, server];