function request (url, callBack, data = {}, method = 'GET') {
    wx.request({
        url: url,
        method: method.toUpperCase(),
        data: data,
        success: callBack,
        fail() {
            // 由于网上找的api为http协议  小程序只支持https  所以使用本地文件数据
            // 在开发者工具中可设置不监测合法域名使用api
            let data = require('/data.js')
            let apiUrl = url.split('?')[0]
            let dataKey = apiUrl.split('/')[apiUrl.split('/').length - 1]
            callBack({
                data: {
                    data: data.default.data[dataKey],
                    errno: 0
                },
                errMsg: "request:ok",
                statusCode: 200
            })
        }
    })
}

module.exports = {
    request
}