const { GenerateSW } = require("workbox-webpack-plugin");

module.exports = {
  publicPath: process.env.NODE_ENV === "development" ? "/3map/" : "",

  configureWebpack: {
    plugins: [
      new GenerateSW({
        runtimeCaching: [
          {
            // urlPattern: new RegExp("^https://firebasestorage.googleapis.com"),
            urlPattern: /^https:\/\/firebasestorage\.googleapis\.com/,
            handler: "NetworkFirst",
            options: {
              backgroundSync: {
                name: "3map-app-background-sync-queue",
                options: {
                  maxRetentionTime: 60 * 24
                }
              }
            }
          }
        ]
      })
    ]
  }
};
