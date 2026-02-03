const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",

  entry: "./src/index.ts",

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
  },

  resolve: {
    extensions: [".ts", ".js", ".wasm"],
    alias: {
      "game-of-life": path.resolve(__dirname, "../pkg")
    }
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      }
    ],
  },

  experiments: {
    asyncWebAssembly: true,
  },

  devtool: "source-map",

  devServer: {
    static: {
      directory: path.resolve(__dirname, "public"),
    },
  }
};
