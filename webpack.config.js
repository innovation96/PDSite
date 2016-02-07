module.exports = {
  output: {
    // library: 'pundit',
    // libraryTarget: 'umd',
    filename: 'bundle.js'
  },
  devtool: '#inline-source-map',
  externals: [
    {
      jquery: {
        root: '$',
        commonjs: 'jquery',
        commonjs2: 'jquery',
        amd: 'jquery'
      }
    }
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          compact: false
        }
      }
    ]
  }
};