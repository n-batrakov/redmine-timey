module.exports = {
    syntax: 'postcss-scss',
    plugins: [
        require("stylelint")({
            configFile: '.stylelintrc.json'
        }),
        require('autoprefixer'),
        require('@csstools/postcss-sass')({
            includePaths: ["src/styles"],
        })
    ]
}