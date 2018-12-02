const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const glob = require('glob');

console.log('globbing');
let files = glob.sync('./sketches/**/index.js');
files = files.map(function (file) {
    let name = file;
    name = name.replace('/index.js', '');
    name = name.replace('./sketches/', '');
    name = name + '/index.html';
    return name;
});
files.push('index.html');
console.log(files);

const htmlPlugins = files.map(function (file) {
    return new HtmlWebpackPlugin({
        template: 'index.html',
        filename: file,
        favicon: 'favicon.ico'
    })
})

module.exports = {
    entry: ['./index.js'],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, './dist'),
        chunkFilename: 'chunks/[id].[chunkhash].js'
    },

    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
            }
        },
        {
            test: /\.html$/,
            use: {
                loader: 'html-loader',
                options: { minimize: true }
            }
        },
        {
            test: /\.scss$/,
            use: [
                "style-loader",
                "css-loader",
                "sass-loader"
            ]
        },
        {
            test: /\.(png|jpg|gif|pdf|ico|wav)$/,
            use: {
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]'
                }
            },
        },
        {
            test: /\.(glsl|frag|vert)$/,
            exclude: /node_modules/,
            use: {
                loader: 'raw-loader'
            }
        },
        {
            test: /\.(glsl|frag|vert)$/,
            exclude: /node_modules/,
            use: {
                loader: 'glslify-loader'
            }
        }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist/*']),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ].concat(htmlPlugins),

    optimization: {
        splitChunks: {
            chunks: 'all'
        },
        minimizer: [
            // new UglifyJsPlugin({
            //     sourceMap: true
            // })
        ]
    }
}