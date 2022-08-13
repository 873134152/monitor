const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin') //自动产出html文件
module.exports = {
    entry: './src/index.js', // 入口文件
    context: process.cwd(), // 上下文目录
    mode: 'development', // 开发模式
    output: {
        path: path.resolve(__dirname, 'dist'), //输出目录
        filename: 'monitor.js' //文件名
    },
    devServer: {
        static: path.join(__dirname, 'dist'), //dev静态文件根目录

        onBeforeSetupMiddleware: function (devServer) {
            if (!devServer) {
                throw new Error('webpack-dev-server is not defined');
            }

            devServer.app.get('/success', function (req, res) {
                res.json({ custom: 'response' });
            })
            devServer.app.post('/error', function (req, res) {
                res.sendStatus(500);
            })
        },

    },
    plugins: [
        new HtmlWebpackPlugin({ //打包生成HTML文件
            template: './src/index.html',
            inject: 'head'
        })
    ]
}
//依赖解释
/*
    html-webpack-plugin 自动生成html
    user-agent 将浏览器UserAgent对象变成可解析
* */
