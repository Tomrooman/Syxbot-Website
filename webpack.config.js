const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const PnpPlugin = require("pnp-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = {
    output: {
        publicPath: '/',
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
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
        },
        contentBase: './src',
        compress: true,
        clientLogLevel: 'warn',
    },
    node: {
        Buffer: false,
        process: false
    },
    mode: process.env.NODE_ENV,
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: [
                    /cache/,
                    /node_modules/
                ],
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            },
            {
                enforce: 'pre',
                test: /\.(ts|tsx)$/,
                use: [
                    {
                        options: {
                            eslintPath: require.resolve('eslint')
                        },
                        loader: require.resolve('eslint-loader')
                    }
                ],
                exclude: /node_modules/
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader'
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
    resolveLoader: {
        plugins: [PnpPlugin.moduleLoader(module)]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.json'],
        plugins: [PnpPlugin],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebPackPlugin({
            template: './src/index.html',
            filename: 'index.html'
        }),
        new webpack.DefinePlugin({
            '__REACT_DEVTOOLS_GLOBAL_HOOK__': '({ isDisabled: true })'
        }),
        new CopyPlugin({
            patterns: [
                { from: 'assets', to: 'assets' },
            ],
        })
    ]
};