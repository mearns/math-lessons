const path = require('path')

module.exports = {
  entry: './src/client-entry/math-lessons/index.js',
  output: {
    filename: 'math-lessons.js',
    path: path.resolve(__dirname, 'dist/resources/js/bundles/')
  },
  devtool: 'inline-source-map',
  mode: (process.env.NODE_ENV || '').toLowerCase() === 'production' ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: '> 0.25%, not dead'
              }]
            ]
          }
        }
      }
    ]
  }
}
