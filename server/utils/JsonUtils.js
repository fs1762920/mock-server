exports.diffAndDelete = function(json1, json2) {

    console.log("json1: "+JSON.stringify(json1))
    console.log("json2: "+JSON.stringify(json2))
    if (json2.length - Object.entries(json1).length !== 0) {
        return false
    }
    if (json2.length === 0 && Object.entries(json1).length === 0) {
        return true
    }

    for (let field of json2) {
        if (json1[field.name] && json1[field.name] == field.value) {
            delete json1[field.name]
        }
    }

    // for(let [key, value] of Object.entries(json1)) {
    //     if (json2[key] && value == json2[key]) {
    //         delete json2[key]
    //     }
    // }
    console.log(Object.entries(json1).length)
    if(Object.entries(json1).length !== 0) {
        return false
    }
    return true
}

exports.CompareAndDelete = function (json1, json2) {
    console.log("json1: "+JSON.stringify(json1))
    console.log("json2: "+JSON.stringify(json2))
    if (Object.entries(json1).length - Object.entries(json2).length !== 0) {
        return false
    }
    if (Object.entries(json1).length === 0 && Object.entries(json2).length === 0) {
        return true
    }

    for (let [key, value] of Object.entries(json1)) {
        if (json2[key] == value) {
            delete json2[key]
        }
    }
    console.log(Object.entries(json2).length)
    if(Object.entries(json2).length !== 0) {
        return false
    }
    return true
}

exports.loadMockData = function() {
    const fs = require('fs');
    let data = fs.readFileSync('./data/project.json', 'utf8');
    let mockData = JSON.parse(data.toString())
    return mockData
}