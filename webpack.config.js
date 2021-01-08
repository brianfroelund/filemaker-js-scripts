const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "production",
  entry: ["whatwg-fetch", "./src/index.js"],
  // devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.m?js$/,
        // Some module should not be transpiled by Babel
        // See https://github.com/zloirock/core-js/issues/743#issuecomment-572074215
        exclude: [/\bcore-js\b/, /\bwebpack\/buildin\b/],
        loader: "babel-loader",
        options: {
          presets: [["@babel/preset-env", { useBuiltIns: "entry", corejs: 3 }]],
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "FileMaker Script",
      inlineSource: ".(js|css)$",
    }),
    new ScriptExtHtmlWebpackPlugin({
      inline: [/\.js$/],
    }),
  ],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
