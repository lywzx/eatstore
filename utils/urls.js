exports.goods = 'http://ustbhuangyi.com/sell/api/goods'

exports.seller = 'http://ustbhuangyi.com/sell/api/seller'

exports.ratings = 'http://ustbhuangyi.com/sell/api/ratings'

exports.getDataKey = function(url) {
    let apiUrl = url.split('?')[0]
    let result = apiUrl.split('/')[apiUrl.split('/').length-1]
    return result
}