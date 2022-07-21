const express = require('express');
const router = express.Router();
const service = require('../service/business');


// 获取菜单数据
router.get('/menu', function(req, res, next) {
    let result = service.getMenuList(req, res)
    res.send(result)
});

// 获取指定接口数据
router.get('/mock', function(req, res, next) {
    let result = service.getMockData(req, res)
    res.send(result)
});

router.post('/addOrUpdateCase', function(req, res, next) {
    let result = service.addOrUpdateCase(req, res)
    res.send(result)
});

router.post('/updateCaseDetail', function(req, res, next) {
    let result = service.updateCaseDetail(req, res)
    res.send(result)
})

router.post('/addOrUpdateInterface', function(req, res, next) {
    let result = service.addOrUpdateInterface(req, res)
    res.send(result)
})

router.get('/deleteInterface', function(req, res, next) {
    let result = service.deleteInterface(req, res)
    res.send(result)
})

router.post('/deleteCase', function(req, res, next) {
    let result = service.deleteCase(req, res)
    res.send(result)
});

router.get('/getCaseList', function(req, res, next) {
    let result = service.getCaseList(req, res)
    res.send(result)
});

module.exports = router;
