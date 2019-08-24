const TerserPlugin = require('terser-webpack-plugin');

module.exports = ({ modules, mode }) => ({
    resolve: {
        modules: ['node_modules', ...modules],
        extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'awesome-typescript-loader',
            exclude: /node_modules/,
        }],
    },
    optimization: {
        minimizer: mode === 'development' 
            ? []
            : [
                new TerserPlugin({
                    cache: true,
                    parallel: true,
                    terserOptions: {},
                }),
            ],
    },
});
