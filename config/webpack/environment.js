const { environment } = require('@rails/webpacker')

const webpack = require('webpack')

environment.plugins.prepend('Provide', new webpack.ProvidePlugin({
        $: 'jquery',
        JQuery: 'jquery',
        Popper: ['popper.js', 'default'], // for Bootstrap
    })
)

module.exports = environment