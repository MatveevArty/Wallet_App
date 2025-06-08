const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/app.scripts',
    mode: 'development',
    output: {
        filename: 'app.scripts',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
        template: "./src/login.html",
    },
        new CopyPlugin({
            patterns: [
                {
                    from: "fonts/*",
                    to: "[name][ext]",
                    context: path.resolve(__dirname, "src")
                },
            ],
        }),
    )],
    // module: {
    //     rules: [
    //         {
    //             test: /\.scss$/i,
    //             use: [
    //                 // "style-loader", // Creates `style` nodes from JS strings
    //                 // "css-loader", // Translates CSS into CommonJS
    //                 "sass-loader", // Compiles Sass to CSS
    //             ],
    //         },
    //     ],
    // },
};