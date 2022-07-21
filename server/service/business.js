const uuid = require('uuid');

exports.getMenuList = (req, res) => {
    return global.mockData.mcvv.map((item) => {
        let menuItem = {
            id: item.id,
            label: item.label,
            url: item.url,
            method: item.method
        }
        return menuItem
    })
};

exports.getMockData = (req, res) => {
    let result = null
    for (let item of global.mockData.mcvv) {
        if (item.id === req.query.id) {
            result = item
            break
        }
    }
    return result
}

exports.addOrUpdateCase = (req, res) => {
    if (req.body.caseId) { // 更新
        for (let interfaceItem of global.mockData.mcvv) {
            if (interfaceItem.id == req.body.interfaceId) {
                for (let field of interfaceItem.fieldMap) {
                    if (field.id == req.body.caseId) {
                        field.name = req.body.caseName
                        return {
                            code: 200,
                            message: '修改成功'
                        }
                    }
                }
            }
        }
        return {
            code: 502,
            message: '接口或用例不存在'
        }
    } else { // 新增
        for (let interfaceItem of global.mockData.mcvv) {
            if (interfaceItem.id == req.body.interfaceId) {
                let repeat = false
                for (let field of interfaceItem.fieldMap) {
                    if (field.name == req.body.name) {
                        repeat = true
                        break
                    }
                }
                if (repeat) {
                    return {
                        code: 501,
                        message: '用例名称重复'
                    }
                }
                let caseItem = {
                    id: uuid.v1().replace(/-/g, ''),
                    name: req.body.caseName,
                    params: [],
                    body: '',
                    response: ''
                }
                interfaceItem.fieldMap.push(caseItem)
                return {
                    code: 200,
                    message: '添加成功'
                }
            }
        }
        return {
            code: 502,
            message: '接口或用例不存在'
        }
    }
}

exports.updateCaseDetail = function (req, res) {
    if (req.body.id) {
        for (let interfaceItem of global.mockData.mcvv) {
            let updateIndex = -1
            for (let [index, caseItem] of interfaceItem.fieldMap.entries()) {
                if (req.body.id === caseItem.id) {
                    updateIndex = index
                }
            }
            if (updateIndex !== -1) {
                interfaceItem.fieldMap[updateIndex] = req.body
                return {
                    code: 200,
                    message: '更新成功'
                }
            }
        }
    }
    return {
        code: 500,
        message: '更新失败'
    }
}

exports.addOrUpdateInterface = function (req, res) {
    if (req.body.id) { //更新
        for (let interfaceItem of global.mockData.mcvv) {
            if (req.body.id == interfaceItem.id) {
                interfaceItem.url = req.body.url
                interfaceItem.label = req.body.label
                interfaceItem.method = req.body.method
                interfaceItem.remark = req.body.remark
            }
        }
        return {
            code: 200,
            message: '更新成功'
        }
    } else { // 新增
        let interfaceItem = {
            id: uuid.v1().replace(/-/g, ''),
            url: req.body.url,
            label: req.body.label,
            method: req.body.method,
            fieldMap: [
                {
                    id: uuid.v1().replace(/-/g, ''),
                    name: 'default',
                    params: [],
                    body: '',
                    response: ''
                }
            ]
        }
        global.mockData.mcvv.push(interfaceItem)
        return {
            code: 200,
            message: '添加成功',
            data: interfaceItem.id
        }
    }
}

exports.deleteInterface = function (req, res) { 
    let deleteIndex = -1;
    console.log("req.query.id: "+req.query.id)
    for (let [index, interfaceItem] of global.mockData.mcvv.entries()) {
        if (req.query.id === interfaceItem.id) { 
            deleteIndex = index
        }
    }
    if (deleteIndex !== -1) {
        global.mockData.mcvv.splice(deleteIndex, 1)
        return {
            code: 200,
            message: '删除成功'
        }
    } else { 
        return {
            code: 502,
            message: '接口不存在'
        }
    }

}

exports.deleteCase = function (req, res) {
    for (let interfaceItem of global.mockData.mcvv) {
        if (interfaceItem.id == req.body.interfaceId) {
            let caseIndex = -1
            for (let [index, field] of interfaceItem.fieldMap.entries()) {
                if (field.id == req.body.caseId) {
                    caseIndex = index
                    break
                }
            }
            if (caseIndex != -1) {
                interfaceItem.fieldMap.splice(caseIndex, 1)
                return {
                    code: 200,
                    message: '删除成功'
                }
            }
        }
    }
    return {
        code: 502,
        message: '接口或用例不存在'
    }
}

exports.getCaseList = function (req, res) {
    let fieldMap
    for (let interfaceItem of global.mockData.mcvv) {
        if (req.query.id == interfaceItem.id) {
            fieldMap = interfaceItem.fieldMap
            break
        }
    }
    let result
    if (fieldMap) {
        result = {
            code: 200,
            message: '查询成功',
            data: fieldMap
        }
    } else {
        result = {
            code: 502,
            message: '接口或用例不存在'
        }
    }
    return result
}