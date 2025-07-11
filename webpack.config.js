const path = require("path");
const Dotenv = require("dotenv-webpack");

module.exports = {
  entry: "./assets/js/script.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  mode: "development",
  plugins: [new Dotenv()],
};
