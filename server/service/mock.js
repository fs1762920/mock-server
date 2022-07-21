const lodash = require('lodash');
const jsonUtils = require('../utils/JsonUtils')

// get请求数据分发
const dispatchGetResponse = (params, fieldMap) => {
    console.log("params: " + JSON.stringify(params))
    console.log("fieldMap: " + JSON.stringify(fieldMap))
    let cloneMap = lodash.cloneDeep(fieldMap)
    for(let paramTemp of cloneMap) {
        if (jsonUtils.diffAndDelete(params, paramTemp.params)) {
            return paramTemp.response
        } 
    }
    return 'no matched response'
}

// post请求数据分发
const dispatchPostResponse = (body, fieldMap) => {
    let cloneMap = lodash.cloneDeep(fieldMap)
    for(let bodyTemp of cloneMap) {
        if (jsonUtils.CompareAndDelete(body, JSON.parse(bodyTemp.body))) {
            return bodyTemp.response
        }
    }
    return 'no matched response'
}

module.exports = { dispatchGetResponse, dispatchPostResponse }

