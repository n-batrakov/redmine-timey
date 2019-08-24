const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const { src, dist } = require('./build/directories')(__dirname);
const typescript = require('./build/typescript.config');
const styles = require('./build/styles.config');

const mode = process.env.NODE_ENV || 'development';
const dev = mode === 'development';
console.log(`BUILD STARTED IN '${mode}' MODE\n`);

const client = merge(
    typescript({ mode, modules: [src()] }),
    styles({ mode, out: 'index.css' }),
    {
        mode,
        target: 'web',
        entry: src('index.tsx'),
        output: dev
            ? {
                filename: "[name].js",
                path: dist(),
                publicPath: '/'
            } : {
                filename: "[name].[hash].js",
                path: dist('public'),
                publicPath: '/'
            },
        plugins: [
            new HtmlWebpackPlugin({ template: src('index.html') }),
            new CopyWebpackPlugin([{ from: src('static'), to: '' }]),
        ],
        devtool: 'source-map',
        optimization: {
            splitChunks: {
                chunks: 'all'
            },
        },
    },
);

const server = merge(
    typescript({ mode, modules: [ src() ]}),
    {
        mode,
        target: 'node',
        entry: src('server', 'index.ts'),
        output: {
            filename: "index.js",
            path: dist(),
        },
        node: {
            __dirname: false,
        },
        plugins: [
            new CopyWebpackPlugin([{ from: 'calendar.csv', to: 'calendar.csv' }]),
        ],
        optimization: {
            minimize: false
        }
    },
);

module.exports = dev ? [client] : [client, server];