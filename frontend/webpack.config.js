const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/app.js',
    mode: 'development',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
        // Это свойство для возможности загрузки app.js с любой страницы и при перезагрузке
        publicPath: '/',
        clean: true,
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
        // Перевод на главную страницу index.html
        historyApiFallback: true,
    },
    module: {
        rules: [
            {
                test: /\.scss$/i,
                use: ["style-loader", "css-loader", "sass-loader",],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html",
        }),
        new CopyPlugin({
            patterns: [
                {from: "./src/templates", to: "templates"},
                {from: "./src/static/svg", to: "static/svg"},
                {from: "./node_modules/bootstrap/dist/css/bootstrap.min.css", to: "./css/bootstrap.min.css"},
                {from: "./node_modules/bootstrap/dist/js/bootstrap.min.js", to: "./js/bootstrap.min.js"},
                {from: "./node_modules/@fortawesome/fontawesome-free/css/all.min.css", to: "./css/fontawesome-free.min.css"},
                {from: "./node_modules/@fortawesome/fontawesome-free/js/all.min.js", to: "./js/fontawesome-free.min.js"},
                {from: "./node_modules/@fortawesome/fontawesome-free/webfonts", to: "./webfonts"},
                {from: "./node_modules/chart.js/dist/chart.umd.js", to: "./js/chart.umd.js"},
            ],
        }),
    ],
};