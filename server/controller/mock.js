const express = require('express');
const service = require('../service/mock');
const mockRouter = express.Router();

mockRouter.all('/*', function(req, res, next) {
    let method = req.method
    let path = req.path
    let matchenInterface;
    for (let interfaceItem of global.mockData.mcvv) {
        if (interfaceItem.url === path && interfaceItem.method === method) {
            matchenInterface = interfaceItem
        }
    }
    if (matchenInterface) {
        console.log("matchenInterface: " + JSON.stringify(matchenInterface))
        let responseData
        if (method === 'GET') {
            console.log("GET")
            responseData = service.dispatchGetResponse(req.query, matchenInterface.fieldMap)
        } else {
            console.log("POST")
            responseData = service.dispatchPostResponse(req.body, matchenInterface.fieldMap)
        }
        res.send(responseData)
    } else {
        res.send('no path matched!')
    }
});

module.exports = mockRouter;