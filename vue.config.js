const { GenerateSW } = require("workbox-webpack-plugin");

module.exports = {
  publicPath: process.env.NODE_ENV === "development" ? "/3map/" : "",

  configureWebpack: {
    plugins: [new GenerateSW()]
  }
};
