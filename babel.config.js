module.exports = function(api) {
  api.cache(true)

  return {
    presets: [
      './node_modules/shakapacker/package/babel/preset.js',
      ['@babel/preset-react', {
        runtime: 'automatic'
      }]
    ]
  }
}
