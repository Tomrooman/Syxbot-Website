const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    output: {
        publicPath: '/',
        filename: 'bundle.js',
        path: path.resolve(__dirname, '')
    },
    devServer: {
        historyApiFallback: true,
        https: true,
        proxy: {
            '/api': {
                target: 'https://localhost:9000',
                pathRewrite: { '^/api': '' },
                changeOrigin: true,
                secure: false
            }
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: [
                    { loader: 'babel-loader' },
                    { loader: 'eslint-loader' }
                ],
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader'
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    }
                ]
            },
            {
                test: /\.(png|jp(e*)g|svg)$/,
                use: [{
                    loader: 'url-loader'
                }]
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './src/index.html',
            filename: 'index.html'
        })
    ]
};