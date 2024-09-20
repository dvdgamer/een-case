module.exports = {
  devServer: {
    proxy: {
      "/api": {
        target: "https://rest.cameramanager.com",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "",
        },
        logLevel: "debug",
        onProxyReq(proxyReq, req, res) {
          console.log("Proxy request:", req.method, req.url);
        },
        onProxyRes(proxyRes, req, res) {
          console.log("Proxy response:", proxyRes.statusCode, req.url);
        },
      },
    },
  },
};
