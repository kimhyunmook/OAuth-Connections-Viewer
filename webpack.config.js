const path = require("path");

module.exports = {
  entry: {
    background: "./src/background.ts",
    popup: "./src/popup.ts",
    "content-script": "./src/content-script.ts",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [{ test: /\.ts$/, use: "ts-loader" }],
  },
};
