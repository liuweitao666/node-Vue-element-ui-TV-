module.exports = {
    devServer: {
        // host: 'localhost',
        // port: 8080,
        // autoOpenBrowser: true,
        // assetsSubDirectory: 'static',
        // assetsPublicPath: '/',
        proxy: {
            '/api': {
                target: 'http://api.avatardata.cn',//设置你调用的接口域名和端口号 别忘了加http、https
                changeOrigin: true,//是否跨域
                secure: true, // 允许https请求
                pathRewrite: {
                    '^/api': ''//这里理解成用‘/api’代替target里面的地址
                }
            }
        },
    }
}