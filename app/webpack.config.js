const RestartElectronPlugin = require("restart-electron-webpack-plugin");

module.exports = {
  entry: "./renderer.js",
  output: {
    filename: "bundle.js",
  },
  target: "electron-renderer",
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader"
    }]
  },
  plugins: [
    new RestartElectronPlugin({
      // Defaults to process.cwd() + script 
      script: './renderer.js', 
      // The command line arguments to launch electron (optional) 
      arguments: ["--enable-logging"]
    }),
]
}